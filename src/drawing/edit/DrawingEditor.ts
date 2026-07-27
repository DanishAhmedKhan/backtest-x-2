import type { Drawing } from '../drawings/Drawing'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { EditingSession } from '../edit/EditingSession'

export interface DrawingEditor<T extends Drawing = Drawing> {
    canEdit(drawing: Drawing): drawing is T

    beginEdit(session: EditingSession, event: ChartPointerEvent): void

    updateEdit(session: EditingSession, event: ChartPointerEvent): void

    endEdit(session: EditingSession): void
}
