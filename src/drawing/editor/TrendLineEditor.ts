import type { Drawing } from '../drawings/Drawing'
import type { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { TrendLineHandle } from '../hitTest/TrendLineHitTester'
import { TrendLineSnapper } from '../geometry/TrebdLineSnapper'

import type { DrawingEditor } from './DrawingEditor'
import { DrawingType } from '../drawings/DrawingType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTarget'
import type { TimeCoordinateResolver } from '../renderer/TimeCoordinateResolver'
import type { CoordinateTransformer } from '../renderer/CoordinateTransformer'

export class TrendLineEditor implements DrawingEditor<TrendLineDrawing> {
    private readonly snapper: TrendLineSnapper

    constructor(private readonly timeResolver: TimeCoordinateResolver, transformer: CoordinateTransformer) {
        this.snapper = new TrendLineSnapper(transformer)
    }

    public canEdit(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) return

        const drawing = target.drawing as TrendLineDrawing

        switch (target.target) {
            case HitTarget.Handle:
                switch (target.handle) {
                    case TrendLineHandle.Start:
                        this.moveStartHandle(drawing, event)
                        break

                    case TrendLineHandle.End:
                        this.moveEndHandle(drawing, event)
                        break
                }
                break

            case HitTarget.Body:
                this.moveBody(drawing, session, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {}

    private moveStartHandle(drawing: TrendLineDrawing, event: ChartPointerEvent) {
        // drawing.start = {
        //     ...event.anchor,
        // }

        drawing.start = this.snapper.snap(drawing.end, event)
    }

    private moveEndHandle(drawing: TrendLineDrawing, event: ChartPointerEvent) {
        // drawing.end = {
        //     ...event.anchor,
        // }

        drawing.end = this.snapper.snap(drawing.start, event)
    }

    private moveBody(drawing: TrendLineDrawing, session: EditingSession, event: ChartPointerEvent) {
        const original = session.getOriginalDrawing() as TrendLineDrawing
        const startPointer = session.getStartPointer()

        if (!original || !startPointer) {
            return
        }

        const logicalDelta = event.anchor.logical - startPointer.logical
        const priceDelta = event.anchor.price - startPointer.price

        const startLogical = original.start.logical + logicalDelta
        const endLogical = original.end.logical + logicalDelta

        const startTime = this.timeResolver.logicalToTime(startLogical)
        const endTime = this.timeResolver.logicalToTime(endLogical)

        if (startTime == null || endTime == null) {
            return
        }

        drawing.start = {
            logical: startLogical,
            time: startTime,
            price: original.start.price + priceDelta,
        }

        drawing.end = {
            logical: endLogical,
            time: endTime,
            price: original.end.price + priceDelta,
        }
    }
}
