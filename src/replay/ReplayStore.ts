class ReplayStore {
    public enabled = false

    public showToolbar = false

    public previewTime: number | null = null

    public startTime: number | null = null

    public isSelecting = true

    public currentReplayTime: number | null = null

    public start(time: number) {
        this.enabled = true
        this.startTime = time
        this.currentReplayTime = time
        this.isSelecting = false
        this.previewTime = null
        this.showToolbar = false
    }

    public stop() {
        this.enabled = false
        this.startTime = null
        this.currentReplayTime = null
        this.previewTime = null
        this.isSelecting = true
    }
    public step(seconds: number) {
        if (this.currentReplayTime === null) return

        this.currentReplayTime += seconds
    }

    public rewind(seconds: number) {
        if (this.currentReplayTime === null) return

        this.currentReplayTime -= seconds
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
