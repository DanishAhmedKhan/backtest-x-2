import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import { TimeCoordinateResolver } from '../renderer/TimeCoordinateResolver'
import { DrawingCanvasRenderer } from '../renderer/DrawingCanvasRenderer'
import { ChartSnapshot } from '../renderer/ChartSnapshot'
import { RenderLoop } from '../renderer/RenderLoop'
import type { DrawingContext } from '../DrawingContext'
import { PointerController } from '../controller/PointerController'
import { ToolController } from '../ToolController'
import { CursorManager } from '../CursorManager'
import { HoverController } from '../controller/HoverController'
import { SelectionController } from '../controller/SelectionController'
import { EditController } from '../controller/EditController'
import type { RawPointerEvent } from '../models/RawPointerEvent'

type Params = {
    chart: IChartApi
    series: ISeriesApi<'Candlestick'>
    canvas: HTMLCanvasElement
    container: HTMLDivElement
    drawingContext: DrawingContext
    timesRef: React.RefObject<number[]>
}

export class ChartRuntime {
    public readonly transformer: CoordinateTransformer
    public readonly timeResolver: TimeCoordinateResolver
    public readonly renderLoop: RenderLoop
    public readonly pointerController: PointerController
    public readonly toolController: ToolController
    private readonly drawingCanvasRenderer: DrawingCanvasRenderer

    private readonly unsubscribers: (() => void)[] = []

    constructor(private readonly params: Params) {
        const { chart, series, canvas, container, drawingContext, timesRef } = params

        this.timeResolver = new TimeCoordinateResolver(chart, timesRef)

        this.transformer = new CoordinateTransformer(series, this.timeResolver)

        this.drawingCanvasRenderer = new DrawingCanvasRenderer(
            drawingContext.drawingManager,
            drawingContext.previewDrawingManager,
            drawingContext.rendererManager,
            drawingContext.drawingStateManager,
            this.transformer,
            canvas,
        )

        const snapshot = new ChartSnapshot(chart, series, container)

        this.renderLoop = new RenderLoop(snapshot, () => {
            this.drawingCanvasRenderer.render()
        })

        const cursorManager = new CursorManager(container)

        const hoverController = new HoverController(
            drawingContext.drawingStateManager,
            drawingContext.hitTestManager,
            this.transformer,
            this.renderLoop,
            cursorManager,
        )

        const selectionController = new SelectionController(
            drawingContext.drawingStateManager,
            drawingContext.hitTestManager,
            this.transformer,
            this.renderLoop,
        )

        this.toolController = new ToolController(drawingContext.toolManager, chart)

        const editController = new EditController(
            drawingContext.editingSession,
            drawingContext.editorManager,
            this.renderLoop,
            this.toolController,
        )

        this.pointerController = new PointerController(
            drawingContext.toolManager,
            hoverController,
            selectionController,
            editController,
            this.transformer,
        )
    }

    public invalidate() {
        this.renderLoop.invalidate()
    }

    public getDrawingToolbarManager() {
        return this.params.drawingContext.drawingToolbarManager
    }

    public getTimeResolver() {
        return this.timeResolver
    }

    public getTransformer() {
        return this.transformer
    }

    public handlePointerDown(event: RawPointerEvent) {
        this.pointerController.handlePointerDown(event)
    }

    public handlePointerMove(event: RawPointerEvent) {
        this.pointerController.handlePointerMove(event)
    }

    public handlePointerUp(event: RawPointerEvent) {
        this.pointerController.handlePointerUp(event)
    }

    public handlePointerLeave() {
        this.pointerController.handlePointerLeave()
    }

    public start() {
        const drawingContext = this.params.drawingContext

        this.toolController.syncChartInteraction()

        this.renderLoop.start()

        this.unsubscribers.push(
            drawingContext.drawingManager.subscribeChanged(() => {
                this.renderLoop.invalidate()
            }),
        )

        this.unsubscribers.push(
            drawingContext.previewDrawingManager.subscribeChanged(() => {
                this.renderLoop.invalidate()
            }),
        )

        this.unsubscribers.push(
            drawingContext.drawingStateManager.subscribeChanged(() => {
                this.renderLoop.invalidate()
            }),
        )

        drawingContext.registerActionProviders(this.renderLoop)
    }

    public dispose() {
        while (this.unsubscribers.length) {
            this.unsubscribers.pop()?.()
        }

        this.renderLoop.stop()
    }
}
