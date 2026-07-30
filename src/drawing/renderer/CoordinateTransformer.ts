import type { ISeriesApi } from 'lightweight-charts'

import type { DrawingAnchor } from '../models/DrawingAnchor'
import { TimeCoordinateResolver } from './TimeCoordinateResolver'

export type ScreenPoint = {
    x: number
    y: number
}

export class CoordinateTransformer {
    constructor(
        private readonly series: ISeriesApi<'Candlestick'>,
        private readonly timeResolver: TimeCoordinateResolver,
    ) {}

    public toPoint(anchor: DrawingAnchor): ScreenPoint | null {
        const x = this.timeResolver.logicalToCoordinate(anchor.logical)
        const y = this.series.priceToCoordinate(anchor.price)

        if (x == null || y == null) {
            return null
        }

        return {
            x,
            y,
        }
    }

    public toAnchor(x: number, y: number): DrawingAnchor | null {
        const anchor = this.timeResolver.coordinateToAnchor(x)

        if (!anchor) {
            return null
        }

        const price = this.series.coordinateToPrice(y)

        if (price == null) {
            return null
        }

        return {
            ...anchor,
            price,
        }
    }
}
