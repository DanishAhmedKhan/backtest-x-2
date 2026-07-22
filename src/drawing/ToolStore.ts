import { eventBus } from '../event/EventBus'
import { ToolType } from './tools/ToolType'

class ToolStore {
    private selectedTool = ToolType.Pan

    public getSelectedTool() {
        return this.selectedTool
    }

    public select(tool: ToolType) {
        if (this.selectedTool === tool) {
            return
        }

        this.selectedTool = tool

        eventBus.emit('toolChanged', {
            tool,
        })
    }
}

export const toolStore = new ToolStore()
