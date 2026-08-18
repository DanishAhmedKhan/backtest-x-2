import React, { useEffect } from 'react'
import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import { DrawingContext } from '../../drawing/DrawingContext'
import { ChartRuntime } from '../../drawing/runtime/ChartRuntime'
import { DrawingPersistence } from '../../drawing/persistence/DrawingPersistence'
import { Ticker } from '../../core/Ticker'
import type { Timeframe } from '../../core/Timeframe'
import { PaneGeometry } from '../../drawing/renderer/PaneGeometry'
import type { DrawingToolbarManager } from '../../drawing/toolbar/DrawingToolbarManager'

type Params = {
    ticker: Ticker
    timeframe: Timeframe
    chartRef: React.RefObject<IChartApi | null>
    seriesRef: React.RefObject<ISeriesApi<'Candlestick'> | null>
    drawingCanvasRef: React.RefObject<HTMLCanvasElement | null>
    containerRef: React.RefObject<HTMLDivElement | null>
    timesRef: React.RefObject<number[]>
    onDrawingToolbarManagerReady?: (manager: DrawingToolbarManager) => void
    chartReady: boolean
    drawingPersistenceRef: React.RefObject<DrawingPersistence | null>
    drawingPersistenceTickerRef: React.RefObject<string | null>
    paneGeometryRef: React.RefObject<PaneGeometry | null>
    drawingContextRef: React.RefObject<DrawingContext | null>
    runtimeRef: React.RefObject<ChartRuntime | null>
}

export function useChartRuntime({
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
}: Params) {
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

        if (drawingPersistenceTickerRef.current !== ticker.toKey()) {
            drawingPersistenceRef.current?.stop()

            drawingContext.drawingManager.clearDrawing()

            const persistence = new DrawingPersistence(drawingContext.drawingManager, ticker.toKey())

            drawingPersistenceRef.current = persistence
            drawingPersistenceTickerRef.current = ticker.toKey()

            persistence.start()
        }

        paneGeometryRef.current = new PaneGeometry(container)

        runtimeRef.current = new ChartRuntime({
            chart,
            series,
            canvas,
            container,
            drawingContext,
            timesRef,
            timeframe,
            paneGeometry: paneGeometryRef.current,
        })

        runtimeRef.current.start()

        onDrawingToolbarManagerReady?.(runtimeRef.current.getDrawingToolbarManager())

        return () => {
            drawingPersistenceRef.current?.stop()
            drawingPersistenceRef.current = null
            drawingPersistenceTickerRef.current = null

            runtimeRef.current?.dispose()
            runtimeRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartReady])
}
