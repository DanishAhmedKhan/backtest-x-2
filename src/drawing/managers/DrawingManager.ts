import type { Drawing } from '../drawings/Drawing'
import type { RendererManager } from '../renderer/RendererManager'

export class DrawingManager {
    private readonly drawings = new Map<string, Drawing>()

    private rendererManager: RendererManager | null = null

    public setRendererManager(rendererManager: RendererManager) {
        this.rendererManager = rendererManager
    }

    public addDrawing(drawing: Drawing) {
        this.drawings.set(drawing.id, drawing)
        this.rendererManager?.render(drawing)
    }

    public removeDrawing(id: string) {
        const drawing = this.drawings.get(id)
        if (!drawing) return

        this.rendererManager?.destroy(drawing)
        drawing.destroy()
        this.drawings.delete(id)
    }

    public clear() {
        for (const drawing of this.drawings.values()) {
            drawing.destroy()
        }

        this.drawings.clear()
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
