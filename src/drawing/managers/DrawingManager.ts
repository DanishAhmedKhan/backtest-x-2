import type { Drawing } from '../drawings/Drawing'

export class DrawingManager {
    private readonly drawings = new Map<string, Drawing>()

    public add(drawing: Drawing) {
        this.drawings.set(drawing.id, drawing)
    }

    public remove(id: string) {
        const drawing = this.drawings.get(id)

        if (!drawing) {
            return
        }

        drawing.destroy()

        this.drawings.delete(id)
    }

    public clear() {
        for (const drawing of this.drawings.values()) {
            drawing.destroy()
        }

        this.drawings.clear()
    }

    public get(id: string) {
        return this.drawings.get(id)
    }

    public getAll() {
        return [...this.drawings.values()]
    }

    public has(id: string) {
        return this.drawings.has(id)
    }

    public get size() {
        return this.drawings.size
    }
}
