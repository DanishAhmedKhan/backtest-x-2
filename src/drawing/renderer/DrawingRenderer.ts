import type { Drawing } from '../drawings/Drawing'

export interface DrawingRenderer<T extends Drawing = Drawing> {
    canRender(drawing: Drawing): drawing is T

    render(drawing: T): void

    destroy(drawing: T): void
}
