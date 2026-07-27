import type { Drawing } from '../drawings/Drawing'
import type { CoordinateTransformer } from './CoordinateTransformer'
import type { DrawingRenderState } from './DrawingrendererState'

export interface DrawingRenderer<T extends Drawing = Drawing> {
    canRender(drawing: Drawing): drawing is T

    render(
        drawing: T,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ): void

    destroy(drawing: T): void
}
