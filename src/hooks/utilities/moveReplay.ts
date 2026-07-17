import { eventBus } from '../../event/EventBus'
import { replayStore } from '../../replay/ReplayStore'

export function moveReplay(direction: 1 | -1, finder: (times: number[], target: number) => number | null) {
    const current = replayStore.marketTime

    if (current === null) {
        return
    }

    let next: number | null

    if (replayStore.pendingStepSeconds !== null) {
        next = current + direction * replayStore.pendingStepSeconds
        replayStore.pendingStepSeconds = null
    } else {
        const desired = current + direction * replayStore.updateIntervalSeconds

        next = finder(raw1mTimesRef.current, desired)
    }

    if (next === null) {
        return
    }

    replayStore.marketTime = next

    eventBus.emit('replayTimeChanged', {
        time: next,
    })
}
