import type { DrawingAction } from './DrawingAction'
import type { DrawingActionFactory } from './DrawinActionFactory'

type StrokeDrawing = {
    color: string
    style: string
    width: number
}

export class StrokeActions {
    public static color(drawing: StrokeDrawing, factory: DrawingActionFactory): DrawingAction {
        return factory.create('color', 'Border Color', drawing.color, (color) => {
            drawing.color = color
        })
    }

    public static width(drawing: StrokeDrawing, factory: DrawingActionFactory): DrawingAction {
        return factory.create('line-width', 'Line Width', drawing.width, (width) => {
            drawing.width = width
        })
    }

    public static style(drawing: StrokeDrawing, factory: DrawingActionFactory): DrawingAction {
        return factory.create('style', 'Style', drawing.style, (style) => {
            drawing.style = style
        })
    }

    public static getActions(drawing: StrokeDrawing, factory: DrawingActionFactory): DrawingAction[] {
        return [
            StrokeActions.color(drawing, factory),
            StrokeActions.width(drawing, factory),
            StrokeActions.style(drawing, factory),
        ]
    }
}
