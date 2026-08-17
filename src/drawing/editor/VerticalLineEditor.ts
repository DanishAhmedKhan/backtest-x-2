import type { Drawing } from '../drawings/Drawing'
import type { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'

import type { DrawingEditor } from './DrawingEditor'
import type { EditingSession } from './EditingSession'

import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import { DrawingType } from '../drawings/DrawingType'

export class VerticalLineEditor implements DrawingEditor<VerticalLineDrawing> {
    public canEdit(drawing: Drawing): drawing is VerticalLineDrawing {
        return drawing.type === DrawingType.VerticalLine
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as VerticalLineDrawing

        drawing.anchor.time = event.anchor.time
    }

    public endEdit(_session: EditingSession) {}
}
