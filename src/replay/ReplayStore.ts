import type { Candle } from '../core/Candle'
import { CandleAggregator } from '../data/CandleAggregator'

export class ReplayStore {
    public static readonly MAX_DISPLAY_CANDLES = 20_000

    public enabled = false
    public showToolbar = false
    public isSelecting = false
    public isPlaying = false

    public startIndex: number | null = null
    public replayStartIndex: number | null = null
    public processedIndex: number | null = null
    public displayIndex: number | null = null
    public replayDisplayStartIndex: number | null = null

    public raw1mCandles: Candle[] = []
    public historicalCandles: Candle[] = []
    public historicalCandlesTimeframeSeconds: number | null = null

    public chartTimeframeSeconds = 60
    public updateIntervalSeconds = 60
    public pendingStepSeconds: number | null = null

    public previewTime: number | null = null

    public start(startIndex: number, raw1mCandles: Candle[], chartTimeframeSeconds: number) {
        this.enabled = true
        this.isSelecting = false
        this.showToolbar = false
        this.isPlaying = false

        this.raw1mCandles = raw1mCandles

        this.startIndex = startIndex

        this.replayStartIndex = this.calculateReplayStartIndex(chartTimeframeSeconds)

        if (chartTimeframeSeconds === 60) {
            this.historicalCandles = raw1mCandles.slice(0, this.replayStartIndex)
        } else {
            this.historicalCandles = CandleAggregator.aggregateReplay(
                raw1mCandles,
                0,
                this.replayStartIndex - 1,
                chartTimeframeSeconds,
            )
        }

        this.historicalCandlesTimeframeSeconds = chartTimeframeSeconds

        const lastVisibleTime = raw1mCandles[startIndex].time + chartTimeframeSeconds - 60

        let replayIndex = startIndex

        while (replayIndex < raw1mCandles.length - 1 && raw1mCandles[replayIndex + 1].time <= lastVisibleTime) {
            replayIndex++
        }

        this.processedIndex = replayIndex
        this.displayIndex = replayIndex
        this.replayDisplayStartIndex = null

        this.chartTimeframeSeconds = chartTimeframeSeconds
        this.updateIntervalSeconds = chartTimeframeSeconds

        this.previewTime = null

        this.pendingStepSeconds = null
    }

    public stop() {
        this.enabled = false
        this.showToolbar = false
        this.isSelecting = false
        this.isPlaying = false

        this.startIndex = null
        this.replayStartIndex = null

        this.processedIndex = null
        this.displayIndex = null
        this.replayDisplayStartIndex = null

        this.raw1mCandles = []
        this.historicalCandles = []
        this.historicalCandlesTimeframeSeconds = null

        this.previewTime = null

        this.updateIntervalSeconds = 60
        this.chartTimeframeSeconds = 60
        this.pendingStepSeconds = null
    }

    public appendRaw1mCandles(candles: Candle[]) {
        this.raw1mCandles = [...this.raw1mCandles, ...candles]
    }

    public seek(index: number) {
        if (!this.raw1mCandles.length) return

        const clamped = Math.max(this.startIndex ?? 0, Math.min(index, this.raw1mCandles.length - 1))

        this.processedIndex = clamped
        this.displayIndex = clamped
    }

    public setChartTimeframeSeconds(seconds: number) {
        this.chartTimeframeSeconds = seconds

        if (this.startIndex === null || !this.raw1mCandles.length) return

        this.replayStartIndex = this.calculateReplayStartIndex(seconds)

        this.historicalCandles = []
        this.historicalCandlesTimeframeSeconds = null
    }

    private calculateReplayStartIndex(chartTimeframeSeconds: number): number {
        if (this.startIndex === null) return

        const startCandle = this.raw1mCandles[this.startIndex]

        if (!startCandle) {
            return this.startIndex
        }

        const replayBucket = Math.floor(startCandle.time / chartTimeframeSeconds) * chartTimeframeSeconds
        let replayStartIndex = this.startIndex

        while (replayStartIndex > 0 && this.raw1mCandles[replayStartIndex - 1].time >= replayBucket) {
            replayStartIndex--
        }

        return replayStartIndex
    }

    public limitDisplayCandles(historicalCandles: Candle[], replayCandles: Candle[]): Candle[] {
        const max = ReplayStore.MAX_DISPLAY_CANDLES

        const total = historicalCandles.length + replayCandles.length

        if (total <= max) {
            return [...historicalCandles, ...replayCandles]
        }

        if (replayCandles.length >= max) {
            return replayCandles.slice(-max)
        }

        const historicalNeeded = max - replayCandles.length

        return [...historicalCandles.slice(-historicalNeeded), ...replayCandles]
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

    public get visibleRawCandles(): Candle[] {
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
