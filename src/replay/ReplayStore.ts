class ReplayStore {
    public enabled = false

    public showToolbar = false

    public previewTime: number | null = null

    public startTime: number | null = null

    public currentReplayTime: number | null = null

    public isSelecting = true

    public stepSeconds = 60

    public start(time: number, stepSeconds: number) {
        this.enabled = true
        this.startTime = time
        this.currentReplayTime = time
        this.stepSeconds = stepSeconds

        this.isSelecting = false
        this.previewTime = null
        this.showToolbar = false
    }

    public step() {
        if (this.currentReplayTime === null) return

        this.currentReplayTime += this.stepSeconds
    }

    public rewind() {
        if (this.currentReplayTime === null) return

        this.currentReplayTime -= this.stepSeconds
    }

    public stop() {
        this.enabled = false
        this.startTime = null
        this.currentReplayTime = null
        this.previewTime = null
        this.isSelecting = true
    }

    public openToolbar() {
        this.showToolbar = true
        this.isSelecting = true
    }

    public closeToolbar() {
        this.showToolbar = false
        this.previewTime = null
    }
}

export const replayStore = new ReplayStore()
