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

    public handlePointerDown(event: ChartPointerEvent) {
        this.currentTool?.mouseDown(event)
    }

    public handlePointerMove(event: ChartPointerEvent) {
        this.currentTool?.mouseMove(event)
    }

    public handlePointerUp(event: ChartPointerEvent) {
        this.currentTool?.mouseUp(event)
    }

    public handlePointerLeave() {
        this.currentTool?.mouseLeave()
    }

    public cancel() {
        this.currentTool?.cancel()
    }
}
