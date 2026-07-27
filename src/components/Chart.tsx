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

import { ToolType } from '../drawing/tools/ToolType'
import { DrawingContext } from '../drawing/DrawingContext'
import { PointerController } from '../drawing/input/PointerController'
import { ToolController } from '../drawing/ToolController'
import { CoordinateTransformer } from '../drawing/renderer/CoordinateTransformer'
import { DrawingCanvasRenderer } from '../drawing/renderer/DrawingCanvasRenderer'
import { RenderLoop } from '../drawing/renderer/RenderLoop'
import { ChartSnapshot } from '../drawing/renderer/ChartSnapshot'
import { HoverController } from '../drawing/input/HoverController'
import { toolStore } from '../drawing/ToolStore'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import type { ViewportState } from '../types/Viewport'
import { captureViewportAroundTime } from '../hooks/utilities/viewport'
import { binarySearch } from '../helper/binarySearch'

import { DEFAULT_BLANK_CANDLE, DEFAULT_VISIBLE_CANDLE } from '../config/default/CandleConfig'
import { SelectionController } from '../drawing/input/SelectionController'

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const raw1mCandlesRef = useRef<Candle[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])
    const raw1mTimesRef = useRef<number[]>([])

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
    const pointerControllerRef = useRef<PointerController | null>(null)
    const toolControllerRef = useRef<ToolController | null>(null)
    const drawingCanvasRendererRef = useRef<DrawingCanvasRenderer | null>(null)
    const renderLoopRef = useRef<RenderLoop | null>(null)

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
        loadedWindowRef,
        totalFilesRef,
        isLoadingDataRef,
        isChangingTimeframeRef,
        isViewportInteractionRef,
        viewportRef,
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
        raw1mTimesRef,
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

    useToolSync({
        controllerRef: toolControllerRef,
    })

    useDrawingCanvas({
        canvasRef: drawingCanvasRef,
        containerRef,
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
        const chart = chartRef.current
        const series = seriesRef.current
        const canvas = drawingCanvasRef.current
        const container = containerRef.current

        if (!chart || !series || !canvas) return

        if (!container) return

        if (pointerControllerRef.current) return

        if (!drawingContextRef.current) {
            drawingContextRef.current = new DrawingContext()
        }

        const transformer = new CoordinateTransformer(chart, series)

        const hoverController = new HoverController(
            drawingContextRef.current.drawingManager,
            drawingContextRef.current.drawingStateManager,
            drawingContextRef.current.hitTestManager,
            transformer,
        )

        const selectionController = new SelectionController(
            drawingContextRef.current.drawingManager,
            drawingContextRef.current.drawingStateManager,
            drawingContextRef.current.hitTestManager,
            transformer,
        )

        pointerControllerRef.current = new PointerController(
            drawingContextRef.current.toolManager,
            hoverController,
            selectionController,
            transformer,
        )

        toolControllerRef.current = new ToolController(drawingContextRef.current.toolManager, chart)
        toolControllerRef.current.syncChartInteraction()

        drawingCanvasRendererRef.current = new DrawingCanvasRenderer(
            drawingContextRef.current.drawingManager,
            drawingContextRef.current.previewDrawingManager,
            drawingContextRef.current.rendererManager,
            drawingContextRef.current.drawingStateManager,
            canvas,
            chart,
            series,
        )

        const snapshot = new ChartSnapshot(chart, series, container)

        renderLoopRef.current = new RenderLoop(snapshot, () => {
            drawingCanvasRendererRef.current?.render()
        })

        renderLoopRef.current.start()

        const unsubscribeDrawings = drawingContextRef.current.drawingManager.subscribeChanged(() => {
            renderLoopRef.current?.invalidate()
        })

        const unsubscribePreview = drawingContextRef.current.previewDrawingManager.subscribeChanged(() => {
            renderLoopRef.current?.invalidate()
        })

        return () => {
            unsubscribeDrawings()
            unsubscribePreview()

            renderLoopRef.current?.stop()

            pointerControllerRef.current = null
            toolControllerRef.current = null
            drawingCanvasRendererRef.current = null
            renderLoopRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartReady])

    useEffect(() => {
        const unsubscribe = eventBus.on('drawingCompleted', () => {
            toolStore.select(ToolType.Pan)
        })

        return unsubscribe
    }, [])

    useDrawingTools({
        chartRef,
        containerRef,
        pointerControllerRef,
    })

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

        const { left: startIndex } = binarySearch(raw1mTimesRef.current, previewTime)

        replayStore.start(startIndex, raw1mCandlesRef.current, timeframe.toSeconds())

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
                    if (!toolControllerRef.current?.allowsViewportInteraction()) {
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
