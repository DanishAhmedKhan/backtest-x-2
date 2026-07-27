import type { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { Drawing } from '../drawings/Drawing'
import type { ChartPointerEvent } from '../models/ChartPointerEvents'

import type { DrawingEditor } from './DrawingEditor'
import type { EditTarget } from './EditTarget'

import { DrawingType } from '../DrawingType'

export class TrendLineEditor implements DrawingEditor<TrendLineDrawing> {
    public canEdit(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public beginEdit(drawing: TrendLineDrawing, target: EditTarget, event: ChartPointerEvent): void {
        console.log(drawing, target, event)
    }

    public updateEdit(drawing: TrendLineDrawing, target: EditTarget, event: ChartPointerEvent): void {
        console.log(drawing, target, event)
    }

    public endEdit(drawing: TrendLineDrawing, target: EditTarget): void {
        console.log(drawing, target)
    }
}
