import { ToolManager } from '../tools/ToolManager'
import { DrawingManager } from '../managers/DrawingManager'

export class DrawingContext {
    public readonly drawingManager = new DrawingManager()

    public readonly toolManager = new ToolManager()
}
