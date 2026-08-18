import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { PersistedDrawing } from './PersistedDrawing'
import type { PositionDirection } from '../drawings/PositionDrawing'

import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'
import { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'
import { RectangleDrawing } from '../drawings/RectangleDrawing'
import { LongPositionDrawing } from '../drawings/LongPositionDrawing'
import { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'

export function deserializeDrawing(data: PersistedDrawing): Drawing | null {
    switch (data.type) {
        case DrawingType.TrendLine: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                color?: string
                style?: string
                width?: number
                locked?: boolean
                visible?: boolean
            }

            const drawing = new TrendLineDrawing(data.id, { ...d.start }, { ...d.end })

            if (d.color !== undefined) drawing.color = d.color
            if (d.style !== undefined) drawing.style = d.style
            if (d.width !== undefined) drawing.width = d.width
            if (d.locked !== undefined) drawing.locked = d.locked
            if (d.visible !== undefined) drawing.visible = d.visible

            return drawing
        }

        case DrawingType.HorizontalLine: {
            const d = data.data as {
                anchor: DrawingAnchor
                color?: string
                style?: string
                width?: number
                locked?: boolean
                visible?: boolean
            }

            const drawing = new HorizontalLineDrawing(data.id, { ...d.anchor })

            if (d.color !== undefined) drawing.color = d.color
            if (d.style !== undefined) drawing.style = d.style
            if (d.width !== undefined) drawing.width = d.width
            if (d.locked !== undefined) drawing.locked = d.locked
            if (d.visible !== undefined) drawing.visible = d.visible

            return drawing
        }

        case DrawingType.VerticalLine: {
            const d = data.data as {
                anchor: DrawingAnchor
                color?: string
                style?: string
                width?: number
                locked?: boolean
                visible?: boolean
            }

            const drawing = new VerticalLineDrawing(data.id, { ...d.anchor })

            if (d.color !== undefined) drawing.color = d.color
            if (d.style !== undefined) drawing.style = d.style
            if (d.width !== undefined) drawing.width = d.width
            if (d.locked !== undefined) drawing.locked = d.locked
            if (d.visible !== undefined) drawing.visible = d.visible

            return drawing
        }

        case DrawingType.Rectangle: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                color?: string
                style?: string
                width?: number
                background?: string
                locked?: boolean
                visible?: boolean
            }

            const drawing = new RectangleDrawing(data.id, { ...d.start }, { ...d.end })

            if (d.color !== undefined) drawing.color = d.color
            if (d.style !== undefined) drawing.style = d.style
            if (d.width !== undefined) drawing.width = d.width
            if (d.background !== undefined) drawing.background = d.background
            if (d.locked !== undefined) drawing.locked = d.locked
            if (d.visible !== undefined) drawing.visible = d.visible

            return drawing
        }

        case DrawingType.LongPosition: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                target: DrawingAnchor
                stoploss: DrawingAnchor
                direction: PositionDirection
                profitColor?: string
                lossColor?: string
                lineColor?: string
                locked?: boolean
                visible?: boolean
            }

            const drawing = new LongPositionDrawing(
                data.id,
                { ...d.start },
                { ...d.end },
                { ...d.target },
                { ...d.stoploss },
                d.direction,
            )

            if (d.profitColor !== undefined) drawing.profitColor = d.profitColor
            if (d.lossColor !== undefined) drawing.lossColor = d.lossColor
            if (d.lineColor !== undefined) drawing.lineColor = d.lineColor
            if (d.locked !== undefined) drawing.locked = d.locked
            if (d.visible !== undefined) drawing.visible = d.visible

            return drawing
        }

        case DrawingType.ShortPosition: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                target: DrawingAnchor
                stoploss: DrawingAnchor
                direction: PositionDirection
                profitColor?: string
                lossColor?: string
                lineColor?: string
                locked?: boolean
                visible?: boolean
            }

            const drawing = new ShortPositionDrawing(
                data.id,
                { ...d.start },
                { ...d.end },
                { ...d.target },
                { ...d.stoploss },
                d.direction,
            )

            if (d.profitColor !== undefined) drawing.profitColor = d.profitColor
            if (d.lossColor !== undefined) drawing.lossColor = d.lossColor
            if (d.lineColor !== undefined) drawing.lineColor = d.lineColor
            if (d.locked !== undefined) drawing.locked = d.locked
            if (d.visible !== undefined) drawing.visible = d.visible

            return drawing
        }

        default:
            console.warn(`Unsupported persisted drawing type: ${data.type}`)
            return null
    }
}
