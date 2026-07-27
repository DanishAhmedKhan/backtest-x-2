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
            ...event.point,
        }
    }

    private moveEndHandle(drawing: TrendLineDrawing, event: ChartPointerEvent) {
        drawing.end = {
            ...event.point,
        }
    }

    private moveBody(drawing: TrendLineDrawing, session: EditingSession, event: ChartPointerEvent) {
        const original = session.getOriginalDrawing() as TrendLineDrawing

        const startPointer = session.getStartPointer()

        if (!original || !startPointer) {
            return
        }

        const dt = event.point.time - startPointer.time

        const dp = event.point.price - startPointer.price

        drawing.start = {
            time: original.start.time + dt,
            price: original.start.price + dp,
        }

        drawing.end = {
            time: original.end.time + dt,
            price: original.end.price + dp,
        }
    }
}
