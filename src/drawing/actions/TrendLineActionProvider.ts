import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'

import { TrendLineDrawing } from '../drawings/TrendLineDrawing'
import type { Drawing } from '../drawings/Drawing'
import { DrawingType } from '../DrawingType'

import { DrawingManager } from '../managers/DrawingManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

export class TrendLineActionProvider implements DrawingActionProvider<TrendLineDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is TrendLineDrawing {
        return drawing.type === DrawingType.TrendLine
    }

    public getActions(drawing: TrendLineDrawing): DrawingAction[] {
        return [
            {
                id: 'color',
                label: 'Color',
                value: drawing.color,
                execute: (color) => {
                    drawing.color = color
                    this.renderInvalidator.invalidate()
                },
            },
            {
                id: 'line-width',
                label: 'Line Width',
                value: drawing.width,
                execute: (width) => {
                    drawing.width = width
                    this.renderInvalidator.invalidate()
                },
            },
            {
                id: 'delete',
                label: 'Delete',
                execute: () => {
                    this.drawingManager.removeDrawing(drawing.id)
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
