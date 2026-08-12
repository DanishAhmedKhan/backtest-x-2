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
import type { TimeCoordinateResolver } from './renderer/TimeCoordinateResolver'

import { PanTool } from './drawings/PanTool'
import { TrendLineTool } from './tools/TrendLineTool'
import { HorizontalLineTool } from './tools/HorizontalLineTool'
import { VerticalLineTool } from './tools/VerticalLineTool'
import { RectangleTool } from './tools/RectangleTool'

import { TrendLineRenderer } from './renderer/TrendLineRenderer'
import { HorizontalLineRenderer } from './renderer/HorizontalLineRenderer'
import { VerticalLineRenderer } from './renderer/VerticalLinerenderer'
import { RectangleRenderer } from './renderer/RectangleRenderer'

import { TrendLineHitTester } from './hitTest/TrendLineHitTester'
import { HorizontalLineHitTester } from './hitTest/HorizontalLineHitTester'
import { VerticalLineHitTester } from './hitTest/VerticalLineHitTester'
import { RectangleHitTester } from './hitTest/RectangleHitTester'

import { LineActionProvider } from './actions/LineActionProvider'
import { HorizontalLineActionProvider } from './actions/HorizontalLineActionProvider'
import { VerticalLineActionProvider } from './actions/VerticalLineActionProvider'
import { RectangleActionProvider } from './actions/RectangleActionProvider'

import { TrendLineEditor } from './editor/TrendLineEditor'
import { HorizontalLineEditor } from './editor/HorizontalLineEditor'
import { VerticalLineEditor } from './editor/VerticalLineEditor'
import { RectangleEditor } from './editor/RectangleEditor'

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
        this.rendererManager.register(new VerticalLineRenderer())
        this.rendererManager.register(new RectangleRenderer())

        this.hitTestManager.register(new TrendLineHitTester())
        this.hitTestManager.register(new HorizontalLineHitTester())
        this.hitTestManager.register(new VerticalLineHitTester())
        this.hitTestManager.register(new RectangleHitTester())

        this.toolManager.selectByType(ToolType.Pan)
    }

    public registerTools(transformer: CoordinateTransformer) {
        this.toolManager.register(new PanTool(this.drawingManager))

        this.toolManager.register(
            new TrendLineTool(this.drawingManager, this.previewDrawingManager, this.drawingStateManager, transformer),
        )

        this.toolManager.register(new HorizontalLineTool(this.drawingManager, this.drawingStateManager))

        this.toolManager.register(new VerticalLineTool(this.drawingManager, this.drawingStateManager))

        this.toolManager.register(
            new RectangleTool(this.drawingManager, this.previewDrawingManager, this.drawingStateManager),
        )
    }

    public registerActionProviders(renderInvalidator: RenderInvalidator) {
        this.drawingActionManager.register(
            new LineActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )

        this.drawingActionManager.register(
            new HorizontalLineActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )

        this.drawingActionManager.register(
            new VerticalLineActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )

        this.drawingActionManager.register(
            new RectangleActionProvider(this.drawingManager, this.drawingStateManager, renderInvalidator),
        )
    }

    public registerEditor(timeResolver: TimeCoordinateResolver, transformer: CoordinateTransformer) {
        this.editorManager.register(new TrendLineEditor(timeResolver, transformer))
        this.editorManager.register(new HorizontalLineEditor())
        this.editorManager.register(new VerticalLineEditor())
        this.editorManager.register(new RectangleEditor())
    }
}
