import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { LineDrawing } from '../drawings/LineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'

import type { DrawingActionFactory } from './DrawinActionFactory'
import { StrokeActions } from './StrokeActions'
import { CommonDrawingActions } from './CommonDrawingActions'

export class LineActionProvider implements DrawingActionProvider<LineDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly actionFactory: DrawingActionFactory,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is LineDrawing {
        return drawing instanceof LineDrawing
    }

    public getActions(drawing: TrendLineDrawing): DrawingAction[] {
        return [
            ...StrokeActions.getActions(drawing, this.actionFactory),
            ...CommonDrawingActions.getActions(drawing, this.drawingManager, this.actionFactory),
        ]
    }
}
