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

        if (!candles.length) {
            return
        }

        const clamped = Math.max(replayStore.startIndex ?? 0, Math.min(index, candles.length - 1))

        replayStore.processedIndex = clamped
        replayStore.displayIndex = clamped
    }

    private move(direction: 1 | -1) {
        const candles = replayStore.raw1mCandles

        let index = replayStore.processedIndex

        if (index === null || !candles.length) {
            return
        }

        const required = replayStore.pendingStepSeconds ?? replayStore.updateIntervalSeconds

        replayStore.pendingStepSeconds = null

        let elapsed = 0

        if (direction === 1) {
            while (index < candles.length - 1) {
                elapsed += candles[index + 1].time - candles[index].time

                index++

                if (elapsed >= required) {
                    break
                }
            }
        } else {
            while (index > (replayStore.startIndex ?? 0)) {
                elapsed += candles[index].time - candles[index - 1].time

                index--

                if (elapsed >= required) {
                    break
                }
            }
        }

        replayStore.processedIndex = index

        replayStore.displayIndex = index

        eventBus.emit('replayPositionChanged')
    }
}

export const replayController = new ReplayController()
