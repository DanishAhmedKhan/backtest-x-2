import type { Drawing } from '../drawings/Drawing'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { CoordinateTransformer } from './CoordinateTransformer'

export interface DrawingRenderer<T extends Drawing = Drawing> {
    canRender(drawing: Drawing): drawing is T

    render(
        drawing: T,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        drawingStateManager: DrawingStateManager,
    ): void

    destroy(drawing: T): void
}
