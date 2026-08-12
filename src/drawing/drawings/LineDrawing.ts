import type { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import { DrawingObject } from './DrawingObject'

export abstract class LineDrawing extends DrawingObject {
    public color = '#2962ff'
    public style = 'sollid'
    public width = 2

    constructor(id: string, type: DrawingType, public start: DrawingAnchor, public end: DrawingAnchor) {
        super(id, type)
    }
}
