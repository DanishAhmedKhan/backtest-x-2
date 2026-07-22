import { ToolManager } from './tools/ToolManager'
import { ToolType } from './tools/ToolType'

export class ToolController {
    constructor(private readonly toolManager: ToolManager) {}

    public setTool(type: ToolType) {
        this.toolManager.selectByType(type)
    }
}
