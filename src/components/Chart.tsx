import { useEffect, useRef, useState, memo } from 'react'
import {
    createChart,
    CandlestickSeries,
    type CandlestickData,
    type Time,
    type IChartApi,
    type ISeriesApi,
} from 'lightweight-charts'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'

import { useViewportSync } from '../hooks/charts/useViewportSync'
import { useCrosshairSync } from '../hooks/charts/useCrosshairSync'
import { DEFAULT_CHART_CONFIG } from '../config/default/ChartConfig'
import { TIME_SERIES_CONFIG } from '../config/default/TimeSeriesConfig'
import { useInfiniteScroll } from '../hooks/charts/useInfiniteScroll'
import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import { useChartData } from '../hooks/charts/useChartData'
import ReplayOverlay from './ReplayOverlay'

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const rightOffsetRef = useRef<number>(10)
    const visibleBarsRef = useRef<number>(100)
    const anchorTimeRef = useRef<number | null>(null)

    const whitespaceRatioRef = useRef<number>(0.1)

    const isChangingTimeframe = useRef<boolean>(false)
    const [isHovered, setIsHovered] = useState(false)
    const [chartReady, setChartReady] = useState<boolean>(false)

    const oldestLoadedFileRef = useRef(0)
    const totalFilesRef = useRef(0)
    const isLoadingOlderRef = useRef(false)

    const [previewTime, setPreviewTime] = useState<number | null>(null)
    const [previewX, setPreviewX] = useState<number | null>(null)
    const [, setStartX] = useState<number | null>(null)

    useEffect(() => {
        if (!replayStore.startTime || !chartRef.current) return

        const x = chartRef.current.timeScale().timeToCoordinate(replayStore.startTime as Time)

        setStartX(x)
    }, [previewTime])

    useViewportSync(
        chartRef,
        candlesRef,
        rightOffsetRef,
        visibleBarsRef,
        isChangingTimeframe,
        anchorTimeRef,
        whitespaceRatioRef,
        chartReady,
    )

    useInfiniteScroll({
        chartRef,
        seriesRef,
        candlesRef,
        candleMapRef,
        timesRef,
        ticker,
        timeframe,
        chartReady,
        oldestLoadedFileRef,
        totalFilesRef,
        isLoadingOlderRef,
    })

    useEffect(() => {
        const unsubscribe = eventBus.on('replayPreviewMove', ({ time }) => {
            setPreviewTime(time)
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        const chart = chartRef.current

        if (!chart || previewTime === null) {
            setPreviewX(null)
            return
        }

        const x = chart.timeScale().timeToCoordinate(previewTime as Time)

        if (x === null) {
            setPreviewX(null)
            return
        }

        setPreviewX(x)
    }, [previewTime])

    useEffect(() => {
        if (!containerRef.current) return

        const chartConfig = DEFAULT_CHART_CONFIG
        chartConfig.timeScale.rightOffset = rightOffsetRef.current
        const chart = createChart(containerRef.current, chartConfig)

        const timeSeriesConfig = TIME_SERIES_CONFIG
        const series = chart.addSeries(CandlestickSeries, timeSeriesConfig)

        chartRef.current = chart
        seriesRef.current = series
        setChartReady(true)

        return () => {
            chart.remove()
            setChartReady(false)
        }
    }, [])

    useEffect(() => {
        const chart = chartRef.current
        const el = containerRef.current
        if (!chart || !el) return

        const resize = () => {
            chart.applyOptions({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }

        const observer = new ResizeObserver(resize)
        observer.observe(el)
        resize()

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        chartRef.current?.applyOptions({
            crosshair: {
                horzLine: { visible: isHovered },
            },
        })
    }, [isHovered])

    useCrosshairSync(id, chartRef, seriesRef, candleMapRef, timesRef)

    useChartData({
        ticker,
        timeframe,
        chartReady,
        chartRef,
        seriesRef,
        candlesRef,
        candleMapRef,
        timesRef,
        rightOffsetRef,
        visibleBarsRef,
        anchorTimeRef,
        whitespaceRatioRef,
        oldestLoadedFileRef,
        totalFilesRef,
        setIsChangingTimeframe: (value) => {
            isChangingTimeframe.current = value
        },
    })

    useEffect(() => {
        const unsubscribe = eventBus.on('replayStart', ({ time }) => {
            const series = seriesRef.current

            if (!series) return

            const candles = candlesRef.current

            const replayIndex = candles.findIndex((c) => Number(c.time) >= time)

            if (replayIndex === -1) return

            replayStore.replayIndex = replayIndex

            const visibleCandles = candles.slice(0, replayIndex + 1)

            series.setData(visibleCandles)
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        const unsubscribe = eventBus.on('replayNextCandle', () => {
            const series = seriesRef.current

            if (!series) return

            const candles = candlesRef.current

            replayStore.replayIndex++

            if (replayStore.replayIndex >= candles.length) {
                replayStore.replayIndex = candles.length - 1

                return
            }

            const visibleCandles = candles.slice(0, replayStore.replayIndex + 1)

            series.setData(visibleCandles)
        })

        return unsubscribe
    }, [])

    const handleReplaySelection = () => {
        if (!replayStore.isSelecting) return
        if (!replayStore.showToolbar) return
        if (previewTime === null) return

        replayStore.start(previewTime)

        setPreviewTime(null)
        setPreviewX(null)

        eventBus.emit('replayStart', {
            time: previewTime,
        })
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleReplaySelection}
                style={{ width: '100%', height: '100%' }}
            />

            {replayStore.showToolbar && replayStore.isSelecting && previewX !== null && <ReplayOverlay x={previewX} />}
        </div>
    )
}

export default memo(Chart)
