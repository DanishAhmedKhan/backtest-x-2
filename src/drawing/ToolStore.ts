import { eventBus } from '../event/EventBus'
import { ToolType } from './tools/ToolType'

// class ToolStore {
//     private selectedTool = ToolType.Pan

//     public getSelectedTool() {
//         return this.selectedTool
//     }

//     public select(tool: ToolType) {
//         if (this.selectedTool === tool) {
//             return
//         }

//         this.selectedTool = tool

//         eventBus.emit('toolChanged', {
//             tool,
//         })
//     }
// }

// export const toolStore = new ToolStore()

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
