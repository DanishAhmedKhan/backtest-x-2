import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { Tool } from './Tool'

export class ToolManager {
    private currentTool: Tool | null = null

    public getCurrentTool() {
        return this.currentTool
    }

    public setTool(tool: Tool | null) {
        if (this.currentTool === tool) {
            return
        }

        this.currentTool?.deactivate()

        this.currentTool = tool

        this.currentTool?.activate()
    }

    public clear() {
        this.setTool(null)
    }

    public mouseDown(event: ChartPointerEvent) {
        this.currentTool?.mouseDown(event)
    }

    public mouseMove(event: ChartPointerEvent) {
        this.currentTool?.mouseMove(event)
    }

    public mouseUp(event: ChartPointerEvent) {
        this.currentTool?.mouseUp(event)
    }

    public mouseLeave() {
        this.currentTool?.mouseLeave()
    }

    public cancel() {
        this.currentTool?.cancel()
    }
}
