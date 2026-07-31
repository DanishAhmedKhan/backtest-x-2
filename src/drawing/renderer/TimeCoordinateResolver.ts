import type { IChartApi, Logical } from 'lightweight-charts'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class TimeCoordinateResolver {
    constructor(private readonly chart: IChartApi, private readonly timesRef: React.RefObject<number[]>) {}

    public coordinateToAnchor(x: number): DrawingAnchor | null {
        const logical = this.chart.timeScale().coordinateToLogical(x)

        if (logical == null) {
            return null
        }

        const roundedLogical = Math.round(logical)

        const times = this.timesRef.current

        if (roundedLogical < 0 || roundedLogical >= times.length) {
            return null
        }

        return {
            logical,
            time: times[roundedLogical],
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

        const left = Math.floor(logical)
        const right = Math.ceil(logical)

        if (left < 0 || right >= times.length) {
            return null
        }

        if (left === right) {
            return times[left]
        }

        const fraction = logical - left

        return times[left] + (times[right] - times[left]) * fraction
    }

    public logicalToCoordinate(logical: number): number | null {
        return this.chart.timeScale().logicalToCoordinate(logical as Logical)
    }
}
