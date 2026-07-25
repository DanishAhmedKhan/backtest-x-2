import { ToolManager } from './tools/ToolManager'
import { DrawingManager } from './managers/DrawingManager'
import { RendererManager } from './renderer/RendererManager'

import { ToolType } from './tools/ToolType'
import { TrendLineRenderer } from './renderer/TrendLineRenderer'
import { PreviewDrawingManager } from './PreviewDrawingManager'
import { DrawingStateManager } from './managers/DrawingStateManager'
import { HitTestManager } from './hitTest/HitTestManager'

import { registerTools } from './utils/registerTools'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly rendererManager = new RendererManager()

    public readonly toolManager = new ToolManager()

    public readonly previewDrawingManager = new PreviewDrawingManager()

    public readonly drawingStateManager = new DrawingStateManager()

    public readonly hitTestManager = new HitTestManager()

    constructor() {
        this.initialize()
    }

    private initialize() {
        this.rendererManager.register(new TrendLineRenderer())

        // this.hitTestManager.register(new TrendLineHitTester())

        registerTools(this.toolManager, this.drawingManager, this.previewDrawingManager, this.drawingStateManager)

        this.toolManager.selectByType(ToolType.Pan)
    }
}
