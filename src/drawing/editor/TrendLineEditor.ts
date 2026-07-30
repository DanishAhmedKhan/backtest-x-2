import type { Drawing } from '../drawings/Drawing'
import type { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { DrawingEditor } from './DrawingEditor'

import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTestResult'
import { DrawingType } from '../DrawingType'

export class TrendLineEditor implements DrawingEditor<TrendLineDrawing> {
    public canEdit(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {
        console.info(_session, _event)
    }

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as TrendLineDrawing

        switch (target.target) {
            case HitTarget.StartHandle:
                this.moveStartHandle(drawing, event)
                break

            case HitTarget.EndHandle:
                this.moveEndHandle(drawing, event)
                break

            case HitTarget.Body:
                this.moveBody(drawing, session, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {
        console.info(_session)
    }

    private moveStartHandle(drawing: TrendLineDrawing, event: ChartPointerEvent) {
        drawing.start = {
            ...event.anchor,
        }
    }

    private moveEndHandle(drawing: TrendLineDrawing, event: ChartPointerEvent) {
        drawing.end = {
            ...event.anchor,
        }
    }

    private moveBody(drawing: TrendLineDrawing, session: EditingSession, event: ChartPointerEvent) {
        const original = session.getOriginalDrawing() as TrendLineDrawing
        const startPointer = session.getStartPointer()

        if (!original || !startPointer) {
            return
        }

        const logicalDelta = event.anchor.logical - startPointer.logical

        const priceDelta = event.anchor.price - startPointer.price

        drawing.start = {
            logical: original.start.logical + logicalDelta,
            time: original.start.time,
            price: original.start.price + priceDelta,
        }

        drawing.end = {
            logical: original.end.logical + logicalDelta,
            time: original.end.time,
            price: original.end.price + priceDelta,
        }
    }
}
