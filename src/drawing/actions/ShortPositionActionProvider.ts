import type { ShortPositionDrawing } from '../drawings/ShortPositionDrawing'

import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../drawings/DrawingType'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

import type { DrawingActionFactory } from './DrawinActionFactory'
import { CommonDrawingActions } from './CommonDrawingActions'

export class ShortPositionActionProvider implements DrawingActionProvider<ShortPositionDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
        private readonly actionFactory: DrawingActionFactory,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is ShortPositionDrawing {
        return drawing.type === DrawingType.ShortPosition
    }

    public getActions(drawing: ShortPositionDrawing): DrawingAction[] {
        return [
            {
                id: 'background',
                label: 'Profit Background Color',
                value: drawing.profitColor,
                execute: (color) => {
                    drawing.profitColor = color

                    this.drawingManager.notifyChanged()
                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },
            {
                id: 'background',
                label: 'Loss Background Color',
                value: drawing.lossColor,
                execute: (color) => {
                    drawing.lossColor = color

                    this.drawingManager.notifyChanged()
                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },

            ...CommonDrawingActions.getActions(drawing, this.drawingManager, this.actionFactory),
        ]
    }
}
