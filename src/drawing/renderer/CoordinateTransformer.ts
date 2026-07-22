import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts'

export type ScreenPoint = {
    x: number
    y: number
}

export type DomainPoint = {
    time: number
    price: number
}

export class CoordinateTransformer {
    constructor(private readonly chart: IChartApi, private readonly series: ISeriesApi<'Candlestick'>) {}

    public toPoint(time: number, price: number): ScreenPoint | null {
        const x = this.chart.timeScale().timeToCoordinate(time as Time)
        const y = this.series.priceToCoordinate(price)

        if (x == null || y == null) {
            return null
        }

        return {
            x,
            y,
        }
    }

    public toTime(x: number): number | null {
        const time = this.chart.timeScale().coordinateToTime(x)

        if (typeof time !== 'number') {
            return null
        }

        return time
    }

    public toPrice(y: number): number | null {
        const price = this.series.coordinateToPrice(y)

        if (price == null) {
            return null
        }

        return price
    }

    public toDomain(x: number, y: number): DomainPoint | null {
        const time = this.toTime(x)
        const price = this.toPrice(y)

        if (time == null || price == null) {
            return null
        }

        return {
            time,
            price,
        }
    }
}
