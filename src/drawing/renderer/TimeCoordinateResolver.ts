import type { IChartApi, Logical } from 'lightweight-charts'
import type { DrawingAnchor } from '../models/DrawingAnchor'

export class TimeCoordinateResolver {
    constructor(private readonly chart: IChartApi, private readonly timesRef: React.RefObject<number[]>) {}

    public timeToCoordinate(time: number): number | null {
        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        let left = 0
        let right = times.length - 1

        while (left <= right) {
            const mid = (left + right) >> 1

            if (times[mid] === time) {
                return this.chart.timeScale().logicalToCoordinate(mid as Logical)
            }

            if (times[mid] < time) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }

        if (right < 0 || left >= times.length) {
            return null
        }

        const leftTime = times[right]
        const rightTime = times[left]

        const leftLogical = right
        const rightLogical = left

        const fraction = (time - leftTime) / (rightTime - leftTime)

        const logical = leftLogical + (rightLogical - leftLogical) * fraction

        return this.chart.timeScale().logicalToCoordinate(logical as Logical)
    }

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

        if (right < 0 || left >= times.length) {
            return null
        }

        const leftTime = times[right]
        const rightTime = times[left]

        const fraction = (time - leftTime) / (rightTime - leftTime)

        console.log(
            'timeToLogical',
            time,
            'times length:',
            times.length,
            'first:',
            times[0],
            'last:',
            times[times.length - 1],
        )

        console.log({
            target: time,
            leftIndex: right,
            rightIndex: left,
            leftTime,
            rightTime,
            fraction,
            logical: right + (left - right) * fraction,
        })

        console.log('times length', times.length)

        return right + (left - right) * fraction
    }

    public coordinateToTime(x: number): number | null {
        const time = this.chart.timeScale().coordinateToTime(x)

        return typeof time === 'number' ? time : null
    }

    public logicalToCoordinate(logical: number): number | null {
        return this.chart.timeScale().logicalToCoordinate(logical as Logical)
    }
}
