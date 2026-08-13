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
        lineWidth: number,
    ) {
        DrawingPrimitives.rectangle(ctx, left, topY, right - left, entryY - topY, profitColor, 0, 'solid', profitColor)

        DrawingPrimitives.rectangle(ctx, left, entryY, right - left, bottomY - entryY, lossColor, 0, 'solid', lossColor)

        DrawingPrimitives.line(ctx, { x: left, y: entryY }, { x: right, y: entryY }, lineColor, lineWidth, 'solid')
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
        lineWidth: number,
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

        DrawingPrimitives.line(ctx, { x: left, y: entryY }, { x: right, y: entryY }, lineColor, lineWidth, 'solid')
    }
}
