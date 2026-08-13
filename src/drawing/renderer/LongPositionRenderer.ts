import type { LongPositionDrawing } from '../drawings/LongPositionDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingRenderState'
import type { DrawingRenderer } from './DrawingRenderer'
import type { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPositions } from './DawingPositions'
import { DrawingHandles } from './DrawingHandles'
import { removeAlpha } from '../../helper/color'

export class LongPositionRenderer implements DrawingRenderer<LongPositionDrawing> {
    public canRender(drawing: Drawing): drawing is LongPositionDrawing {
        return drawing.type === DrawingType.LongPosition
    }

    public render(
        drawing: LongPositionDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const top = transformer.toPoint(drawing.top)
        const bottom = transformer.toPoint(drawing.bottom)

        if (!start || !end || !top || !bottom) {
            return
        }

        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)

        const entryY = start.y
        const profitTopY = Math.min(top.y, entryY)
        const lossBottomY = Math.max(bottom.y, entryY)

        DrawingPositions.long(
            ctx,
            left,
            right,
            entryY,
            profitTopY,
            lossBottomY,
            drawing.profitColor,
            drawing.lossColor,
            drawing.lineColor,
        )

        if (state.selected || state.hovered) {
            const centerX = (left + right) / 2

            const target = Math.abs(drawing.top.price - drawing.start.price)
            const stop = Math.abs(drawing.start.price - drawing.bottom.price)
            const riskReward = stop !== 0 ? target / stop : 0

            const targetText = `Target: ${target.toFixed(5)}`
            const rewardText = `Risk/Reward: ${riskReward.toFixed(2)}`
            const stopText = `Stop: ${stop.toFixed(5)}`

            const targetWidth = DrawingPositions.labelWidth(ctx, targetText)
            const rewardWidth = DrawingPositions.labelWidth(ctx, rewardText)
            const stopWidth = DrawingPositions.labelWidth(ctx, stopText)

            const maxLabelWidth = Math.max(targetWidth, rewardWidth, stopWidth)

            const drawingWidth = right - left
            const isNarrow = drawingWidth < maxLabelWidth

            const targetY = top.y + (isNarrow ? -DrawingPositions.LABEL_OFFSET_Y : 0)
            const rewardY = entryY + (isNarrow ? -DrawingPositions.LABEL_OFFSET_Y : 0)
            const stopY = bottom.y + (isNarrow ? DrawingPositions.LABEL_OFFSET_Y : 0)

            DrawingPositions.label(ctx, targetText, centerX, targetY, removeAlpha(drawing.profitColor))

            DrawingPositions.label(ctx, rewardText, centerX, rewardY, removeAlpha(drawing.lossColor))

            DrawingPositions.label(ctx, stopText, centerX, stopY, removeAlpha(drawing.lossColor))

            DrawingHandles.circle(ctx, start, state.selected)
            DrawingHandles.square(ctx, end, state.selected)
            DrawingHandles.square(ctx, top, state.selected)
            DrawingHandles.square(ctx, bottom, state.selected)
        }
    }

    public destroy(_drawing: LongPositionDrawing) {}
}
