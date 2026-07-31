import type { ToolManager } from '../tools/ToolManager'
import type { DrawingManager } from '../managers/DrawingManager'

import { PanTool } from '../drawings/PanTool'
import { TrendLineTool } from '../tools/TrendLineTool'
import { PreviewDrawingManager } from '../PreviewDrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { HorizontalLineTool } from '../tools/HorizontalLineTool'

export function registerTools(
    toolManager: ToolManager,
    drawingManager: DrawingManager,
    previewDrawingManager: PreviewDrawingManager,
    drawingStateManager: DrawingStateManager,
) {
    toolManager.register(new PanTool(drawingManager))

    toolManager.register(new TrendLineTool(drawingManager, previewDrawingManager, drawingStateManager))

    toolManager.register(new HorizontalLineTool(drawingManager, drawingStateManager))
}
