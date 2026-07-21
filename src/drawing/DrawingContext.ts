import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import { DrawingManager } from './managers/DrawingManager'
import { ToolManager } from './tools/ToolManager'
import { PointerController } from './input/PointerController'

import { PanTool } from './drawings/PanTool'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly toolManager = new ToolManager()

    private inputController: PointerController | null = null

    public readonly panTool = new PanTool(this.drawingManager)

    constructor() {
        this.toolManager.setTool(this.panTool)
    }

    public initialize(chart: IChartApi, series: ISeriesApi<'Candlestick'>) {
        this.inputController = new PointerController(this.toolManager, chart, series)
    }

    public getInputController() {
        if (!this.inputController) {
            throw new Error('DrawingContext not initialized.')
        }

        return this.inputController
    }
}
