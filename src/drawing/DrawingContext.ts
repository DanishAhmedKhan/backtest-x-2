import { DrawingManager } from './managers/DrawingManager'
import { ToolManager } from './tools/ToolManager'

import { PanTool } from './drawings/PanTool'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly toolManager = new ToolManager()

    public readonly panTool = new PanTool()

    constructor() {
        this.toolManager.setTool(this.panTool)
    }
}
