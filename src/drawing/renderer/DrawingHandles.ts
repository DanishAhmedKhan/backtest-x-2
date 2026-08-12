import type { Point } from '../geometry/Point'
import { CIRCLE_HANDLE_SIZE, SQUARE_HANDLE_SIZE } from '../hitTest/HitTestConstant'

export enum HandleType {
    CIRCLE = 'circle',
    SQUARE = 'square',
}

export class DrawingHandles {
    public static circle(
        ctx: CanvasRenderingContext2D,
        center: Point,
        selected: boolean = false,
        radius = CIRCLE_HANDLE_SIZE,
        borderColor = '#2962ff',
        backgroundColor = '#fff',
    ) {
        ctx.beginPath()
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)

        ctx.fillStyle = backgroundColor
        ctx.fill()

        ctx.lineWidth = selected ? 2 : 1
        ctx.strokeStyle = borderColor
        ctx.stroke()
    }

    public static square(
        ctx: CanvasRenderingContext2D,
        center: Point,
        selected: boolean = false,
        size = SQUARE_HANDLE_SIZE * 2,
        borderColor = '#2962ff',
        backgroundColor = '#fff',
        radius = 2,
    ) {
        const x = center.x - size / 2
        const y = center.y - size / 2

        ctx.beginPath()
        ctx.roundRect(x, y, size, size, radius)

        ctx.fillStyle = backgroundColor
        ctx.fill()

        ctx.lineWidth = selected ? 2 : 1
        ctx.strokeStyle = borderColor
        ctx.stroke()
    }
}
