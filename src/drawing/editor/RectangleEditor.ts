import type { RectangleDrawing } from '../drawings/RectangleDrawing'
import { RectangleHandle } from '../hitTest/RectangleHitTester'

import type { Drawing } from '../drawings/Drawing'
import type { DrawingEditor } from './DrawingEditor'
import { DrawingType } from '../drawings/DrawingType'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'
import type { EditingSession } from './EditingSession'
import { HitTarget } from '../hitTest/HitTarget'

const rectangleHandleAxes: Record<
    RectangleHandle,
    {
        horizontal: 'left' | 'right' | null
        vertical: 'top' | 'bottom' | null
    }
> = {
    [RectangleHandle.TopLeft]: {
        horizontal: 'left',
        vertical: 'top',
    },

    [RectangleHandle.Top]: {
        horizontal: null,
        vertical: 'top',
    },

    [RectangleHandle.TopRight]: {
        horizontal: 'right',
        vertical: 'top',
    },

    [RectangleHandle.Right]: {
        horizontal: 'right',
        vertical: null,
    },

    [RectangleHandle.BottomRight]: {
        horizontal: 'right',
        vertical: 'bottom',
    },

    [RectangleHandle.Bottom]: {
        horizontal: null,
        vertical: 'bottom',
    },

    [RectangleHandle.BottomLeft]: {
        horizontal: 'left',
        vertical: 'bottom',
    },

    [RectangleHandle.Left]: {
        horizontal: 'left',
        vertical: null,
    },
}

export class RectangleEditor implements DrawingEditor<RectangleDrawing> {
    public canEdit(drawing: Drawing): drawing is RectangleDrawing {
        return drawing.type === DrawingType.Rectangle
    }

    public beginEdit(_session: EditingSession, _event: ChartPointerEvent) {}

    public updateEdit(session: EditingSession, event: ChartPointerEvent) {
        const target = session.getTarget()

        if (!target) {
            return
        }

        const drawing = target.drawing as RectangleDrawing
        const original = session.getOriginalDrawing() as RectangleDrawing

        if (target.target === HitTarget.Body) {
            this.move(drawing, original, session, event)
            return
        }

        if (target.target === HitTarget.Handle && target.handle !== null) {
            this.resize(drawing, original, target.handle, event)
        }
    }

    public endEdit(_session: EditingSession) {}

    private resize(
        drawing: RectangleDrawing,
        original: RectangleDrawing,
        handle: RectangleHandle,
        event: ChartPointerEvent,
    ) {
        const axes = rectangleHandleAxes[handle]

        const originalLeft = Math.min(original.start.logical, original.end.logical)

        const originalRight = Math.max(original.start.logical, original.end.logical)

        const originalTop = Math.max(original.start.price, original.end.price)

        const originalBottom = Math.min(original.start.price, original.end.price)

        let left = originalLeft
        let right = originalRight
        let top = originalTop
        let bottom = originalBottom

        if (axes.horizontal === 'left') {
            left = event.anchor.logical
        }

        if (axes.horizontal === 'right') {
            right = event.anchor.logical
        }

        if (axes.vertical === 'top') {
            top = event.anchor.price
        }

        if (axes.vertical === 'bottom') {
            bottom = event.anchor.price
        }

        drawing.start = {
            ...drawing.start,
            logical: left,
            price: top,
        }

        drawing.end = {
            ...drawing.end,
            logical: right,
            price: bottom,
        }
    }

    private move(
        drawing: RectangleDrawing,
        original: RectangleDrawing,
        session: EditingSession,
        event: ChartPointerEvent,
    ) {
        const startPointer = session.getStartPointer()

        if (!startPointer) {
            return
        }

        const dx = event.anchor.logical - startPointer.logical
        const dy = event.anchor.price - startPointer.price

        drawing.start = {
            ...original.start,
            logical: original.start.logical + dx,
            price: original.start.price + dy,
        }

        drawing.end = {
            ...original.end,
            logical: original.end.logical + dx,
            price: original.end.price + dy,
        }
    }
}
