import type { Drawing } from './Drawing'
import type { ChartPoint } from '../models/ChartPoint'

export class TrendLineDrawing implements Drawing {
    constructor(public readonly id: string, public start: ChartPoint, public end: ChartPoint) {}

    public destroy(): void {}
}
