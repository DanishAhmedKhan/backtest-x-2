import type { LongPositionDrawing } from '../drawings/LongPositionDrawing'
import { LongPositionHandle } from '../hitTest/LongPositionHitTester'

import type { Drawing } from '../drawings/Drawing'
import type { DrawingEditor } from './DrawingEditor'
import { DrawingType } from '../drawings/DrawingType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTarget'

export class LongPositionEditor implements DrawingEditor<LongPositionDrawing> {
    public canEdit(drawing: Drawing): drawing is LongPositionDrawing {
        return drawing.type === DrawingType.LongPosition
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as LongPositionDrawing
        const original = session.getOriginalDrawing() as LongPositionDrawing

        if (!original) {
            return
        }

        switch (target.target) {
            case HitTarget.Handle:
                switch (target.handle) {
                    case LongPositionHandle.Start:
                        this.moveStart(drawing, event)
                        break

                    case LongPositionHandle.End:
                        this.moveEnd(drawing, event)
                        break

                    case LongPositionHandle.Top:
                        this.moveTop(drawing, event)
                        break

                    case LongPositionHandle.Bottom:
                        this.moveBottom(drawing, event)
                        break
                }
                break

            case HitTarget.Body:
                this.moveBody(drawing, original, session, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {}

    private moveStart(drawing: LongPositionDrawing, event: ChartPointerEvent) {
        drawing.start = {
            ...drawing.start,
            logical: event.anchor.logical,
            price: event.anchor.price,
        }
    }

    private moveEnd(drawing: LongPositionDrawing, event: ChartPointerEvent) {
        drawing.end = {
            ...drawing.end,
            logical: event.anchor.logical,
            price: event.anchor.price,
        }
    }

    private moveTop(drawing: LongPositionDrawing, event: ChartPointerEvent) {
        drawing.top = {
            ...drawing.top,
            logical: event.anchor.logical,
            price: event.anchor.price,
        }
    }

    private moveBottom(drawing: LongPositionDrawing, event: ChartPointerEvent) {
        drawing.bottom = {
            ...drawing.bottom,
            logical: event.anchor.logical,
            price: event.anchor.price,
        }
    }

    private moveBody(
        drawing: LongPositionDrawing,
        original: LongPositionDrawing,
        session: EditingSession,
        event: ChartPointerEvent,
    ) {
        const startPointer = session.getStartPointer()

        if (!startPointer) {
            return
        }

        const logicalDelta = event.anchor.logical - startPointer.logical

        const priceDelta = event.anchor.price - startPointer.price

        drawing.start = {
            ...original.start,
            logical: original.start.logical + logicalDelta,
            price: original.start.price + priceDelta,
        }

        drawing.end = {
            ...original.end,
            logical: original.end.logical + logicalDelta,
            price: original.end.price + priceDelta,
        }

        drawing.top = {
            ...original.top,
            logical: original.top.logical + logicalDelta,
            price: original.top.price + priceDelta,
        }

        drawing.bottom = {
            ...original.bottom,
            logical: original.bottom.logical + logicalDelta,
            price: original.bottom.price + priceDelta,
        }
    }
}
