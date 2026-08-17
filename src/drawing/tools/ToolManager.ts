import type { Tool } from './Tool'
import { ToolType } from './ToolType'

import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export class ToolManager {
    private readonly tools = new Map<ToolType, Tool>()

    private currentTool: Tool | null = null

    private readonly toolChangeListeners = new Set<() => void>()

    public register(tool: Tool) {
        this.tools.set(tool.type, tool)
    }

    public subscribeToolChange(listener: () => void) {
        this.toolChangeListeners.add(listener)

        return () => {
            this.toolChangeListeners.delete(listener)
        }
    }

    private notifyToolChange() {
        for (const listener of this.toolChangeListeners) {
            listener()
        }
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

        this.notifyToolChange()
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

    public hasActiveTool() {
        return this.currentTool !== null
    }

    public hasActiveDrawingTool() {
        return this.currentTool?.createsDrawing ?? false
    }

    public allowsViewportInteraction(): boolean {
        return this.currentTool?.allowsViewportInteraction ?? true
    }

    public allowsSelection() {
        return this.currentTool?.allowsSelection ?? false
    }

    public cancel() {
        this.currentTool?.cancel()
    }
}
