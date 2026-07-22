import type { Tool } from './Tool'
import type { ToolType } from './ToolType'

import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export class ToolManager {
    private readonly tools = new Map<ToolType, Tool>()

    private currentTool: Tool | null = null

    public register(tool: Tool) {
        this.tools.set(tool.type, tool)
    }

    public selectByType(type: ToolType) {
        this.setTool(this.tools.get(type) ?? null)
    }

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
        this.currentTool?.handlePointerDown(event)
    }

    public handlePointerMove(event: ChartPointerEvent) {
        this.currentTool?.handlePointerMove(event)
    }

    public handlePointerUp(event: ChartPointerEvent) {
        this.currentTool?.handlePointerUp(event)
    }

    public handlePointerLeave() {
        this.currentTool?.handlePointerLeave()
    }

    public cancel() {
        this.currentTool?.cancel()
    }
}
