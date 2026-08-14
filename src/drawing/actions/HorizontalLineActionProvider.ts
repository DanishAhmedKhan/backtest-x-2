import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'

import type { Drawing } from '../drawings/Drawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'

import type { DrawingActionFactory } from './DrawinActionFactory'
import { CommonDrawingActions } from './CommonDrawingActions'
import { StrokeActions } from './StrokeActions'

export class HorizontalLineActionProvider implements DrawingActionProvider<HorizontalLineDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly actionFactory: DrawingActionFactory,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is HorizontalLineDrawing {
        return drawing instanceof HorizontalLineDrawing
    }

    public getActions(drawing: HorizontalLineDrawing): DrawingAction[] {
        return [
            ...StrokeActions.getActions(drawing, this.actionFactory),
            ...CommonDrawingActions.getActions(drawing, this.drawingManager, this.actionFactory),
        ]
    }
}
