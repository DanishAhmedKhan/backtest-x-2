export class RenderScheduler {
    private scheduled = false

    constructor(private readonly render: () => void) {}

    public invalidate() {
        if (this.scheduled) {
            return
        }

        this.scheduled = true

        requestAnimationFrame(() => {
            this.scheduled = false

            this.render()
        })
    }
}
