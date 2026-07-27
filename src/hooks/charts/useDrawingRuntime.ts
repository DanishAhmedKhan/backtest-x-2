import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import { DrawingContext } from '../../drawing/DrawingContext'
import { PointerController } from '../../drawing/controller/PointerController'
import { ToolController } from '../../drawing/ToolController'
import { CoordinateTransformer } from '../../drawing/renderer/CoordinateTransformer'
import { DrawingCanvasRenderer } from '../../drawing/renderer/DrawingCanvasRenderer'
import { ChartSnapshot } from '../../drawing/renderer/ChartSnapshot'
import { RenderLoop } from '../../drawing/renderer/RenderLoop'
import { HoverController } from '../../drawing/controller/HoverController'
import { SelectionController } from '../../drawing/controller/SelectionController'
import { EditController } from '../../drawing/controller/EditController'

type Params = {
    chart: IChartApi | null
    series: ISeriesApi<'Candlestick'> | null
    canvas: HTMLCanvasElement | null
    container: HTMLDivElement | null
}

export function useDrawingRuntime({ chart, series, canvas, container }: Params) {
    const drawingContextRef = useRef<DrawingContext | null>(null)

    const pointerControllerRef = useRef<PointerController | null>(null)
    const toolControllerRef = useRef<ToolController | null>(null)

    useEffect(() => {
        if (!chart || !series || !canvas || !container) {
            return
        }

        if (!drawingContextRef.current) {
            drawingContextRef.current = new DrawingContext()
        }

        const context = drawingContextRef.current

        const transformer = new CoordinateTransformer(chart, series)

        const renderer = new DrawingCanvasRenderer(
            context.drawingManager,
            context.previewDrawingManager,
            context.rendererManager,
            context.drawingStateManager,
            canvas,
            chart,
            series,
        )

        const snapshot = new ChartSnapshot(chart, series, container)

        const renderLoop = new RenderLoop(snapshot, () => {
            renderer.render()
        })

        renderLoop.start()

        const hoverController = new HoverController(
            context.drawingStateManager,
            context.hitTestManager,
            transformer,
            renderLoop,
        )

        const selectionController = new SelectionController(
            context.drawingStateManager,
            context.hitTestManager,
            transformer,
            renderLoop,
        )

        toolControllerRef.current = new ToolController(context.toolManager, chart)

        toolControllerRef.current.syncChartInteraction()

        const editController = new EditController(
            context.hitTestManager,
            transformer,
            context.editingSession,
            context.editorManager,
            renderLoop,
            toolControllerRef.current,
        )

        pointerControllerRef.current = new PointerController(
            context.toolManager,
            hoverController,
            selectionController,
            editController,
            transformer,
        )

        const unsub1 = context.drawingManager.subscribeChanged(() => {
            renderLoop.invalidate()
        })

        const unsub2 = context.previewDrawingManager.subscribeChanged(() => {
            renderLoop.invalidate()
        })

        const unsub3 = context.drawingStateManager.subscribeChanged(() => {
            renderLoop.invalidate()
        })

        return () => {
            unsub1()
            unsub2()
            unsub3()

            renderLoop.stop()

            pointerControllerRef.current = null
            toolControllerRef.current = null
        }
    }, [chart, series, canvas, container])

    return {
        drawingContextRef,
        pointerControllerRef,
        toolControllerRef,
    }
}
