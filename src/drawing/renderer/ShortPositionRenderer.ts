import type { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingRenderState } from './DrawingRenderState'
import type { DrawingRenderer } from './DrawingRenderer'
import type { CoordinateTransformer } from './CoordinateTransformer'

import { DrawingPositions } from './DawingPositions'
import { DrawingHandles } from './DrawingHandles'

export class ShortPositionRenderer implements DrawingRenderer<ShortPositionDrawing> {
    public canRender(drawing: Drawing): drawing is ShortPositionDrawing {
        return drawing.type === DrawingType.ShortPosition
    }

    public render(
        drawing: ShortPositionDrawing,
        ctx: CanvasRenderingContext2D,
        transformer: CoordinateTransformer,
        state: DrawingRenderState,
    ) {
        const start = transformer.toPoint(drawing.start)
        const end = transformer.toPoint(drawing.end)
        const target = transformer.toPoint(drawing.target)
        const stoploss = transformer.toPoint(drawing.stoploss)

        if (!start || !end || !target || !stoploss) return

        const left = Math.min(start.x, end.x)
        const right = Math.max(start.x, end.x)

        DrawingPositions.short(
            ctx,
            left,
            right,
            start.y,
            target.y,
            stoploss.y,
            drawing.profitColor,
            drawing.lossColor,
            drawing.lineColor,
        )

        if (state.selected || state.hovered) {
            const targetPrice = Math.abs(drawing.target.price - drawing.start.price)
            const stoplossPrice = Math.abs(drawing.start.price - drawing.stoploss.price)
            const riskReward = stoplossPrice !== 0 ? targetPrice / stoplossPrice : 0

            const targetText = `Target: ${targetPrice.toFixed(5)}`
            const rewardText = `Risk/Reward: ${riskReward.toFixed(2)}`
            const stopText = `Stop: ${stoplossPrice.toFixed(5)}`

            DrawingPositions.labels(
                ctx,
                false,
                start,
                end,
                target,
                stoploss,
                riskReward,
                targetText,
                rewardText,
                stopText,
                drawing.profitColor,
                drawing.lossColor,
            )

            DrawingHandles.circle(ctx, start, state.selected)
            DrawingHandles.square(ctx, end, state.selected)
            DrawingHandles.square(ctx, target, state.selected)
            DrawingHandles.square(ctx, stoploss, state.selected)
        }
    }

    public destroy(_drawing: ShortPositionDrawing) {}
}
