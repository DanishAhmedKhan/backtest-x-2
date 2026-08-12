import { DrawingObject } from './DrawingObject'
import { DrawingType } from './DrawingType'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class RectangleDrawing extends DrawingObject {
    public color = '#2962FF'
    public style = 'solid'
    public width = 1
    public backgropund = '#2962FF66'

    constructor(id: string, public start: DrawingAnchor, public end: DrawingAnchor) {
        super(id, DrawingType.Rectangle)
    }

    public clone() {
        const clone = new RectangleDrawing(this.id, { ...this.start }, { ...this.end })

        clone.color = this.color
        clone.style = this.style
        clone.width = this.width
        clone.backgropund = this.backgropund

        return clone
    }
}
