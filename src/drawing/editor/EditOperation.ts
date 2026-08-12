import type { EditingSession } from './EditingSession'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

export interface EditOperation {
    update(session: EditingSession, event: ChartPointerEvent): void
}
