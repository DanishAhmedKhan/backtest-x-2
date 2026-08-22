import { eventBus } from '../event/EventBus'
import { replayStore } from './ReplayStore'

export class ReplayController {
    public forward() {
        this.move(1)
    }

    public backward() {
        this.move(-1)
    }

    public seek(index: number) {
        const candles = replayStore.raw1mCandles
        if (!candles.length) return

        const clamped = Math.max(replayStore.startIndex ?? 0, Math.min(index, candles.length - 1))

        replayStore.processedIndex = clamped
        replayStore.displayIndex = clamped
    }

    private move(direction: 1 | -1) {
        const candles = replayStore.raw1mCandles

        let processedIndex = replayStore.processedIndex

        if (processedIndex === null || !candles.length) {
            return
        }

        if (direction === 1) {
            const bucketEnd = this.findBucketEnd(processedIndex)

            if (bucketEnd > processedIndex) {
                processedIndex = bucketEnd
            } else {
                const tfSeconds = replayStore.updateIntervalSeconds
                const stepCount = Math.max(1, tfSeconds / replayStore.chartTimeframeSeconds)

                for (let step = 0; step < stepCount; step++) {
                    processedIndex = this.findNextBucket(processedIndex)
                }
            }
        } else {
            const tfSeconds = replayStore.updateIntervalSeconds
            const stepCount = Math.max(1, tfSeconds / replayStore.chartTimeframeSeconds)

            for (let step = 0; step < stepCount; step++) {
                processedIndex = this.findPreviousBucket(processedIndex)
            }
        }

        replayStore.processedIndex = processedIndex
        replayStore.displayIndex = processedIndex

        eventBus.emit('replayPositionChanged')
    }

    private findBucketEnd(index: number): number {
        const candles = replayStore.raw1mCandles
        const tfSeconds = replayStore.chartTimeframeSeconds

        const bucket = Math.floor(candles[index].time / tfSeconds)

        let i = index

        while (i < candles.length - 1 && Math.floor(candles[i + 1].time / tfSeconds) === bucket) {
            i++
        }

        return i
    }

    private findNextBucket(index: number): number {
        const candles = replayStore.raw1mCandles
        const tfSeconds = replayStore.chartTimeframeSeconds

        const currentBucket = Math.floor(candles[index].time / tfSeconds)

        let i = index + 1

        while (i < candles.length && Math.floor(candles[i].time / tfSeconds) === currentBucket) {
            i++
        }

        if (i >= candles.length) {
            return candles.length - 1
        }

        const nextBucket = Math.floor(candles[i].time / tfSeconds)

        while (i < candles.length - 1 && Math.floor(candles[i + 1].time / tfSeconds) === nextBucket) {
            i++
        }

        return i
    }

    private findPreviousBucket(index: number): number {
        const candles = replayStore.raw1mCandles
        const tfSeconds = replayStore.chartTimeframeSeconds

        const currentBucket = Math.floor(candles[index].time / tfSeconds)

        let i = index - 1

        while (i >= 0 && Math.floor(candles[i].time / tfSeconds) === currentBucket) {
            i--
        }

        if (i < (replayStore.startIndex ?? 0)) {
            return replayStore.startIndex!
        }

        const previousBucket = Math.floor(candles[i].time / tfSeconds)

        while (i > (replayStore.startIndex ?? 0) && Math.floor(candles[i - 1].time / tfSeconds) === previousBucket) {
            i--
        }

        while (i < candles.length - 1 && Math.floor(candles[i + 1].time / tfSeconds) === previousBucket) {
            i++
        }

        return i
    }
}

export const replayController = new ReplayController()
