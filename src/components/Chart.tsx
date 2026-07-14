import { useEffect, useRef, useState, memo } from 'react'
import type { CandlestickData, Time } from 'lightweight-charts'

import ReplayOverlay from './ReplayOverlay'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import type { Candle } from '../core/Candle'

import { useChart } from '../hooks/charts/useChart'
import { useChartData } from '../hooks/charts/useChartData'
import { useChartResize } from '../hooks/charts/useChartResize'
import { useViewportSync } from '../hooks/charts/useViewportSync'
import { useCrosshairSync } from '../hooks/charts/useCrosshairSync'
import { useInfiniteScroll } from '../hooks/charts/useInfiniteScroll'
import { useReplayPreview } from '../hooks/charts/useReplayPreview'
import { useReplaySync } from '../hooks/charts/useReplaySync'
import { useJumpTo } from '../hooks/charts/useJumpTo'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import type { ViewportState } from '../types/Viewport'
import { captureViewportAroundTime } from '../hooks/utilities/viewport'

import { DEFAULT_BLANK_CANDLE, DEFAULT_VISIBLE_CANDLE } from '../config/default/CandleConfig'

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const raw1mCandlesRef = useRef<Candle[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const defaultViewport = {
        visibleBars: DEFAULT_VISIBLE_CANDLE,
        rightWhitespace: DEFAULT_BLANK_CANDLE,
        barsAfterViewport: 0,
    }

    const viewportRef = useRef<ViewportState>(defaultViewport)
    const replayViewportRef = useRef<ViewportState>(defaultViewport)

    const isUserInteractingRef = useRef(false)
    const wheelTimeout = useRef<number>(0)

    const isChangingTimeframeRef = useRef<boolean>(false)
    const [isHovered, setIsHovered] = useState(false)

    const loadedWindowRef = useRef({
        oldestFile: 0,
        latestFile: 0,
    })

    const totalFilesRef = useRef(0)
    const isLoadingDataRef = useRef(false)

    const { chartRef, seriesRef, chartReady } = useChart(containerRef)

    const { previewTime, previewX, clearPreview } = useReplayPreview({
        chartRef,
    })

    useViewportSync({
        chartRef,
        seriesRef,
        isChangingTimeframeRef,
        isLoadingDataRef,
        chartReady,
        viewportRef,
        replayViewportRef,
        isUserInteractingRef,
    })

    useInfiniteScroll({
        chartRef,
        seriesRef,
        candlesRef,
        candleMapRef,
        timesRef,
        ticker,
        timeframe,
        chartReady,
        loadedWindowRef,
        totalFilesRef,
        isLoadingDataRef,
        isChangingTimeframeRef,
        isUserInteractingRef,
    })

    useChartResize({
        containerRef,
        chartRef,
    })

    useCrosshairSync({
        id,
        chartRef,
        seriesRef,
        candleMapRef,
        timesRef,
    })

    useChartData({
        ticker,
        timeframe,
        chartReady,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        totalFilesRef,
        viewportRef,
        setIsChangingTimeframe: (value) => {
            isChangingTimeframeRef.current = value
        },
    })

    useReplaySync({
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
        viewportRef,
        replayViewportRef,
    })

    useJumpTo({
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        viewportRef,
    })

    useEffect(() => {
        chartRef.current?.applyOptions({
            crosshair: {
                horzLine: { visible: isHovered },
            },
        })
    }, [chartRef, isHovered])

    useEffect(() => {
        if (!replayStore.enabled) {
            return
        }

        const seconds = timeframe.toSeconds()

        replayStore.setChartTimeframeSeconds(seconds)
        replayStore.setUpdateIntervalSeconds(seconds)

        eventBus.emit('replayUpdateIntervalChanged', {
            seconds,
        })
    }, [timeframe])

    useEffect(() => {
        const handleMouseUp = () => {
            if (!isUserInteractingRef.current) {
                return
            }

            isUserInteractingRef.current = false
            eventBus.emit('chartDragEnded')
        }

        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    const handleReplaySelection = () => {
        if (!replayStore.isSelecting) return
        if (!replayStore.showToolbar) return
        if (previewTime === null) return

        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series) {
            return
        }

        captureViewportAroundTime({
            chart,
            candles: candlesRef.current,
            viewport: replayViewportRef,
            timestamp: previewTime,
        })

        replayStore.start(previewTime, timeframe.toSeconds())

        clearPreview()

        eventBus.emit('replayStart', {
            time: previewTime,
        })
    }

    const showReplayOverlay = replayStore.showToolbar && replayStore.isSelecting && previewX !== null

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
                onWheel={() => {
                    isUserInteractingRef.current = true

                    clearTimeout(wheelTimeout.current)

                    wheelTimeout.current = window.setTimeout(() => {
                        isUserInteractingRef.current = false
                    }, 150)
                }}
                onMouseDown={() => {
                    isUserInteractingRef.current = true
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleReplaySelection}
                style={{ width: '100%', height: '100%' }}
            />

            {showReplayOverlay && <ReplayOverlay x={previewX} />}
        </div>
    )
}

export default memo(Chart)
