import { ToolManager } from './tools/ToolManager'
import { DrawingManager } from './managers/DrawingManager'
import { RendererManager } from './renderer/RendererManager'

import { ToolType } from './tools/ToolType'
import { TrendLineRenderer } from './renderer/TrendLineRenderer'
import { PreviewDrawingManager } from './PreviewDrawingManager'

import { registerTools } from './utils/registerTools'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly rendererManager = new RendererManager()

    public readonly toolManager = new ToolManager()

    public readonly previewDrawingManager = new PreviewDrawingManager()

    public initialize() {
        this.rendererManager.register(new TrendLineRenderer())

        registerTools(this.toolManager, this.drawingManager, this.previewDrawingManager)

        this.toolManager.selectByType(ToolType.Pan)
    }
}
