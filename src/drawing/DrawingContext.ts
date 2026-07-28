import { ToolManager } from './tools/ToolManager'
import { DrawingManager } from './managers/DrawingManager'
import { RendererManager } from './renderer/RendererManager'

import { ToolType } from './tools/ToolType'
import { PreviewDrawingManager } from './PreviewDrawingManager'
import { DrawingStateManager } from './managers/DrawingStateManager'
import { HitTestManager } from './hitTest/HitTestManager'
import { EditingSession } from './editor/EditingSession'
import { EditorManager } from './editor/EditorManager'
import { DrawingActionManager } from './actions/DrawingActionManager'
import { DrawingToolbarManager } from './toolbar/DrawingToolbarManager'
import type { RenderInvalidator } from './renderer/RenderInvalidator'

import { registerTools } from './utils/registerTools'

import { TrendLineRenderer } from './renderer/TrendLineRenderer'
import { TrendLineEditor } from './editor/TrendLineEditor'
import { TrendLineHitTester } from './hitTest/TrendLineHitTester'
import { LineActionProvider } from './actions/LineActionProvider'
import { PopupController } from './PopupController'

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

    public readonly popupController = new PopupController()

    public readonly drawingToolbarManager = new DrawingToolbarManager(
        this.drawingStateManager,
        this.drawingActionManager,
        this.popupController,
    )

    constructor() {
        this.initialize()
    }

    private initialize() {
        this.rendererManager.register(new TrendLineRenderer())

        this.hitTestManager.register(new TrendLineHitTester())

        this.editorManager.register(new TrendLineEditor())

        registerTools(this.toolManager, this.drawingManager, this.previewDrawingManager, this.drawingStateManager)

        this.toolManager.selectByType(ToolType.Pan)
    }

    public registerActionProviders(renderInvalidator: RenderInvalidator) {
        this.drawingActionManager.register(
            new LineActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )
    }
}
