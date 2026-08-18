import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { PersistedDrawing } from './PersistedDrawing'

import type { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'
import type { RectangleDrawing } from '../drawings/RectangleDrawing'
import type { LongPositionDrawing } from '../drawings/LongPositionDrawing'

export function serializeDrawing(drawing: Drawing): PersistedDrawing {
    switch (drawing.type) {
        case DrawingType.TrendLine: {
            const d = drawing as TrendLineDrawing

            return {
                id: d.id,
                type: d.type,
                data: {
                    start: d.start,
                    end: d.end,
                    color: d.color,
                    style: d.style,
                    width: d.width,
                    locked: d.locked,
                    visible: d.visible,
                },
            }
        }

        case DrawingType.HorizontalLine: {
            const d = drawing as VerticalLineDrawing

            return {
                id: d.id,
                type: d.type,
                data: {
                    anchor: d.anchor,
                    color: d.color,
                    style: d.style,
                    width: d.width,
                    locked: d.locked,
                    visible: d.visible,
                },
            }
        }

        case DrawingType.VerticalLine: {
            const d = drawing as VerticalLineDrawing

            return {
                id: d.id,
                type: d.type,
                data: {
                    anchor: d.anchor,
                    color: d.color,
                    style: d.style,
                    width: d.width,
                    locked: d.locked,
                    visible: d.visible,
                },
            }
        }

        case DrawingType.Rectangle: {
            const d = drawing as RectangleDrawing

            return {
                id: d.id,
                type: d.type,
                data: {
                    start: d.start,
                    end: d.end,
                    color: d.color,
                    style: d.style,
                    width: d.width,
                    background: d.background,
                    locked: d.locked,
                    visible: d.visible,
                },
            }
        }

        case DrawingType.LongPosition: {
            const d = drawing as LongPositionDrawing

            return {
                id: d.id,
                type: d.type,
                data: {
                    start: d.start,
                    end: d.end,
                    target: d.target,
                    stoploss: d.stoploss,
                    direction: d.direction,
                    profitColor: d.profitColor,
                    lossColor: d.lossColor,
                    lineColor: d.lineColor,
                    locked: d.locked,
                    visible: d.visible,
                },
            }
        }

        case DrawingType.ShortPosition: {
            const d = drawing as LongPositionDrawing

            return {
                id: d.id,
                type: d.type,
                data: {
                    start: d.start,
                    end: d.end,
                    target: d.target,
                    stoploss: d.stoploss,
                    direction: d.direction,
                    profitColor: d.profitColor,
                    lossColor: d.lossColor,
                    lineColor: d.lineColor,
                    locked: d.locked,
                    visible: d.visible,
                },
            }
        }

        default:
            throw new Error(`Unsupported drawing type: ${drawing.type}`)
    }
}
