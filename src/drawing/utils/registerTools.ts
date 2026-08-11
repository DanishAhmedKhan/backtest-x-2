import type { ToolManager } from '../tools/ToolManager'
import type { DrawingManager } from '../managers/DrawingManager'

import { PanTool } from '../drawings/PanTool'
import { TrendLineTool } from '../tools/TrendLineTool'
import { PreviewDrawingManager } from '../PreviewDrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { HorizontalLineTool } from '../tools/HorizontalLineTool'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export function registerTools(
    toolManager: ToolManager,
    drawingManager: DrawingManager,
    previewDrawingManager: PreviewDrawingManager,
    drawingStateManager: DrawingStateManager,
    transformer: CoordinateTransformer,
) {
    toolManager.register(new PanTool(drawingManager))

    toolManager.register(new TrendLineTool(drawingManager, previewDrawingManager, drawingStateManager, transformer))

    toolManager.register(new HorizontalLineTool(drawingManager, drawingStateManager))
}
