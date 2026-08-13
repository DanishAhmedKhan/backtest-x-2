import { DrawingPrimitives } from './DrawingPrimitives'

export class DrawingPositions {
    public static long(
        ctx: CanvasRenderingContext2D,
        left: number,
        right: number,
        entryY: number,
        topY: number,
        bottomY: number,
        profitColor: string,
        lossColor: string,
        lineColor: string,
    ) {
        DrawingPrimitives.rectangle(ctx, left, topY, right - left, entryY - topY, profitColor, 0, 'solid', profitColor)

        DrawingPrimitives.rectangle(ctx, left, entryY, right - left, bottomY - entryY, lossColor, 0, 'solid', lossColor)

        DrawingPrimitives.line(ctx, { x: left, y: entryY }, { x: right, y: entryY }, lineColor, 1, 'solid')
    }

    public static short(
        ctx: CanvasRenderingContext2D,
        left: number,
        right: number,
        entryY: number,
        topY: number,
        bottomY: number,
        profitColor: string,
        lossColor: string,
        lineColor: string,
    ) {
        DrawingPrimitives.rectangle(ctx, left, topY, right - left, entryY - topY, lineColor, 0, 'solid', lossColor)

        DrawingPrimitives.rectangle(
            ctx,
            left,
            entryY,
            right - left,
            bottomY - entryY,
            lineColor,
            0,
            'solid',
            profitColor,
        )

        DrawingPrimitives.line(ctx, { x: left, y: entryY }, { x: right, y: entryY }, lineColor, 1, 'solid')
    }

    static LABEL_PADDING_X = 8
    static LABEL_HEIGHT = 20
    static LABEL_RADIUS = 4
    static LABEL_OFFSET_Y = 20

    public static label(
        ctx: CanvasRenderingContext2D,
        text: string,
        centerX: number,
        y: number,
        backgroundColor: string,
    ) {
        ctx.save()

        ctx.font = '12px Roboto, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const width = ctx.measureText(text).width + 8 * 2

        const x = centerX - width / 2
        const top = y - 20 / 2

        ctx.beginPath()
        ctx.roundRect(x, top, width, 20, 4)

        ctx.fillStyle = backgroundColor
        ctx.fill()

        ctx.fillStyle = '#fff'
        ctx.fillText(text, centerX, y)

        ctx.restore()
    }

    public static labelWidth(ctx: CanvasRenderingContext2D, text: string) {
        ctx.save()

        ctx.font = '12px Roboto, sans-serif'

        const width = ctx.measureText(text).width + 8 * 2

        ctx.restore()

        return width
    }
}
