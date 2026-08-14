import type { Point } from '../geometry/Point'

export class DrawingPrimitives {
    public static drawLine(
        ctx: CanvasRenderingContext2D,
        start: Point,
        end: Point,
        color: string,
        width: number,
        style: string,
    ) {
        ctx.save()

        ctx.strokeStyle = color
        ctx.lineWidth = width

        switch (style) {
            case 'dashed':
                ctx.setLineDash([8, 6])
                break
            case 'dotted':
                ctx.setLineDash([2, 4])
                break
            case 'solid':
                ctx.setLineDash([])
                break
        }

        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()

        ctx.restore()
    }

    public static drawCircle(
        ctx: CanvasRenderingContext2D,
        center: Point,
        radius: number,
        fill?: string,
        stroke?: string,
    ) {
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

    public static drawRectangle(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        borderColor: string,
        borderWidth: number,
        borderStyle: string,
        backgroundColor: string,
    ) {
        ctx.save()

        ctx.fillStyle = backgroundColor
        ctx.fillRect(x, y, width, height)

        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth

        if (borderStyle === 'dashed') {
            ctx.setLineDash([8, 6])
        } else if (borderStyle === 'dotted') {
            ctx.setLineDash([2, 4])
        } else {
            ctx.setLineDash([])
        }

        ctx.strokeRect(x, y, width, height)

        ctx.restore()
    }

    public static fillRectangle(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
    ) {
        ctx.save()

        ctx.fillStyle = color
        ctx.fillRect(x, y, width, height)
        ctx.restore()
    }

    public static drawSquare(
        ctx: CanvasRenderingContext2D,
        center: Point,
        size: number,
        backgroundColor: string,
        borderColor: string,
    ) {
        const x = center.x - size / 2
        const y = center.y - size / 2

        ctx.fillStyle = backgroundColor
        ctx.fillRect(x, y, size, size)

        ctx.strokeStyle = borderColor
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, size, size)
    }
}
