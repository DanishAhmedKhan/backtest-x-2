class ReplayStore {
    public enabled = false

    public showToolbar = false

    public previewTime: number | null = null

    public startTime: number | null = null

    public isSelecting = true

    public isPlaying = false

    public replayIndex = -1

    public start(time: number) {
        this.enabled = true
        this.startTime = time
        this.isSelecting = false
        this.previewTime = null
        this.showToolbar = false
    }

    public stop() {
        this.enabled = false
        this.startTime = null
        this.previewTime = null
        this.replayIndex = -1
        this.isPlaying = false
        this.isSelecting = true
    }

    public pause() {
        this.isPlaying = false
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
