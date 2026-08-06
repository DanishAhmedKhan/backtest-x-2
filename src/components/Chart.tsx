import { useEffect, useRef, useState, memo } from 'react'
import type { CandlestickData, Time } from 'lightweight-charts'

import ChartOHLC from './ChartOHLC'
import ReplayOverlay from './ReplayOverlay'
import DrawingCanvas from './DrawingCanvas'

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
import { useOHLCOverlay } from '../hooks/charts/useOHLCOverlay'
import { useDrawingTools } from '../hooks/charts/useDrawingTool'
import { useToolSync } from '../hooks/drawings/useToolSync'
import { useDrawingCanvas } from '../hooks/drawings/useDrawingCanvas'

import { ChartRuntime } from '../drawing/runtime/ChartRuntime'
import { ToolType } from '../drawing/tools/ToolType'
import { DrawingContext } from '../drawing/DrawingContext'
import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'
import { toolStore } from '../drawing/ToolStore'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import type { ViewportState } from '../types/Viewport'
import { captureViewportAroundTime } from '../hooks/utilities/viewport'
import { binarySearch } from '../helper/binarySearch'

import { DEFAULT_BLANK_CANDLE, DEFAULT_VISIBLE_CANDLE } from '../config/default/CandleConfig'

export type Raw1mData = {
    candles: Candle[]
    times: number[]
}

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
    onDrawingToolbarManagerReady?: (manager: DrawingToolbarManager) => void
}

function Chart({ id, ticker, timeframe, onDrawingToolbarManagerReady }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const raw1mRef = useRef<Raw1mData>({
        candles: [],
        times: [],
    })

    const defaultViewport = {
        visibleBars: DEFAULT_VISIBLE_CANDLE,
        rightWhitespace: DEFAULT_BLANK_CANDLE,
        barsAfterViewport: 0,
    }

    const viewportRef = useRef<ViewportState>(defaultViewport)
    const replayViewportRef = useRef<ViewportState>(defaultViewport)

    const isDraggingRef = useRef(false)
    const isViewportInteractionRef = useRef(false)
    const wheelTimeout = useRef<number>(0)

    const isChangingTimeframeRef = useRef<boolean>(false)
    const [isHovered, setIsHovered] = useState(false)

    const loadedWindowRef = useRef({
        oldestFile: 0,
        latestFile: 0,
    })

    const totalFilesRef = useRef(0)
    const isLoadingDataRef = useRef(false)

    const drawingContextRef = useRef<DrawingContext | null>(null)
    const runtimeRef = useRef<ChartRuntime | null>(null)

    const { chartRef, seriesRef, chartReady } = useChart(containerRef)

    const { previewTime, previewX, clearPreview } = useReplayPreview({
        chartRef,
    })

    const ohlc = useOHLCOverlay({
        chartRef,
        seriesRef,
    })

    useViewportSync({
        chartRef,
        seriesRef,
        isChangingTimeframeRef,
        isLoadingDataRef,
        chartReady,
        viewportRef,
        isViewportInteractionRef,
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
        raw1mRef,
        loadedWindowRef,
        totalFilesRef,
        isLoadingDataRef,
        isChangingTimeframeRef,
        isViewportInteractionRef,
        viewportRef,
        runtimeRef,
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
        candleMapRef,
        timesRef,
        raw1mRef,
        loadedWindowRef,
        totalFilesRef,
        viewportRef,
        runtimeRef,
        setIsChangingTimeframe: (value) => {
            isChangingTimeframeRef.current = value
        },
    })

    useReplaySync({
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        viewportRef,
        replayViewportRef,
    })

    useJumpTo({
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        viewportRef,
    })

    useDrawingCanvas({
        canvasRef: drawingCanvasRef,
    })

    useEffect(() => {
        const chart = chartRef.current
        const series = seriesRef.current
        const canvas = drawingCanvasRef.current
        const container = containerRef.current

        if (!chart || !series || !canvas) return
        if (!container) return

        if (!drawingContextRef.current) {
            drawingContextRef.current = new DrawingContext()
        }

        const drawingContext = drawingContextRef.current

        runtimeRef.current = new ChartRuntime({
            chart,
            series,
            canvas,
            container,
            drawingContext,
            timesRef,
            timeframe,
        })

        runtimeRef.current.start()

        onDrawingToolbarManagerReady?.(runtimeRef.current.getDrawingToolbarManager())

        return () => {
            runtimeRef.current?.dispose()
            runtimeRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartReady])

    useDrawingTools({
        chartRef,
        containerRef,
        runtimeRef,
    })

    useToolSync({
        runtimeRef,
    })

    useEffect(() => {
        chartRef.current?.applyOptions({
            crosshair: {
                horzLine: { visible: isHovered },
            },
        })
    }, [chartRef, isHovered])

    useEffect(() => {
        const handleMouseUp = () => {
            if (!isDraggingRef.current) {
                return
            }

            isDraggingRef.current = false
            isViewportInteractionRef.current = false

            eventBus.emit('chartDragEnded')
        }
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [])

    useEffect(() => {
        const unsubscribe = eventBus.on('drawingCompleted', () => {
            toolStore.select(ToolType.Pan)
        })

        return unsubscribe
    }, [])

    const handleReplaySelection = () => {
        if (!replayStore.isSelecting) return
        if (!replayStore.showToolbar) return
        if (previewTime === null) return

        const chart = chartRef.current
        const series = seriesRef.current

        if (!chart || !series) return

        captureViewportAroundTime({
            chart,
            candles: candlesRef.current,
            viewport: replayViewportRef,
            timestamp: previewTime,
        })

        const { left: startIndex, exact } = binarySearch(raw1mRef.current.times, previewTime)

        if (!exact) {
            console.error('Replay start candle not found.')
            return
        }

        replayStore.start(startIndex, raw1mRef.current.candles, timeframe.toSeconds())

        clearPreview()

        eventBus.emit('replayUpdateIntervalChanged', {
            seconds: timeframe.toSeconds(),
        })

        eventBus.emit('replayStart')
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
            <ChartOHLC ohlc={ohlc} />
            <div
                ref={containerRef}
                onWheel={() => {
                    isViewportInteractionRef.current = true

                    clearTimeout(wheelTimeout.current)

                    wheelTimeout.current = window.setTimeout(() => {
                        isViewportInteractionRef.current = false
                    }, 150)
                }}
                onMouseDown={() => {
                    if (!runtimeRef.current.getToolController()?.allowsViewportInteraction()) {
                        return
                    }

                    isDraggingRef.current = true
                    isViewportInteractionRef.current = true
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleReplaySelection}
                style={{ width: '100%', height: '100%' }}
            />

            <DrawingCanvas ref={drawingCanvasRef} />

            {showReplayOverlay && <ReplayOverlay x={previewX} />}
        </div>
    )
}

export default memo(Chart)
