import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { PersistedDrawing } from './PersistedDrawing'

import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'
import { VerticalLineDrawing } from '../drawings/VerticalLineDrawing'
import { RectangleDrawing } from '../drawings/RectangleDrawing'
import { LongPositionDrawing } from '../drawings/LongPositionDrawing'
import { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'
import { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'

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

            drawing.color = d.color ?? drawing.color
            drawing.style = d.style ?? drawing.style
            drawing.width = d.width ?? drawing.width
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

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

            drawing.color = d.color ?? drawing.color
            drawing.style = d.style ?? drawing.style
            drawing.width = d.width ?? drawing.width
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

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

            drawing.color = d.color ?? drawing.color
            drawing.style = d.style ?? drawing.style
            drawing.width = d.width ?? drawing.width
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

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

            drawing.color = d.color ?? drawing.color
            drawing.style = d.style ?? drawing.style
            drawing.width = d.width ?? drawing.width
            drawing.background = d.background ?? drawing.background
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

            return drawing
        }

        case DrawingType.LongPosition: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                target: DrawingAnchor
                stoploss: DrawingAnchor
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
            )

            drawing.profitColor = d.profitColor ?? drawing.profitColor
            drawing.lossColor = d.lossColor ?? drawing.lossColor
            drawing.lineColor = d.lineColor ?? drawing.lineColor
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

            return drawing
        }

        case DrawingType.ShortPosition: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                target: DrawingAnchor
                stoploss: DrawingAnchor
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
            )

            drawing.profitColor = d.profitColor ?? drawing.profitColor
            drawing.lossColor = d.lossColor ?? drawing.lossColor
            drawing.lineColor = d.lineColor ?? drawing.lineColor
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

            return drawing
        }

        case DrawingType.FibRetracement: {
            const d = data.data as {
                start: DrawingAnchor
                end: DrawingAnchor
                color?: string
                style?: string
                width?: number
                locked?: boolean
                visible?: boolean
            }

            const drawing = new FibRetracementDrawing(data.id, { ...d.start }, { ...d.end })

            drawing.color = d.color ?? drawing.color
            drawing.style = d.style ?? drawing.style
            drawing.width = d.width ?? drawing.width
            drawing.locked = d.locked ?? drawing.locked
            drawing.visible = d.visible ?? drawing.visible

            return drawing
        }

        default:
            console.warn(`Unsupported persisted drawing type: ${data.type}`)
            return null
    }
}
