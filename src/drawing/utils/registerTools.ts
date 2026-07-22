import type { ToolManager } from '../tools/ToolManager'
import type { DrawingManager } from '../managers/DrawingManager'

import { PanTool } from '../drawings/PanTool'
import { TrendLineTool } from '../tools/TrendLineTools'
import { PreviewDrawingManager } from '../PreviewDrawingManager'

export function registerTools(
    toolManager: ToolManager,
    drawingManager: DrawingManager,
    previewDrawingManager: PreviewDrawingManager,
) {
    toolManager.register(new PanTool(drawingManager))

    toolManager.register(new TrendLineTool(drawingManager, previewDrawingManager))
}
