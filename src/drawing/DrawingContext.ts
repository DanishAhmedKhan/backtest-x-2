import { ToolManager } from './tools/ToolManager'
import { DrawingManager } from './managers/DrawingManager'
import { RendererManager } from './renderer/RendererManager'
import { ToolType } from './tools/ToolType'
import { PreviewDrawingManager } from './renderer/PreviewDrawingManager'
import { DrawingStateManager } from './managers/DrawingStateManager'
import { HitTestManager } from './hitTest/HitTestManager'
import { EditingSession } from './editor/EditingSession'
import { EditorManager } from './editor/EditorManager'
import { DrawingActionManager } from './actions/DrawingActionManager'
import { DrawingToolbarManager } from './toolbar/DrawingToolbarManager'
import type { RenderInvalidator } from './renderer/RenderInvalidator'
import type { CoordinateTransformer } from './renderer/CoordinateTransformer'

import { PanTool } from './drawings/PanTool'
import { TrendLineTool } from './tools/TrendLineTool'
import { HorizontalLineTool } from './tools/HorizontalLineTool'

import { TrendLineRenderer } from './renderer/TrendLineRenderer'
import { TrendLineHitTester } from './hitTest/TrendLineHitTester'
import { LineActionProvider } from './actions/LineActionProvider'

import { HorizontalLineRenderer } from './renderer/HorizontalLineRenderer'
import { HorizontalLineHitTester } from './hitTest/HorizontalLineHitTester'
import { HorizontalLineActionProvider } from './actions/HorizontalLineActionProvider'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly rendererManager = new RendererManager()

    public readonly toolManager = new ToolManager()

    public readonly previewDrawingManager = new PreviewDrawingManager()

    public readonly drawingStateManager = new DrawingStateManager()

    public readonly hitTestManager = new HitTestManager(this.drawingManager)

    public readonly editingSession = new EditingSession()

    public readonly editorManager = new EditorManager()

    public readonly drawingActionManager = new DrawingActionManager()

    public readonly drawingToolbarManager = new DrawingToolbarManager(
        this.drawingStateManager,
        this.drawingActionManager,
    )

    constructor() {
        this.initialize()
    }

    private initialize() {
        this.rendererManager.register(new TrendLineRenderer())
        this.rendererManager.register(new HorizontalLineRenderer())

        this.hitTestManager.register(new TrendLineHitTester())
        this.hitTestManager.register(new HorizontalLineHitTester())

        this.toolManager.selectByType(ToolType.Pan)
    }

    public registerTools(transformer: CoordinateTransformer) {
        this.toolManager.register(new PanTool(this.drawingManager))

        this.toolManager.register(
            new TrendLineTool(this.drawingManager, this.previewDrawingManager, this.drawingStateManager, transformer),
        )

        this.toolManager.register(new HorizontalLineTool(this.drawingManager, this.drawingStateManager))
    }

    public registerActionProviders(renderInvalidator: RenderInvalidator) {
        this.drawingActionManager.register(
            new LineActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )

        this.drawingActionManager.register(
            new HorizontalLineActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )
    }
}
