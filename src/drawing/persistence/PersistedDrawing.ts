import type { DrawingType } from '../drawings/DrawingType'

export type PersistedDrawing = {
    id: string
    type: DrawingType
    data: Record<string, unknown>
}
