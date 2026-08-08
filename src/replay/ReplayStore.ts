import type { Candle } from '../core/Candle'

export class ReplayStore {
    public enabled = false

    public showToolbar = false

    public isSelecting = false
    public isPlaying = false

    public startIndex: number | null = null

    public replayStartIndex: number | null = null

    public processedIndex: number | null = null

    public displayIndex: number | null = null

    public raw1mCandles: Candle[] = []

    public chartTimeframeSeconds = 60

    public updateIntervalSeconds = 60

    public pendingStepSeconds: number | null = null

    public previewTime: number | null = null

    public start(startIndex: number, raw1mCandles: Candle[], chartTimeframeSeconds: number) {
        this.enabled = true

        this.raw1mCandles = raw1mCandles

        this.startIndex = startIndex

        const replayBucket = Math.floor(raw1mCandles[startIndex].time / chartTimeframeSeconds) * chartTimeframeSeconds

        let replayStartIndex = startIndex

        while (replayStartIndex > 0 && raw1mCandles[replayStartIndex - 1].time >= replayBucket) {
            replayStartIndex--
        }

        this.replayStartIndex = replayStartIndex

        const lastVisibleTime = raw1mCandles[startIndex].time + chartTimeframeSeconds - 60

        let replayIndex = startIndex

        while (replayIndex < raw1mCandles.length - 1 && raw1mCandles[replayIndex + 1].time <= lastVisibleTime) {
            replayIndex++
        }

        this.processedIndex = replayIndex
        this.displayIndex = replayIndex

        this.chartTimeframeSeconds = chartTimeframeSeconds
        this.updateIntervalSeconds = chartTimeframeSeconds

        this.isSelecting = false
        this.showToolbar = false
        this.previewTime = null
        this.isPlaying = false

        this.pendingStepSeconds = null
    }

    public stop() {
        this.enabled = false

        this.startIndex = null
        this.replayStartIndex = null

        this.processedIndex = null
        this.displayIndex = null

        this.raw1mCandles = []

        this.previewTime = null

        this.updateIntervalSeconds = 60

        this.chartTimeframeSeconds = 60

        this.pendingStepSeconds = null

        this.isSelecting = true
        this.isPlaying = false
    }

    public seek(index: number) {
        if (!this.raw1mCandles.length) {
            return
        }

        const clamped = Math.max(this.startIndex ?? 0, Math.min(index, this.raw1mCandles.length - 1))

        this.processedIndex = clamped
        this.displayIndex = clamped
    }

    public setChartTimeframeSeconds(seconds: number) {
        this.chartTimeframeSeconds = seconds
    }

    public setPlaying(value: boolean) {
        this.isPlaying = value
    }

    public openToolbar() {
        this.showToolbar = true
    }

    public closeToolbar() {
        this.showToolbar = false
        this.previewTime = null
    }

    public setUpdateIntervalSeconds(seconds: number) {
        this.updateIntervalSeconds = seconds
    }

    public get currentCandle(): Candle | null {
        if (this.displayIndex === null) {
            return null
        }

        return this.raw1mCandles[this.displayIndex] ?? null
    }

    public get marketTime(): number | null {
        return this.currentCandle?.time ?? null
    }

    public get replayCandles(): Candle[] {
        if (this.displayIndex === null) {
            return []
        }

        return this.raw1mCandles.slice(0, this.displayIndex + 1)
    }

    public get replayLength(): number {
        if (this.displayIndex === null) {
            return 0
        }

        return this.displayIndex + 1
    }

    public canMoveForward() {
        return this.displayIndex !== null && this.displayIndex < this.raw1mCandles.length - 1
    }

    public canMoveBackward() {
        return this.displayIndex !== null && this.displayIndex > (this.startIndex ?? 0)
    }
}

export const replayStore = new ReplayStore()
