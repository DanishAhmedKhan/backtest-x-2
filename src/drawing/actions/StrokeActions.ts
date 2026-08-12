import type { DrawingStateManager } from '../managers/DrawingStateManager'
import type { DrawingAction } from './DrawingAction'
import type { RenderInvalidator } from '../renderer/RenderInvalidator'

type StrokeDrawing = {
    color: string
    style: string
    width: number
}

export class StrokeActions {
    public static color(
        drawing: StrokeDrawing,
        drawingStateManager: DrawingStateManager,
        renderInvalidator: RenderInvalidator,
    ): DrawingAction {
        return {
            id: 'color',
            label: 'Border Color',
            value: drawing.color,
            execute: (color) => {
                drawing.color = color

                drawingStateManager.refresh()
                renderInvalidator.invalidate()
            },
        }
    }

    public static width(
        drawing: StrokeDrawing,
        drawingStateManager: DrawingStateManager,
        renderInvalidator: RenderInvalidator,
    ): DrawingAction {
        return {
            id: 'line-width',
            label: 'Line Width',
            value: drawing.width,
            execute: (width) => {
                drawing.width = width

                drawingStateManager.refresh()
                renderInvalidator.invalidate()
            },
        }
    }

    public static style(
        drawing: StrokeDrawing,
        drawingStateManager: DrawingStateManager,
        renderInvalidator: RenderInvalidator,
    ): DrawingAction {
        return {
            id: 'style',
            label: 'Style',
            value: drawing.style,
            execute: (style) => {
                drawing.style = style

                drawingStateManager.refresh()
                renderInvalidator.invalidate()
            },
        }
    }

    public static getActions(
        drawing: StrokeDrawing,
        drawingStateManager: DrawingStateManager,
        renderInvalidator: RenderInvalidator,
    ): DrawingAction[] {
        return [
            StrokeActions.color(drawing, drawingStateManager, renderInvalidator),
            StrokeActions.width(drawing, drawingStateManager, renderInvalidator),
            StrokeActions.style(drawing, drawingStateManager, renderInvalidator),
        ]
    }
}
