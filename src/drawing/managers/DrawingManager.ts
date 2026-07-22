import type { Drawing } from '../drawings/Drawing'

type Listener = () => void

export class DrawingManager {
    private readonly drawings = new Map<string, Drawing>()

    private readonly listeners = new Set<Listener>()

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

    public addDrawing(drawing: Drawing) {
        this.drawings.set(drawing.id, drawing)

        this.notify()
    }

    public removeDrawing(id: string) {
        const drawing = this.drawings.get(id)

        if (!drawing) {
            return
        }

        drawing.destroy()

        this.drawings.delete(id)

        this.notify()
    }

    public clearDrawing() {
        for (const drawing of this.drawings.values()) {
            drawing.destroy()
        }

        this.drawings.clear()

        this.notify()
    }

    public getDrawing(id: string) {
        return this.drawings.get(id)
    }

    public getDrawings() {
        return [...this.drawings.values()]
    }

    public has(id: string) {
        return this.drawings.has(id)
    }

    public get size() {
        return this.drawings.size
    }
}
