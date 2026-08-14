import { DrawingPrimitives } from './DrawingPrimitives'

import type { Point } from '../geometry/Point'
import { removeAlpha } from '../../helper/color'

export class DrawingPositions {
    public static long(
        ctx: CanvasRenderingContext2D,
        left: number,
        right: number,
        entryY: number,
        targetY: number,
        stoplossY: number,
        profitColor: string,
        lossColor: string,
        lineColor: string,
    ) {
        const width = right - left
        const targetHeight = Math.abs(entryY - targetY)
        const stoplossHeight = Math.abs(stoplossY - entryY)

        DrawingPrimitives.fillRectangle(ctx, left, targetY, width, targetHeight, profitColor)
        DrawingPrimitives.fillRectangle(ctx, left, entryY, width, stoplossHeight, lossColor)
        DrawingPrimitives.drawLine(ctx, { x: left, y: entryY }, { x: right, y: entryY }, lineColor, 1, 'solid')
    }

    public static short(
        ctx: CanvasRenderingContext2D,
        left: number,
        right: number,
        entryY: number,
        targetY: number,
        stoplossY: number,
        profitColor: string,
        lossColor: string,
        lineColor: string,
    ) {
        const width = right - left
        const targetHeight = Math.abs(targetY - entryY)
        const stoplossHeight = Math.abs(entryY - stoplossY)

        DrawingPrimitives.fillRectangle(ctx, left, entryY, width, targetHeight, profitColor)
        DrawingPrimitives.fillRectangle(ctx, left, stoplossY, width, stoplossHeight, lossColor)
        DrawingPrimitives.drawLine(ctx, { x: left, y: entryY }, { x: right, y: entryY }, lineColor, 1, 'solid')
    }

    static LABEL_PADDING_X = 5
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

        const width = ctx.measureText(text).width + 5 * 2

        const x = centerX - width / 2
        const top = y - 20 / 2 - 1

        ctx.beginPath()
        ctx.roundRect(x, top, width, 20, 4)

        ctx.fillStyle = backgroundColor
        ctx.fill()

        ctx.fillStyle = '#fff'
        ctx.fillText(text, centerX, y)

        ctx.restore()
    }

    public static labels(
        ctx: CanvasRenderingContext2D,
        long: boolean,
        start: Point,
        end: Point,
        top: Point,
        bottom: Point,
        riskReward: number,
        targetText: string,
        rewardText: string,
        stopText: string,
        profitColor: string,
        lossColor: string,
    ) {
        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)
        const entryY = start.y

        const centerX = (left + right) / 2

        const targetWidth = DrawingPositions.labelWidth(ctx, targetText)
        const rewardWidth = DrawingPositions.labelWidth(ctx, rewardText)
        const stopWidth = DrawingPositions.labelWidth(ctx, stopText)

        const maxLabelWidth = Math.max(targetWidth, rewardWidth, stopWidth)

        const offset = 20
        const threshold = 30
        const drawingWidth = right - left
        const isNarrow = drawingWidth < maxLabelWidth + threshold
        const isOneToOne = riskReward > 1.1
        const factor = long ? -1 : 1

        const targetY = top.y + (isNarrow ? offset * factor : 0) + 1
        const rewardY = entryY + (isNarrow ? -offset * factor * (isOneToOne ? -1 : 1) : 0)
        const stopY = bottom.y + (isNarrow ? -offset * factor : 0)

        DrawingPositions.label(ctx, targetText, centerX, targetY, removeAlpha(profitColor))
        DrawingPositions.label(ctx, rewardText, centerX, rewardY, removeAlpha(lossColor))
        DrawingPositions.label(ctx, stopText, centerX, stopY, removeAlpha(lossColor))
    }

    public static labelWidth(ctx: CanvasRenderingContext2D, text: string) {
        ctx.save()
        ctx.font = '12px Roboto, sans-serif'

        const width = ctx.measureText(text).width + 5 * 2
        ctx.restore()

        return width
    }
}
