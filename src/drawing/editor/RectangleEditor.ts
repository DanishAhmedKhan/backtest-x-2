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

        if (!target) return

        const drawing = target.drawing as RectangleDrawing
        const original = session.getOriginalDrawing() as RectangleDrawing

        if (target.target === HitTarget.Body) {
            this.move(drawing, original, session, event)
            return
        }

        if (target.target === HitTarget.Handle && target.handle !== null) {
            this.resize(drawing, original, target.handle, event, session)
        }
    }

    public endEdit(_session: EditingSession) {}

    private resize(
        drawing: RectangleDrawing,
        original: RectangleDrawing,
        handle: RectangleHandle,
        event: ChartPointerEvent,
        session: EditingSession,
    ) {
        const axes = rectangleHandleAxes[handle]

        const originalLeft = Math.min(original.start.time, original.end.time)
        const originalRight = Math.max(original.start.time, original.end.time)

        const originalTop = Math.max(original.start.price, original.end.price)
        const originalBottom = Math.min(original.start.price, original.end.price)

        let left = originalLeft
        let right = originalRight
        let top = originalTop
        let bottom = originalBottom

        const pointerAnchor = session.getAnchorAtPointer(event)

        if (!pointerAnchor) {
            return
        }

        if (axes.horizontal === 'left') {
            left = pointerAnchor.time
        }

        if (axes.horizontal === 'right') {
            right = pointerAnchor.time
        }

        if (axes.vertical === 'top') {
            top = pointerAnchor.price
        }

        if (axes.vertical === 'bottom') {
            bottom = pointerAnchor.price
        }

        drawing.start = {
            ...drawing.start,
            time: left,
            price: top,
        }

        drawing.end = {
            ...drawing.end,
            time: right,
            price: bottom,
        }
    }

    private move(
        drawing: RectangleDrawing,
        original: RectangleDrawing,
        session: EditingSession,
        event: ChartPointerEvent,
    ) {
        const start = session.getMovedAnchor(original.start, event)
        const end = session.getMovedAnchor(original.end, event)

        if (!start || !end) {
            return
        }

        drawing.start = start
        drawing.end = end
    }
}
