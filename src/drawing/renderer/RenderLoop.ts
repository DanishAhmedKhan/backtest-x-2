import type { RenderInvalidator } from './RenderInvalidator'
import { ChartSnapshot, type ChartSnapshotState } from './ChartSnapshot'

export class RenderLoop implements RenderInvalidator {
    private animationFrameId: number | null = null

    private previousSnapshot: ChartSnapshotState | null = null

    constructor(private readonly snapshot: ChartSnapshot, private readonly render: () => void) {}

    public start() {
        if (this.animationFrameId !== null) {
            return
        }

        this.previousSnapshot = this.snapshot.capture()

        this.render()

        const loop = () => {
            const current = this.snapshot.capture()

            if (!this.previousSnapshot || !this.snapshot.equals(current, this.previousSnapshot)) {
                this.render()

                this.previousSnapshot = current
            }

            this.animationFrameId = requestAnimationFrame(loop)
        }

        this.animationFrameId = requestAnimationFrame(loop)
    }

    public stop() {
        if (this.animationFrameId === null) {
            return
        }

        cancelAnimationFrame(this.animationFrameId)

        this.animationFrameId = null
    }

    public invalidate() {
        this.previousSnapshot = null
    }
}
