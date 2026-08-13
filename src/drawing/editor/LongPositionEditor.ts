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

        if (!target) return

        const drawing = target.drawing as LongPositionDrawing
        const original = session.getOriginalDrawing() as LongPositionDrawing

        if (!original) return

        if (target.target === HitTarget.Body) {
            this.moveBody(drawing, original, session, event)
            return
        }

        if (target.target !== HitTarget.Handle) {
            return
        }

        switch (target.handle) {
            case LongPositionHandle.Start:
                this.moveStart(drawing, original, event)
                break

            case LongPositionHandle.End:
                this.moveEnd(drawing, original, event)
                break

            case LongPositionHandle.Top:
                this.moveTop(drawing, original, event)
                break

            case LongPositionHandle.Bottom:
                this.moveBottom(drawing, original, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {}

    private moveStart(drawing: LongPositionDrawing, original: LongPositionDrawing, event: ChartPointerEvent) {
        const topPrice = Math.max(original.top.price, original.bottom.price)
        const bottomPrice = Math.min(original.top.price, original.bottom.price)

        const price = Math.max(bottomPrice, Math.min(topPrice, event.anchor.price))

        const logical = event.anchor.logical

        drawing.start = { ...original.start, logical, price }
        drawing.top = { ...original.top, logical }
        drawing.bottom = { ...original.bottom, logical }
        drawing.end = { ...original.end, price }
    }

    private moveEnd(drawing: LongPositionDrawing, original: LongPositionDrawing, event: ChartPointerEvent) {
        const logical = Math.max(event.anchor.logical, original.start.logical)

        drawing.end = { ...original.end, logical }
        drawing.start = { ...original.start }
        drawing.top = { ...original.top }
        drawing.bottom = { ...original.bottom }
    }

    private moveTop(drawing: LongPositionDrawing, original: LongPositionDrawing, event: ChartPointerEvent) {
        drawing.top = {
            ...original.top,
            logical: original.top.logical,
            price: event.anchor.price,
        }

        drawing.start = { ...original.start }
        drawing.end = { ...original.end }
        drawing.bottom = { ...original.bottom }
    }

    private moveBottom(drawing: LongPositionDrawing, original: LongPositionDrawing, event: ChartPointerEvent) {
        drawing.bottom = {
            ...original.bottom,
            logical: original.bottom.logical,
            price: event.anchor.price,
        }

        drawing.start = { ...original.start }
        drawing.end = { ...original.end }
        drawing.top = { ...original.top }
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
