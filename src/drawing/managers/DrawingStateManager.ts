import type { Drawing } from '../drawings/Drawing'

type Listener = () => void

export class DrawingStateManager {
    private hovered: Drawing | null = null
    private selected: Drawing | null = null

    private editing = false
    private moving = false

    private readonly listeners = new Set<Listener>()

    private notify() {
        for (const listener of this.listeners) {
            listener()
        }
    }

    public refresh() {
        this.notify()
    }

    public subscribeChanged(listener: Listener) {
        this.listeners.add(listener)

        return () => {
            this.listeners.delete(listener)
        }
    }

    public getHovered() {
        return this.hovered
    }

    public getSelected() {
        return this.selected
    }

    public setHovered(drawing: Drawing | null) {
        if (this.hovered === drawing) {
            return
        }

        this.hovered = drawing

        this.notify()
    }

    public setSelected(drawing: Drawing | null) {
        if (this.selected === drawing) {
            return
        }

        this.selected = drawing

        this.notify()
    }

    public clearSelection() {
        this.setSelected(null)
    }

    public isEditing() {
        return this.editing
    }

    public setEditing(value: boolean) {
        if (this.editing === value) {
            return
        }

        this.editing = value
        this.notify()
    }

    public isMoving() {
        return this.moving
    }

    public setMoving(value: boolean) {
        if (this.moving === value) {
            return
        }

        this.moving = value
        this.notify()
    }

    public isSelected(drawing: Drawing) {
        return this.selected === drawing
    }

    public isHovered(drawing: Drawing) {
        return this.hovered === drawing
    }
}
