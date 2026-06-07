class ReplayStore {
    public enabled = false

    public showToolbar = false

    public previewTime: number | null = null

    public startTime: number | null = null

    public start(time: number) {
        this.enabled = true
        this.startTime = time
    }

    public stop() {
        this.enabled = false
        this.startTime = null
        this.previewTime = null
    }

    public openToolbar() {
        this.showToolbar = true
    }

    public closeToolbar() {
        this.showToolbar = false
        this.previewTime = null
    }
}

export const replayStore = new ReplayStore()
