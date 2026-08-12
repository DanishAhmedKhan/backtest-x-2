import type { Drawing } from '../drawings/Drawing'
import type { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderer } from './DrawingRenderer'
import type { DrawingRenderState } from './DrawingRenderState'
import type { GlobalDrawingRenderState } from './GlobalDrawingRenderState'

export class RendererManager {
    private readonly renderers: DrawingRenderer[] = []

    public register(renderer: DrawingRenderer) {
        this.renderers.push(renderer)
    }

    public render(
        drawing: Drawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        globalState: GlobalDrawingRenderState,
    ) {
        const hovered = globalState.hovered === drawing
        const selected = globalState.selected === drawing

        const renderState: DrawingRenderState = {
            hovered,
            selected,
            active: hovered || selected,
        }

        for (const renderer of this.renderers) {
            if (renderer.canRender(drawing)) {
                renderer.render(drawing, ctx, transformer, renderState)

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
