import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import { DrawingObject } from './DrawingObject'

export class HorizontalLineDrawing extends DrawingObject {
    public color = '#2962ff'
    public style = 'solid'
    public width = 2

    constructor(id: string, public anchor: DrawingAnchor) {
        super(id, DrawingType.HorizontalLine)
    }

    public clone() {
        const clone = new HorizontalLineDrawing(this.id, { ...this.anchor })

        clone.color = this.color
        clone.style = this.style
        clone.width = this.width

        return clone
    }
}
