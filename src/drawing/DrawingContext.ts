import { ToolManager } from './tools/ToolManager'
import { DrawingManager } from './managers/DrawingManager'
import { RendererManager } from './renderer/RendererManager'
import { ToolType } from './tools/ToolType'
import { PreviewDrawingManager } from './renderer/PreviewDrawingManager'
import { DrawingStateManager } from './managers/DrawingStateManager'
import { HitTestManager } from './hitTest/HitTestManager'
import { EditorManager } from './editor/EditorManager'
import { DrawingActionManager } from './actions/DrawingActionManager'
import { DrawingToolbarManager } from './toolbar/DrawingToolbarManager'
import type { RenderInvalidator } from './renderer/RenderInvalidator'
import type { CoordinateTransformer } from './renderer/CoordinateTransformer'
import { DrawingActionFactory } from './actions/DrawinActionFactory'

import { PanTool } from './tools/PanTool'
import { TrendLineTool } from './tools/TrendLineTool'
import { HorizontalLineTool } from './tools/HorizontalLineTool'
import { VerticalLineTool } from './tools/VerticalLineTool'
import { RectangleTool } from './tools/RectangleTool'
import { LongPositionTool } from './tools/LongPositionTool'
import { ShortPositionTool } from './tools/ShortPositionTool'

import { TrendLineRenderer } from './renderer/TrendLineRenderer'
import { HorizontalLineRenderer } from './renderer/HorizontalLineRenderer'
import { VerticalLineRenderer } from './renderer/VerticalLinerenderer'
import { RectangleRenderer } from './renderer/RectangleRenderer'
import { LongPositionRenderer } from './renderer/LongPositionRenderer'
import { ShortPositionRenderer } from './renderer/ShortPositionRenderer'

import { TrendLineHitTester } from './hitTest/TrendLineHitTester'
import { HorizontalLineHitTester } from './hitTest/HorizontalLineHitTester'
import { VerticalLineHitTester } from './hitTest/VerticalLineHitTester'
import { RectangleHitTester } from './hitTest/RectangleHitTester'
import { LongPositionHitTester } from './hitTest/LongPositionHitTester'
import { ShortPositionHitTester } from './hitTest/ShortPositionHitTester'

import { LineActionProvider } from './actions/LineActionProvider'
import { HorizontalLineActionProvider } from './actions/HorizontalLineActionProvider'
import { VerticalLineActionProvider } from './actions/VerticalLineActionProvider'
import { RectangleActionProvider } from './actions/RectangleActionProvider'
import { LongPositionActionProvider } from './actions/LongPositionActionProvider'
import { ShortPositionActionProvider } from './actions/ShortPositionActionProvider'

import { TrendLineEditor } from './editor/TrendLineEditor'
import { HorizontalLineEditor } from './editor/HorizontalLineEditor'
import { VerticalLineEditor } from './editor/VerticalLineEditor'
import { RectangleEditor } from './editor/RectangleEditor'
import { LongPositionEditor } from './editor/LongPositionEditor'
import { ShortPositionEditor } from './editor/ShortPositionEditor'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly rendererManager = new RendererManager()

    public readonly toolManager = new ToolManager()

    public readonly previewDrawingManager = new PreviewDrawingManager()

    public readonly drawingStateManager = new DrawingStateManager()

    public readonly hitTestManager = new HitTestManager(this.drawingManager, this.drawingStateManager)

    public readonly editorManager = new EditorManager(this.drawingStateManager)

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
        this.rendererManager.register(new LongPositionRenderer())
        this.rendererManager.register(new ShortPositionRenderer())

        this.hitTestManager.register(new TrendLineHitTester())
        this.hitTestManager.register(new HorizontalLineHitTester())
        this.hitTestManager.register(new VerticalLineHitTester())
        this.hitTestManager.register(new RectangleHitTester())
        this.hitTestManager.register(new LongPositionHitTester())
        this.hitTestManager.register(new ShortPositionHitTester())

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

        this.toolManager.register(
            new LongPositionTool(
                this.drawingManager,
                this.previewDrawingManager,
                this.drawingStateManager,
                transformer,
            ),
        )

        this.toolManager.register(
            new ShortPositionTool(
                this.drawingManager,
                this.previewDrawingManager,
                this.drawingStateManager,
                transformer,
            ),
        )
    }

    public registerActionProviders(renderInvalidator: RenderInvalidator) {
        const drawingActionFactory = new DrawingActionFactory(this.drawingStateManager, renderInvalidator)

        this.drawingActionManager.register(new LineActionProvider(this.drawingManager, drawingActionFactory))

        this.drawingActionManager.register(new HorizontalLineActionProvider(this.drawingManager, drawingActionFactory))

        this.drawingActionManager.register(new VerticalLineActionProvider(this.drawingManager, drawingActionFactory))

        this.drawingActionManager.register(
            new RectangleActionProvider(
                this.drawingManager,
                this.drawingStateManager,
                renderInvalidator,
                drawingActionFactory,
            ),
        )

        this.drawingActionManager.register(
            new LongPositionActionProvider(
                this.drawingManager,
                this.drawingStateManager,
                renderInvalidator,
                drawingActionFactory,
            ),
        )

        this.drawingActionManager.register(
            new ShortPositionActionProvider(
                this.drawingManager,
                this.drawingStateManager,
                renderInvalidator,
                drawingActionFactory,
            ),
        )
    }

    public registerEditor(transformer: CoordinateTransformer) {
        this.editorManager.register(new TrendLineEditor(transformer))
        this.editorManager.register(new HorizontalLineEditor())
        this.editorManager.register(new VerticalLineEditor())
        this.editorManager.register(new RectangleEditor())
        this.editorManager.register(new LongPositionEditor())
        this.editorManager.register(new ShortPositionEditor())
    }
}
