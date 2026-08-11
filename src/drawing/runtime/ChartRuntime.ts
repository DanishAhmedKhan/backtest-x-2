import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import { CoordinateTransformer } from '../renderer/CoordinateTransformer'
import { TimeCoordinateResolver } from '../renderer/TimeCoordinateResolver'
import { DrawingCanvasRenderer } from '../renderer/DrawingCanvasRenderer'
import { ChartSnapshot } from '../renderer/ChartSnapshot'
import { RenderLoop } from '../renderer/RenderLoop'
import type { DrawingContext } from '../DrawingContext'
import { PointerController } from '../controller/PointerController'
import { ToolController } from '../ToolController'
import { HoverController } from '../controller/HoverController'
import { SelectionController } from '../controller/SelectionController'
import { EditController } from '../controller/EditController'
import type { RawPointerEvent } from '../models/RawPointerEvent'
import { DrawingLogicalUpdater } from '../renderer/DrawaingLogicalUpdator'
import { TrendLineEditor } from '../editor/TrendLineEditor'
import { HorizontalLineEditor } from '../editor/HorizontalLineEditor'
import type { Timeframe } from '../../core/Timeframe'
import { PaneGeometry } from '../renderer/PaneGeometry'
import { CursorApplier } from '../../core/cursor/CursorApplier'
import { CursorController } from '../../core/cursor/CursorController'

type Params = {
    chart: IChartApi
    series: ISeriesApi<'Candlestick'>
    canvas: HTMLCanvasElement
    container: HTMLDivElement
    drawingContext: DrawingContext
    timesRef: React.RefObject<number[]>
    timeframe: Timeframe
    paneGeometry: PaneGeometry
}

export class ChartRuntime {
    public readonly renderLoop: RenderLoop
    public readonly pointerController: PointerController
    public readonly toolController: ToolController
    private readonly drawingCanvasRenderer: DrawingCanvasRenderer

    public readonly transformer: CoordinateTransformer
    public readonly timeResolver: TimeCoordinateResolver
    private readonly drawingLogicalUpdater: DrawingLogicalUpdater

    private readonly paneGeometry: PaneGeometry
    private readonly canvas: HTMLCanvasElement

    private cursorController: CursorController

    private readonly unsubscribers: (() => void)[] = []

    constructor(private readonly params: Params) {
        const { chart, series, canvas, container, drawingContext, timesRef, paneGeometry } = params

        this.canvas = canvas

        this.paneGeometry = paneGeometry

        this.timeResolver = new TimeCoordinateResolver(chart, timesRef, params.timeframe)
        this.transformer = new CoordinateTransformer(series, this.timeResolver)
        this.drawingLogicalUpdater = new DrawingLogicalUpdater(drawingContext.drawingManager, this.timeResolver)

        drawingContext.registerTools(this.transformer)

        drawingContext.editorManager.register(new TrendLineEditor(this.timeResolver, this.transformer))
        drawingContext.editorManager.register(new HorizontalLineEditor())

        this.drawingCanvasRenderer = new DrawingCanvasRenderer(
            drawingContext.drawingManager,
            drawingContext.previewDrawingManager,
            drawingContext.rendererManager,
            drawingContext.drawingStateManager,
            this.transformer,
            canvas,
        )

        const snapshot = new ChartSnapshot(chart, series, this.paneGeometry)

        this.renderLoop = new RenderLoop(snapshot, () => {
            this.updatePaneLayout()
            this.drawingCanvasRenderer.render()
        })

        const cursorApplier = new CursorApplier(container)
        this.cursorController = new CursorController(cursorApplier)

        const hoverController = new HoverController(
            drawingContext.drawingStateManager,
            drawingContext.hitTestManager,
            this.transformer,
            this.renderLoop,
            this.cursorController,
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

    public getToolController() {
        return this.toolController
    }

    public getTimeResolver() {
        return this.timeResolver
    }

    public getTransformer() {
        return this.transformer
    }

    public getCursorController() {
        return this.cursorController
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

    public onChartDataChanged() {
        this.drawingLogicalUpdater.update()
        this.renderLoop.invalidate()
    }

    public updatePaneLayout() {
        const pane = this.paneGeometry.calculate()

        if (!pane) return

        this.canvas.style.left = `${pane.left}px`
        this.canvas.style.top = `${pane.top}px`

        this.canvas.style.width = `${pane.width}px`
        this.canvas.style.height = `${pane.height}px`

        this.canvas.width = pane.backingWidth
        this.canvas.height = pane.backingHeight

        const ctx = this.canvas.getContext('2d')

        if (!ctx) {
            return
        }

        const dpr = window.devicePixelRatio || 1

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
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
