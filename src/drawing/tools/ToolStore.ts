import { ToolType } from './ToolType'
import { eventBus } from '../../event/EventBus'

type Listener = (tool: ToolType) => void

class ToolStore {
    private selectedTool = ToolType.Pan

    private readonly listeners = new Set<Listener>()

    public getSelectedTool() {
        return this.selectedTool
    }

    public subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public select(tool: ToolType) {
        if (this.selectedTool === tool) {
            return
        }

        this.selectedTool = tool

        for (const listener of this.listeners) {
            listener(tool)
        }

        eventBus.emit('toolChanged', {
            tool,
        })
    }
}

export const toolStore = new ToolStore()
