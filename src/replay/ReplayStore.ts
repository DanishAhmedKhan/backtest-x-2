class ReplayStore {
    public enabled = false

    public showToolbar = false

    public previewTime: number | null = null
    public startTime: number | null = null
    public marketTime: number | null = null

    public isSelecting = true
    public isPlaying = false

    public chartTimeframeSeconds = 60
    public updateIntervalSeconds = 60

    public pendingStepSeconds: number | null = null

    public start(selectedTime: number, chartTimeframeSeconds: number) {
        this.enabled = true
        this.startTime = selectedTime
        this.chartTimeframeSeconds = chartTimeframeSeconds
        this.updateIntervalSeconds = chartTimeframeSeconds
        this.marketTime = selectedTime + chartTimeframeSeconds - 60
        this.isSelecting = false
        this.previewTime = null
        this.showToolbar = false
        this.isPlaying = false
    }

    public setPlaying(value: boolean) {
        this.isPlaying = value
    }

    public step() {
        if (this.marketTime === null) {
            return
        }

        if (this.pendingStepSeconds !== null) {
            this.marketTime += this.pendingStepSeconds
            this.pendingStepSeconds = null
            return
        }

        this.marketTime += this.updateIntervalSeconds
    }

    public rewind() {
        if (this.marketTime === null) {
            return
        }

        this.marketTime -= this.updateIntervalSeconds
    }

    public stop() {
        this.enabled = false
        this.startTime = null
        this.marketTime = null
        this.previewTime = null
        this.updateIntervalSeconds = 60
        this.isSelecting = true
        this.isPlaying = false
        this.pendingStepSeconds = null
    }

    public openToolbar() {
        this.showToolbar = true
        this.isSelecting = true
    }

    public closeToolbar() {
        this.showToolbar = false
        this.previewTime = null
    }

    public setChartTimeframeSeconds(seconds: number) {
        this.chartTimeframeSeconds = seconds
    }

    public setUpdateIntervalSeconds(seconds: number) {
        if (this.marketTime !== null && this.updateIntervalSeconds !== seconds) {
            const bucketEnd = Math.floor(this.marketTime / seconds) * seconds + seconds - 60

            const remaining = bucketEnd - this.marketTime

            if (remaining > 0) {
                this.pendingStepSeconds = remaining
            } else {
                this.pendingStepSeconds = null
            }
        }

        this.updateIntervalSeconds = seconds
    }
}

export const replayStore = new ReplayStore()
