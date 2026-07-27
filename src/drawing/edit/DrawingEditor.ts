import type { Drawing } from '../drawings/Drawing'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditTarget } from './EditTarget'

export interface DrawingEditor<T extends Drawing = Drawing> {
    canEdit(drawing: Drawing): drawing is T

    beginEdit(drawing: T, target: EditTarget, event: ChartPointerEvent): void

    updateEdit(drawing: T, target: EditTarget, event: ChartPointerEvent): void

    endEdit(drawing: T, target: EditTarget): void
}
