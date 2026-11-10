import type { Drawing } from '../drawings/Drawing'
import type { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'
import { FibRetracementHandle } from '../hitTest/FibRetracementHitTester'

import type { DrawingEditor } from './DrawingEditor'
import { DrawingType } from '../drawings/DrawingType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTarget'

export class FibRetracementEditor implements DrawingEditor<FibRetracementDrawing> {
    public canEdit(drawing: Drawing): drawing is FibRetracementDrawing {
        return drawing.type === DrawingType.FibRetracement
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) return

        const drawing = target.drawing as FibRetracementDrawing

        switch (target.target) {
            case HitTarget.Handle:
                if (target.handle === FibRetracementHandle.Start) {
                    this.moveStartHandle(drawing, session, event)
                } else if (target.handle === FibRetracementHandle.End) {
                    this.moveEndHandle(drawing, session, event)
                }
                break

            case HitTarget.Body:
                this.moveBody(drawing, session, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {}

    private moveStartHandle(drawing: FibRetracementDrawing, session: EditingSession, event: ChartPointerEvent) {
        const anchor = session.getAnchorAtPointer(event)

        if (!anchor) return

        drawing.start = anchor
    }

    private moveEndHandle(drawing: FibRetracementDrawing, session: EditingSession, event: ChartPointerEvent) {
        const anchor = session.getAnchorAtPointer(event)

        if (!anchor) return

        drawing.end = anchor
    }

    private moveBody(drawing: FibRetracementDrawing, session: EditingSession, event: ChartPointerEvent) {
        const original = session.getOriginalDrawing() as FibRetracementDrawing

        const start = session.getMovedAnchor(original.start, event)
        const end = session.getMovedAnchor(original.end, event)

        if (!start || !end) return

        drawing.start = start
        drawing.end = end
    }
}
