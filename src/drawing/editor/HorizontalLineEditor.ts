import type { Drawing } from '../drawings/Drawing'
import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'

import type { DrawingEditor } from './DrawingEditor'
import type { EditingSession } from './EditingSession'

import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import { DrawingType } from '../drawings/DrawingType'

export class HorizontalLineEditor implements DrawingEditor<HorizontalLineDrawing> {
    public canEdit(drawing: Drawing): drawing is HorizontalLineDrawing {
        return drawing.type === DrawingType.HorizontalLine
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) return

        const drawing = target.drawing as HorizontalLineDrawing

        drawing.anchor.price = event.anchor.price
    }

    public endEdit(_session: EditingSession) {}
}
