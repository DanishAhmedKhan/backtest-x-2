import { FibRetracementDrawing } from '../drawings/FibRetracementDrawing'

import type { Drawing } from '../drawings/Drawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'
import { CommonDrawingActions } from './CommonDrawingActions'

import type { DrawingActionFactory } from './DrawinActionFactory'
import { StrokeActions } from './StrokeActions'

export class FibRetracementActionProvider implements DrawingActionProvider<FibRetracementDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly actionFactory: DrawingActionFactory,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is FibRetracementDrawing {
        return drawing instanceof FibRetracementDrawing
    }

    public getActions(drawing: FibRetracementDrawing): DrawingAction[] {
        return [
            ...StrokeActions.getActions(drawing, this.actionFactory),
            ...CommonDrawingActions.getActions(drawing, this.drawingManager, this.actionFactory),
        ]
    }
}
