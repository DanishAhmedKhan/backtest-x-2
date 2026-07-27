import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'
import type { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { DrawingEditor } from './DrawingEditor'

import type { EditingSession } from './EditingSession'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import { HitTarget } from '../hitTest/HitTestResult'

export class TrendLineEditor implements DrawingEditor<TrendLineDrawing> {
    public canEdit(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public beginEdit(session: EditingSession, _event: ChartPointerEvent) {
        console.log(session, _event)
    }

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as TrendLineDrawing

        switch (target.target) {
            case HitTarget.StartHandle:
                drawing.start = event.point
                break

            case HitTarget.EndHandle:
                drawing.end = event.point
                break

            case HitTarget.Body: {
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

                break
            }
        }
    }

    public endEdit(_session: EditingSession) {
        console.log(_session)
    }
}
