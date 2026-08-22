import { useEffect, useRef, useState, memo } from 'react'
import type { CandlestickData, Time } from 'lightweight-charts'

import ChartOHLC from './ChartOHLC'
import ReplayOverlay from './ReplayOverlay'
import DrawingCanvas from './DrawingCanvas'
import ChartNoData from './ChartNoData'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import type { Candle } from '../core/Candle'

import { useChart } from '../hooks/charts/useChart'
import { useChartData } from '../hooks/charts/useChartData'
import { useChartLayout } from '../hooks/charts/useChartLayout'
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
import { useChartRuntime } from '../hooks/charts/useChartRuntime'
import { useIndicators } from '../hooks/charts/useIndicators'

import { ChartRuntime } from '../drawing/runtime/ChartRuntime'
import { ToolType } from '../drawing/tools/ToolType'
import { DrawingContext } from '../drawing/DrawingContext'
import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'
import { DrawingPersistence } from '../drawing/persistence/DrawingPersistence'
import { PaneGeometry } from '../drawing/renderer/PaneGeometry'
import { toolStore } from '../drawing/tools/ToolStore'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import type { ViewportState } from '../types/Viewport'
import { captureViewportAroundTime } from '../hooks/utilities/viewport'
import { binarySearch } from '../helper/binarySearch'

import { DEFAULT_BLANK_CANDLE, DEFAULT_VISIBLE_CANDLE } from '../config/default/CandleConfig'
import { CursorType } from '../core/cursor/CursorType'
import { CursorSource } from '../core/cursor/CursorSource'
import IndicatorList from './IndicatorList'

export type Raw1mData = {
    candles: Candle[]
    times: number[]
}

