import type { Point } from '../geometry/Point'

export class DrawingPrimitives {
    public static line(ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string, width: number) {
        ctx.save()

        ctx.strokeStyle = color
        ctx.lineWidth = width

        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        ctx.restore()
    }

    public static circle(ctx: CanvasRenderingContext2D, center: Point, radius: number, fill?: string, stroke?: string) {
        ctx.save()

        ctx.beginPath()
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)

        if (fill) {
            ctx.fillStyle = fill
            ctx.fill()
        }

        if (stroke) {
            ctx.strokeStyle = stroke
            ctx.stroke()
        }

        ctx.restore()
    }

    public static rectangle(
        ctx: CanvasRenderingContext2D,
        topLeft: Point,
        width: number,
        height: number,
        fill?: string,
        stroke?: string,
    ) {
        ctx.save()

        if (fill) {
            ctx.fillStyle = fill
            ctx.fillRect(topLeft.x, topLeft.y, width, height)
        }

        if (stroke) {
            ctx.strokeStyle = stroke
            ctx.strokeRect(topLeft.x, topLeft.y, width, height)
        }

        ctx.restore()
    }

    public static square(ctx: CanvasRenderingContext2D, center: Point, size: number, fill?: string, stroke?: string) {
        this.rectangle(
            ctx,
            {
                x: center.x - size / 2,
                y: center.y - size / 2,
            },
            size,
            size,
            fill,
            stroke,
        )
    }
}
