import type { IChartApi, Logical } from 'lightweight-charts'
import type { DrawingAnchor } from '../models/DrawingAnchor'
import type { Timeframe } from '../../core/Timeframe'

export class TimeCoordinateResolver {
    private readonly timeframeSeconds: number

    constructor(
        private readonly chart: IChartApi,
        private readonly timesRef: React.RefObject<number[]>,
        timeframe: Timeframe,
    ) {
        this.timeframeSeconds = timeframe.toSeconds()
    }

    public coordinateToAnchor(x: number): DrawingAnchor | null {
        const logical = this.chart.timeScale().coordinateToLogical(x)

        if (logical == null) {
            return null
        }

        const rounded = Math.round(logical)

        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        if (rounded < 0) {
            const delta = rounded

            return {
                logical,
                time: times[0] + delta * this.timeframeSeconds,
                price: 0,
            }
        }

        if (rounded >= times.length) {
            const lastLogical = times.length - 1
            const delta = rounded - lastLogical

            return {
                logical,
                time: times[lastLogical] + delta * this.timeframeSeconds,
                price: 0,
            }
        }

        return {
            logical,
            time: times[rounded],
            price: 0,
        }
    }

    public timeToLogical(time: number): number | null {
        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        let left = 0
        let right = times.length - 1

        while (left <= right) {
            const mid = (left + right) >> 1

            if (times[mid] === time) {
                return mid
            }

            if (times[mid] < time) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }

        if (right < 0) {
            return null
        }

        return right
    }

    public logicalToTime(logical: number): number | null {
        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        const rounded = Math.round(logical)

        if (rounded < 0) {
            return times[0] + rounded * this.timeframeSeconds
        }

        if (rounded >= times.length) {
            const lastLogical = times.length - 1
            return times[lastLogical] + (rounded - lastLogical) * this.timeframeSeconds
        }

        return times[rounded]
    }

    public logicalToCoordinate(logical: number): number | null {
        return this.chart.timeScale().logicalToCoordinate(logical as Logical)
    }
}
