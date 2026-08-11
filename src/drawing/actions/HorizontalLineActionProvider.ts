import type { Drawing } from '../drawings/Drawing'
import { HorizontalLineDrawing } from '../drawings/HorizontalLineDrawing'
import type { DrawingManager } from '../managers/DrawingManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'
import type { DrawingAction } from './DrawingAction'
import type { DrawingActionProvider } from './DrawingActionProvider'

export class HorizontalLineActionProvider implements DrawingActionProvider<HorizontalLineDrawing> {
    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly renderInvalidator: RenderInvalidator,
    ) {}

    public canProvideActions(drawing: Drawing): drawing is HorizontalLineDrawing {
        return drawing instanceof HorizontalLineDrawing
    }

    public getActions(drawing: HorizontalLineDrawing): DrawingAction[] {
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
                id: 'style',
                label: 'Style',
                value: drawing.style,
                execute: (style) => {
                    drawing.style = style

                    this.drawingStateManager.refresh()
                    this.renderInvalidator.invalidate()
                },
            },

            {
                id: 'settings',
                label: 'Settings',
                execute: () => {
                    console.log('Open Horizontal Line Settings')
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
        ]
    }
}
