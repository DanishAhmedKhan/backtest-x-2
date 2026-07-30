import type { IChartApi, Logical } from 'lightweight-charts'

export class LogicalTimeCoordinateResolver {
    constructor(private readonly chart: IChartApi, private readonly timesRef: React.RefObject<number[]>) {}

    public toLogical(time: number): number | null {
        const times = this.timesRef.current

        if (times.length === 0) {
            return null
        }

        const index = this.findFloorIndex(times, time)

        if (index === -1) {
            return null
        }

        if (index === times.length - 1) {
            return index
        }

        const left = times[index]
        const right = times[index + 1]

        const fraction = (time - left) / (right - left)

        return index + fraction
    }

    public logicalToCoordinate(logical: number): number | null {
        return this.chart.timeScale().logicalToCoordinate(logical as Logical)
    }

    private findFloorIndex(times: number[], target: number): number {
        let low = 0
        let high = times.length - 1

        while (low <= high) {
            const mid = (low + high) >> 1

            if (times[mid] === target) {
                return mid
            }

            if (times[mid] < target) {
                low = mid + 1
            } else {
                high = mid - 1
            }
        }

        return high
    }
}
