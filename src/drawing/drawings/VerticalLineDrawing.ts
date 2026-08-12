import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import { DrawingObject } from './DrawingObject'

export class VerticalLineDrawing extends DrawingObject {
    public color = '#2962ff'
    public style = 'solid'
    public width = 2

    constructor(id: string, public anchor: DrawingAnchor) {
        super(id, DrawingType.VerticalLine)
    }

    public clone() {
        const clone = new VerticalLineDrawing(this.id, { ...this.anchor })

        clone.color = this.color
        clone.style = this.style
        clone.width = this.width

        return clone
    }
}
