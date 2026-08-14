import type { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'
import { ShortPositionHandle } from '../hitTest/ShortPositionHitTester'

import type { Drawing } from '../drawings/Drawing'
import type { DrawingEditor } from './DrawingEditor'
import { DrawingType } from '../drawings/DrawingType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTarget'

export class ShortPositionEditor implements DrawingEditor<ShortPositionDrawing> {
    public canEdit(drawing: Drawing): drawing is ShortPositionDrawing {
        return drawing.type === DrawingType.ShortPosition
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) return

        const drawing = target.drawing as ShortPositionDrawing
        const original = session.getOriginalDrawing() as ShortPositionDrawing

        if (!original) return

        if (target.target === HitTarget.Body) {
            this.moveBody(drawing, original, session, event)
            return
        }

        if (target.target !== HitTarget.Handle) {
            return
        }

        switch (target.handle) {
            case ShortPositionHandle.Start:
                this.moveStart(drawing, original, event)
                break

            case ShortPositionHandle.End:
                this.moveEnd(drawing, original, event)
                break

            case ShortPositionHandle.Target:
                this.moveTarget(drawing, original, event)
                break

            case ShortPositionHandle.Stoploss:
                this.moveStoploss(drawing, original, event)
                break
        }
    }

    public endEdit(_session: EditingSession) {}

    private moveStart(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        const topPrice = Math.max(original.target.price, original.stoploss.price)
        const bottomPrice = Math.min(original.target.price, original.stoploss.price)

        const price = Math.max(bottomPrice, Math.min(topPrice, event.anchor.price))

        const logical = event.anchor.logical

        drawing.start = { ...original.start, logical, price }
        drawing.target = { ...original.target, logical }
        drawing.stoploss = { ...original.stoploss, logical }
        drawing.end = { ...original.end, price }
    }

    private moveEnd(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        const logical = Math.max(event.anchor.logical, original.start.logical)

        drawing.end = { ...original.end, logical }
        drawing.start = { ...original.start }
        drawing.target = { ...original.target }
        drawing.stoploss = { ...original.stoploss }
    }

    private moveTarget(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        drawing.target = {
            ...original.target,
            logical: original.target.logical,
            price: Math.min(event.anchor.price, original.start.price),
        }

        drawing.start = { ...original.start }
        drawing.end = { ...original.end }
        drawing.stoploss = { ...original.stoploss }
    }

    private moveStoploss(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        drawing.stoploss = {
            ...original.stoploss,
            logical: original.stoploss.logical,
            price: Math.max(event.anchor.price, original.start.price),
        }

        drawing.start = { ...original.start }
        drawing.end = { ...original.end }
        drawing.target = { ...original.target }
    }

    private moveBody(
        drawing: ShortPositionDrawing,
        original: ShortPositionDrawing,
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

        drawing.target = {
            ...original.target,
            logical: original.target.logical + logicalDelta,
            price: original.target.price + priceDelta,
        }

        drawing.stoploss = {
            ...original.stoploss,
            logical: original.stoploss.logical + logicalDelta,
            price: original.stoploss.price + priceDelta,
        }
    }
}
