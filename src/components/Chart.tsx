import { useEffect, useRef, useCallback, useState, memo } from 'react'
import {
    createChart,
    CandlestickSeries,
    CrosshairMode,
    type CandlestickData,
    type Time,
    type IChartApi,
    type ISeriesApi,
    type MouseEventParams,
} from 'lightweight-charts'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { CandleService } from '../core/CandleService'
import { eventBus } from '../event/EventBus'

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

    const allCandlesRef = useRef<CandlestickData<Time>[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())

    const fileIndexRef = useRef<number>(0)
    const loadingRef = useRef(false)
    const lastLoadRef = useRef(0)
    const timesRef = useRef<number[]>([])

    const [isHovered, setIsHovered] = useState(false)

    const LOAD_COOLDOWN = 500

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#0f0f0f' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#1e1e1e' },
                horzLines: { color: '#1e1e1e' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                horzLine: {
                    visible: false,
                },
            },
            timeScale: {
                timeVisible: true,
            },
        })

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            borderVisible: false,
            priceFormat: { type: 'price', precision: 5, minMove: 0.00001 },
        })

        chartRef.current = chart
        seriesRef.current = series

        return () => chart.remove()
    }, [])

    useEffect(() => {
        const container = chartContainerRef.current
        const chart = chartRef.current
        if (!container || !chart) return

        const resize = () => {
            chart.applyOptions({
                width: container.clientWidth,
                height: container.clientHeight,
            })
        }

        const observer = new ResizeObserver(resize)
        observer.observe(container)
        resize()

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        chart.applyOptions({
            crosshair: {
                horzLine: {
                    visible: isHovered,
                },
            },
        })
    }, [isHovered])

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const handler = (param: MouseEventParams<Time>) => {
            if (!param.time || typeof param.time !== 'number') {
                eventBus.emit('crosshairMove', {
                    time: null,
                    sourceId: id,
                })
                return
            }

            eventBus.emit('crosshairMove', {
                time: param.time,
                sourceId: id,
            })
        }

        chart.subscribeCrosshairMove(handler)
        return () => chart.unsubscribeCrosshairMove(handler)
    }, [id])

    useEffect(() => {
        const unsubscribe = eventBus.on('crosshairMove', ({ time, sourceId }) => {
            if (sourceId === id) return

            const chart = chartRef.current
            const series = seriesRef.current

            if (!chart || !series) return

            if (!time) {
                chart.clearCrosshairPosition()
                return
            }

            const candle = candleMapRef.current.get(time)

            if (!candle) {
                chart.clearCrosshairPosition()
                return
            }

            chart.setCrosshairPosition(candle.close, candle.time, series)
        })

        return unsubscribe
    }, [id])

    useEffect(() => {
        const loadInitial = async () => {
            if (!seriesRef.current) return

            const raw = await CandleService.getCandles(ticker, timeframe)

            const formatted: CandlestickData<Time>[] = raw.map((c) => ({
                time: c.time as Time,
                open: c.open,
                high: c.high,
                low: c.low,
                close: c.close,
            }))

            allCandlesRef.current = formatted

            candleMapRef.current.clear()
            for (const c of formatted) {
                candleMapRef.current.set(Number(c.time), c)
            }

            const totalFiles = await CandleService.getTotalFiles(ticker)
            fileIndexRef.current = totalFiles - 2

            seriesRef.current.setData(formatted)
            chartRef.current?.timeScale().scrollToRealTime()
        }

        loadInitial()
    }, [ticker, timeframe])

    const loadMore = useCallback(async () => {
        const now = Date.now()

        if (loadingRef.current) return
        if (now - lastLoadRef.current < LOAD_COOLDOWN) return
        if (fileIndexRef.current <= 0) return

        loadingRef.current = true
        lastLoadRef.current = now

        const chart = chartRef.current
        if (!chart) return

        const start = fileIndexRef.current - 2
        if (start < 0) {
            loadingRef.current = false
            return
        }

        const more = await CandleService.getOlderCandles(ticker, timeframe, start, 2)
        if (!more.length) {
            loadingRef.current = false
            return
        }

        fileIndexRef.current = start

        const formatted: CandlestickData<Time>[] = more.map((c) => ({
            time: c.time as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }))

        formatted.sort((a, b) => Number(a.time) - Number(b.time))

        const logicalRange = chart.timeScale().getVisibleLogicalRange()

        const merged = [...formatted, ...allCandlesRef.current]

        const map = new Map<number, CandlestickData<Time>>()
        for (const c of merged) {
            map.set(Number(c.time), c)
        }

        allCandlesRef.current = Array.from(map.values()).sort((a, b) => Number(a.time) - Number(b.time))

        candleMapRef.current.clear()
        for (const c of allCandlesRef.current) {
            candleMapRef.current.set(Number(c.time), c)
        }

        seriesRef.current!.setData(allCandlesRef.current)

        if (logicalRange) {
            chart.timeScale().setVisibleLogicalRange({
                from: logicalRange.from + formatted.length,
                to: logicalRange.to + formatted.length,
            })
        }

        loadingRef.current = false
    }, [ticker, timeframe])

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return

        const timeScale = chart.timeScale()

        const handler = async () => {
            const range = timeScale.getVisibleLogicalRange()
            if (!range) return

            if (range.from < 30 && !loadingRef.current) {
                await loadMore()
            }
        }

        timeScale.subscribeVisibleLogicalRangeChange(handler)

        return () => {
            timeScale.unsubscribeVisibleLogicalRangeChange(handler)
        }
    }, [loadMore])

    return (
        <div
            ref={chartContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: '100%',
                height: '100%',
                contain: 'layout size style',
            }}
        />
    )
}

export default memo(Chart)
