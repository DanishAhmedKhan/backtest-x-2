import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import { LineDrawing } from '../drawings/LineDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

import { StrokeActions } from './StrokeActions'
import { CommonDrawingActions } from './CommonDrawingActions'

export class LineActionProvider implements DrawingActionProvider<LineDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is LineDrawing {
        return drawing instanceof LineDrawing
    }

    public getActions(drawing: TrendLineDrawing): DrawingAction[] {
        return [
            ...StrokeActions.getActions(drawing, this.drawingStateManager, this.renderInvalidator),

            ...CommonDrawingActions.getActions(
                drawing,
                this.drawingManager,
                this.drawingStateManager,
                this.renderInvalidator,
            ),

            {
                id: 'settings',
                label: 'Settings',
                execute: () => {
                    console.log('Open Trend Line Settings')
                },
            },
        ]
    }
}