export type ChartDataStatus = 'loading' | 'ready' | 'no-data'

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
    const displayedCandlesRef = useRef<CandlestickData<Time>[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const raw1mRef = useRef<Raw1mData>({
        candles: [],
        times: [],
    })

    const [chartDataStatus, setChartDataStatus] = useState<ChartDataStatus>('loading')

    const defaultViewport = {
        visibleBars: DEFAULT_VISIBLE_CANDLE,
        rightWhitespace: DEFAULT_BLANK_CANDLE,
        barsAfterViewport: 0,
    }

    const viewportRef = useRef<ViewportState>(defaultViewport)
    const replayViewportRef = useRef<ViewportState>(defaultViewport)

    const replayPointerDownRef = useRef(false)

    const isDraggingRef = useRef(false)
    const isViewportInteractionRef = useRef(false)
    const wheelTimeout = useRef<number>(0)

    const isChangingTimeframeRef = useRef<boolean>(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isPaneHovered, setIsPaneHovered] = useState(false)
    const [replayCursorY, setReplayCursorY] = useState<number | null>(null)

    const loadedWindowRef = useRef({
        oldestFile: 0,
        latestFile: 0,
    })

    const totalFilesRef = useRef(0)
    const isLoadingDataRef = useRef(false)

    const drawingContextRef = useRef<DrawingContext | null>(null)
    const runtimeRef = useRef<ChartRuntime | null>(null)

    const drawingPersistenceRef = useRef<DrawingPersistence | null>(null)
    const drawingPersistenceTickerRef = useRef<string | null>(null)

    const paneGeometryRef = useRef<PaneGeometry | null>(null)

    const { chartRef, seriesRef, chartReady } = useChart(containerRef)

    const { paneLayout, refreshPaneLayout } = useChartLayout({
        containerRef,
        chartRef,
        paneGeometryRef,
    })

    const { previewTime, previewX, clearPreview } = useReplayPreview({
        chartRef,
    })

    useIndicators({
        chartRef,
        displayedCandlesRef,
        chartReady,
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
        displayedCandlesRef,
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
        displayedCandlesRef,
        candleMapRef,
        timesRef,
        raw1mRef,
        loadedWindowRef,
        totalFilesRef,
        viewportRef,
        setChartDataStatus,
        refreshPaneLayout,
        setIsChangingTimeframe: (value) => {
            isChangingTimeframeRef.current = value
        },
    })

    useReplaySync({
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        displayedCandlesRef,
        viewportRef,
        replayViewportRef,
    })

    useJumpTo({
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        displayedCandlesRef,
        raw1mRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        isLoadingDataRef,
        viewportRef,
    })

    useDrawingCanvas({
        canvasRef: drawingCanvasRef,
    })

    useChartRuntime({
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        drawingCanvasRef,
        containerRef,
        timesRef,
        onDrawingToolbarManagerReady,
        chartReady,
        drawingPersistenceRef,
        drawingPersistenceTickerRef,
        paneGeometryRef,
        drawingContextRef,
        runtimeRef,
    })

    useDrawingTools({
        chartRef,
        containerRef,
        runtimeRef,
    })

    useToolSync({
        runtimeRef,
    })

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
            toolStore.select(ToolType.Pan, false)
        })

        return unsubscribe
    }, [])

    const isInsidePane = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!paneLayout) {
            return false
        }

        const rect = event.currentTarget.getBoundingClientRect()

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        return (
            x >= paneLayout.left &&
            x <= paneLayout.left + paneLayout.width &&
            y >= paneLayout.top &&
            y <= paneLayout.top + paneLayout.height
        )
    }

    const handlePaneMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const inside = isInsidePane(event)

        setIsPaneHovered(inside)

        if (inside) {
            const rect = event.currentTarget.getBoundingClientRect()
            setReplayCursorY(event.clientY - rect.top)
        } else {
            setReplayCursorY(null)
        }
    }

    const handleReplaySelection = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!replayPointerDownRef.current) return

        if (!replayStore.isSelecting) return
        if (previewTime === null) return
        if (!paneLayout) return

        if (!isInsidePane(event)) return

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

        replayStore.openToolbar()

        clearPreview()

        eventBus.emit('replayUpdateIntervalChanged', {
            seconds: timeframe.toSeconds(),
        })

        eventBus.emit('replayStart')

        replayPointerDownRef.current = false
    }

    const showReplayOverlay =
        replayStore.isSelecting && isPaneHovered && previewTime !== null && previewX !== null && paneLayout !== null

    useEffect(() => {
        chartRef.current?.applyOptions({
            crosshair: {
                vertLine: {
                    visible: !showReplayOverlay,
                    labelBackgroundColor: showReplayOverlay ? '#2962ff' : '#000',
                },
                horzLine: {
                    visible: !showReplayOverlay && isHovered,
                },
            },
        })
    }, [showReplayOverlay, isHovered, chartRef])

    useEffect(() => {
        const cursorController = runtimeRef.current?.getCursorController()

        if (!cursorController) {
            return
        }

        if (showReplayOverlay) {
            cursorController.request(CursorSource.Replay, CursorType.None)
        } else {
            cursorController.clear(CursorSource.Replay)
        }
    }, [showReplayOverlay])

    return (
        <div className="chart">
            {chartDataStatus !== 'no-data' && <ChartOHLC ohlc={ohlc} />}
            {chartDataStatus !== 'no-data' && <IndicatorList />}

            <div
                className="chart-container"
                ref={containerRef}
                onWheel={() => {
                    isViewportInteractionRef.current = true

                    clearTimeout(wheelTimeout.current)

                    wheelTimeout.current = window.setTimeout(() => {
                        isViewportInteractionRef.current = false
                    }, 150)
                }}
                onMouseDown={(event) => {
                    replayPointerDownRef.current = isInsidePane(event)

                    if (!runtimeRef.current.getToolController()?.allowsViewportInteraction()) {
                        return
                    }

                    isDraggingRef.current = true
                    isViewportInteractionRef.current = true
                }}
                onMouseEnter={() => {
                    setIsHovered(true)
                }}
                onMouseLeave={() => {
                    setIsHovered(false)
                    setIsPaneHovered(false)
                    setReplayCursorY(null)
                }}
                onMouseMove={handlePaneMouseMove}
                onClick={handleReplaySelection}
            />

            <DrawingCanvas ref={drawingCanvasRef} />

            {showReplayOverlay && <ReplayOverlay x={previewX} y={replayCursorY} pane={paneLayout} />}

            {chartDataStatus === 'no-data' && <ChartNoData ticker={ticker} />}
        </div>
    )
}

export default memo(Chart)
