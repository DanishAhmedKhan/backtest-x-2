class ReplayStore {
    public enabled = false

    public startTime: number | null = null

    public currentCrosshairTime: number | null = null

    public start(time: number) {
        this.enabled = true
        this.startTime = time
    }

    public stop() {
        this.enabled = false
        this.startTime = null
    }

    public setCrosshairTime(time: number | null) {
        this.currentCrosshairTime = time
    }
}

export const replayStore = new ReplayStore()
