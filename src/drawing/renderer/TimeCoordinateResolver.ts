import type { IChartApi, Time } from 'lightweight-charts'

export class TimeCoordinateResolver {
    private readonly logicalIndexMap = new Map<number, number>()

    constructor(private readonly chart: IChartApi, private readonly timesRef: React.MutableRefObject<number[]>) {}

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
                return this.chart.timeScale().timeToCoordinate(time as Time)
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

        const leftX = this.chart.timeScale().timeToCoordinate(leftTime as Time)
        const rightX = this.chart.timeScale().timeToCoordinate(rightTime as Time)

        if (leftX == null || rightX == null) {
            return null
        }

        const ratio = (time - leftTime) / (rightTime - leftTime)

        return leftX + (rightX - leftX) * ratio
    }

    public coordinateToTime(x: number): number | null {
        const time = this.chart.timeScale().coordinateToTime(x)

        return typeof time === 'number' ? time : null
    }

    public rebuildLookup() {
        this.logicalIndexMap.clear()

        const times = this.timesRef.current

        for (let i = 0; i < times.length; i++) {
            this.logicalIndexMap.set(times[i], i)
        }
    }
}
