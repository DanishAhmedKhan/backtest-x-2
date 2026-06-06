// core/ReplayStore.ts

class ReplayStore {
    enabled = false
    startTime: number | null = null

    start(time: number) {
        this.enabled = true
        this.startTime = time
    }

    stop() {
        this.enabled = false
        this.startTime = null
    }
}

export const replayStore = new ReplayStore()
