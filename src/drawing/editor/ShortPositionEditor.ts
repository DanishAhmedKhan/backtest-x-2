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

        if (target.target !== HitTarget.Handle) return

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

        const time = event.anchor.time

        drawing.start = {
            ...original.start,
            time,
            price,
        }

        drawing.target = {
            ...original.target,
            time,
        }

        drawing.stoploss = {
            ...original.stoploss,
            time,
        }

        drawing.end = {
            ...original.end,
            price,
        }
    }

    private moveEnd(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        const time = Math.max(event.anchor.time, original.start.time)

        drawing.end = {
            ...original.end,
            time,
        }

        drawing.start = {
            ...original.start,
        }

        drawing.target = {
            ...original.target,
        }

        drawing.stoploss = {
            ...original.stoploss,
        }
    }

    private moveTarget(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        drawing.target = {
            ...original.target,
            price: Math.min(event.anchor.price, original.start.price),
        }

        drawing.start = {
            ...original.start,
        }

        drawing.end = {
            ...original.end,
        }

        drawing.stoploss = {
            ...original.stoploss,
        }
    }

    private moveStoploss(drawing: ShortPositionDrawing, original: ShortPositionDrawing, event: ChartPointerEvent) {
        drawing.stoploss = {
            ...original.stoploss,
            price: Math.max(event.anchor.price, original.start.price),
        }

        drawing.start = {
            ...original.start,
        }

        drawing.end = {
            ...original.end,
        }

        drawing.target = {
            ...original.target,
        }
    }

    private moveBody(
        drawing: ShortPositionDrawing,
        original: ShortPositionDrawing,
        session: EditingSession,
        event: ChartPointerEvent,
    ) {
        const start = session.getMovedAnchor(original.start, event)
        const end = session.getMovedAnchor(original.end, event)
        const target = session.getMovedAnchor(original.target, event)
        const stoploss = session.getMovedAnchor(original.stoploss, event)

        if (!start || !end || !target || !stoploss) return

        drawing.start = start
        drawing.end = end
        drawing.target = target
        drawing.stoploss = stoploss
    }
}
