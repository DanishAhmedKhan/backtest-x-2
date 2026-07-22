import type { Drawing } from '../drawings/Drawing'
import type { DrawingRenderer } from './DrawingRenderer'

export class RendererManager {
    private readonly renderers: DrawingRenderer[] = []

    public register(renderer: DrawingRenderer) {
        this.renderers.push(renderer)
    }

    public render(drawing: Drawing) {
        for (const renderer of this.renderers) {
            if (renderer.canRender(drawing)) {
                renderer.render(drawing)

                return
            }
        }
    }

    public destroy(drawing: Drawing) {
        for (const renderer of this.renderers) {
            if (renderer.canRender(drawing)) {
                renderer.destroy(drawing)

                return
            }
        }
    }
}
