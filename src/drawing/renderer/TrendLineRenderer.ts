import type { Drawing } from '../drawings/Drawing'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import type { DrawingRenderer } from './DrawingRenderer'

export class TrendLineRenderer implements DrawingRenderer<TrendLineDrawing> {
    public canRender(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.constructor === TrendLineDrawing
    }

    public render(drawing: TrendLineDrawing): void {
        console.log('Render trend line', drawing)
    }

    public destroy(drawing: TrendLineDrawing): void {
        console.log('Destroy trend line', drawing.id)
    }
}
