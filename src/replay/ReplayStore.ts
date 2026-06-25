class ReplayStore {
    public enabled = false

    public showToolbar = false

    public previewTime: number | null = null
    public startTime: number | null = null
    public marketTime: number | null = null

    public isSelecting = true

    public stepSeconds = 60

    public start(selectedTime: number, sourceTimeframeSeconds: number) {
        this.enabled = true

        this.startTime = selectedTime

        this.stepSeconds = sourceTimeframeSeconds

        this.marketTime = selectedTime + sourceTimeframeSeconds - 60

        this.isSelecting = false
        this.previewTime = null
        this.showToolbar = false
    }

    public step() {
        if (this.marketTime === null) {
            return
        }

        this.marketTime += this.stepSeconds
    }

    public rewind() {
        if (this.marketTime === null) {
            return
        }

        this.marketTime -= this.stepSeconds
    }

    public stop() {
        this.enabled = false

        this.startTime = null
        this.marketTime = null

        this.previewTime = null

        this.stepSeconds = 60

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
