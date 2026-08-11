import type { Drawing } from '../drawings/Drawing'

import { DrawingStateManager } from '../managers/DrawingStateManager'
import { DrawingActionManager } from '../actions/DrawingActionManager'
import { ToolbarModelBuilder } from './ToolbarModelBuilder'

type Listener = () => void

export class DrawingToolbarManager {
    private readonly listeners = new Set<Listener>()

    private readonly modelBuilder = new ToolbarModelBuilder()

    constructor(
        private readonly drawingStateManager: DrawingStateManager,
        private readonly drawingActionManager: DrawingActionManager,
    ) {
        this.drawingStateManager.subscribeChanged(() => {
            this.notify()
        })
    }

    private notify() {
        for (const listener of this.listeners) {
            listener()
        }
    }

    public subscribe(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public getDrawing(): Drawing | null {
        return this.drawingStateManager.getSelected()
    }

    public getToolbarItems() {
        const drawing = this.getDrawing()

        if (!drawing) {
            return []
        }

        return this.modelBuilder.build(this.drawingActionManager.getActions(drawing))
    }

    public isVisible() {
        return this.getDrawing() !== null
    }
}
