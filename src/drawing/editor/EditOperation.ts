import type { EditingSession } from './EditingSession'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { HitTarget } from '../hitTest/HitTestResult'

export interface EditOperation {
    readonly target: HitTarget

    update(session: EditingSession, event: ChartPointerEvent): void
}
