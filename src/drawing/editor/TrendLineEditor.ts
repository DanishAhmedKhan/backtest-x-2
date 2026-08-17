import type { Drawing } from '../drawings/Drawing'
import type { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { TrendLineHandle } from '../hitTest/TrendLineHitTester'
import { TrendLineSnapper } from '../geometry/TrebdLineSnapper'

import type { DrawingEditor } from './DrawingEditor'
import { DrawingType } from '../drawings/DrawingType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTarget'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class TrendLineEditor implements DrawingEditor<TrendLineDrawing> {
    private readonly snapper: TrendLineSnapper

    constructor(transformer: CoordinateTransformer) {
        this.snapper = new TrendLineSnapper(transformer)
    }

    public canEdit(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as TrendLineDrawing

        switch (target.target) {
            case HitTarget.Handle:
                if (target.handle === TrendLineHandle.Start) {
                    this.moveStartHandle(drawing, session, event)
                } else if (target.handle === TrendLineHandle.End) {
                    this.moveEndHandle(drawing, session, event)
                }
                break

            case HitTarget.Body:
                this.moveBody(drawing, session, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {}

    private moveStartHandle(drawing: TrendLineDrawing, session: EditingSession, event: ChartPointerEvent) {
        const pointerAnchor = session.getAnchorAtPointer(event)

        if (!pointerAnchor) {
            return
        }

        drawing.start = this.snapper.snap(drawing.end, pointerAnchor, event.screen, event.shiftKey)
    }

    private moveEndHandle(drawing: TrendLineDrawing, session: EditingSession, event: ChartPointerEvent) {
        const pointerAnchor = session.getAnchorAtPointer(event)

        if (!pointerAnchor) {
            return
        }

        drawing.end = this.snapper.snap(drawing.start, pointerAnchor, event.screen, event.shiftKey)
    }

    private moveBody(drawing: TrendLineDrawing, session: EditingSession, event: ChartPointerEvent) {
        const original = session.getOriginalDrawing() as TrendLineDrawing

        const start = session.getMovedAnchor(original.start, event)
        const end = session.getMovedAnchor(original.end, event)

        if (!start || !end) {
            return
        }

        drawing.start = start
        drawing.end = end
    }
}
