import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'

import type { Drawing } from '../drawings/Drawing'
import { TrendLineDrawing } from '../drawings/TrendLineDrawing'

import { DrawingManager } from '../managers/DrawingManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { LineDrawing } from '../drawings/LineDrawing'

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
            {
                id: 'color',
                label: 'Color',
                value: drawing.color,
                execute: (color) => {
                    drawing.color = color

                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },
            {
                id: 'line-width',
                label: 'Line Width',
                value: drawing.width,
                execute: (width) => {
                    drawing.width = width

                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },
            {
                id: 'delete',
                label: 'Delete',
                execute: () => {
                    this.drawingManager.removeDrawing(drawing.id)

                    this.drawingStateManager.clearSelection()
                    this.renderInvalidator.invalidate()
                },
            },
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
