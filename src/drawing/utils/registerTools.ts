import type { ToolManager } from '../tools/ToolManager'
import type { DrawingManager } from '../managers/DrawingManager'

import { PanTool } from '../drawings/PanTool'
import { TrendLineTool } from '../tools/TrendLineTools'

export function registerTools(toolManager: ToolManager, drawingManager: DrawingManager) {
    toolManager.register(new PanTool(drawingManager))

    toolManager.register(new TrendLineTool(drawingManager))
}
