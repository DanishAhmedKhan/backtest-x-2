import type { Drawing } from '../drawings/Drawing'

export interface GlobalDrawingRenderState {
    hovered: Drawing | null
    selected: Drawing | null
}
