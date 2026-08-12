import type { Drawing } from '../drawings/Drawing'
import type { RectangleDrawing } from '../drawings/RectangleDrawing'

import type { DrawingEditor } from './DrawingEditor'

import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { DrawingType } from '../drawings/DrawingType'

export class RectangleEditor implements DrawingEditor<RectangleDrawing> {
    public canEdit(drawing: Drawing): drawing is RectangleDrawing {
        return drawing.type === DrawingType.Rectangle
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as RectangleDrawing
        const original = session.getOriginalDrawing() as RectangleDrawing
        const startPointer = session.getStartPointer()

        if (!startPointer) {
            return
        }

        const dx = event.anchor.logical - startPointer.logical
        const dy = event.anchor.price - startPointer.price

        drawing.start = {
            ...original.start,
            logical: original.start.logical + dx,
            price: original.start.price + dy,
        }

        drawing.end = {
            ...original.end,
            logical: original.end.logical + dx,
            price: original.end.price + dy,
        }
    }

    public endEdit(_session: EditingSession) {}
}
