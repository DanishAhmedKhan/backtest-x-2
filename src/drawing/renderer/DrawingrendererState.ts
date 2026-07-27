import type { Drawing } from '../drawings/Drawing'

export interface DrawingRenderState {
    hovered: Drawing | null

    selected: Drawing | null
}
