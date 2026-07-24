export class RenderScheduler1 {
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
