import type { IChartApi, Logical } from 'lightweight-charts'
import type { Timeframe } from '../../core/Timeframe'
import type { PointerAnchor } from '../models/PointerAnchor'

export class TimeCoordinateResolver {
    private readonly timeframeSeconds: number

    constructor(
        private readonly chart: IChartApi,
        private readonly timesRef: React.RefObject<number[]>,
        timeframe: Timeframe,
    ) {
        this.timeframeSeconds = timeframe.toSeconds()
    }

    public coordinateToAnchor(x: number): PointerAnchor | null {
        const logical = this.chart.timeScale().coordinateToLogical(x)

        if (logical == null) {
            return null
        }

        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        const time = this.logicalToContinuousTime(logical)

        if (time == null) {
            return null
        }

        return {
            logical,
            time,
            price: 0,
        }
    }

    private logicalToContinuousTime(logical: number): number | null {
        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        if (logical <= 0) {
            return times[0] + logical * this.timeframeSeconds
        }

        const lastIndex = times.length - 1

        if (logical >= lastIndex) {
            return times[lastIndex] + (logical - lastIndex) * this.timeframeSeconds
        }

        const leftIndex = Math.floor(logical)
        const rightIndex = leftIndex + 1

        const leftTime = times[leftIndex]
        const rightTime = times[rightIndex]

        const fraction = logical - leftIndex

        return leftTime + (rightTime - leftTime) * fraction
    }

    public timeToContinuousLogical(time: number): number | null {
        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        if (time <= times[0]) {
            return (time - times[0]) / this.timeframeSeconds
        }

        const lastIndex = times.length - 1
        const lastTime = times[lastIndex]

        if (time >= lastTime) {
            return lastIndex + (time - lastTime) / this.timeframeSeconds
        }

        let left = 0
        let right = lastIndex

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

        const leftIndex = right
        const rightIndex = left

        const leftTime = times[leftIndex]
        const rightTime = times[rightIndex]

        const timeRange = rightTime - leftTime

        if (timeRange <= 0) {
            return leftIndex
        }

        const fraction = (time - leftTime) / timeRange

        return leftIndex + fraction
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

    public timeToCoordinate(time: number): number | null {
        const logical = this.timeToLogical(time)

        if (logical == null) {
            return null
        }

        return this.logicalToCoordinate(logical)
    }

    public logicalToTime(logical: number): number | null {
        return this.logicalToContinuousTime(logical)
    }

    public logicalToCoordinate(logical: number): number | null {
        return this.chart.timeScale().logicalToCoordinate(logical as Logical)
    }
}
