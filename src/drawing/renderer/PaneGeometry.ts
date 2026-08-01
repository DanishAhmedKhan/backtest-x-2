import type { PaneLayout } from './PaneLayout'

export class PaneGeometry {
    private paneCanvas: HTMLCanvasElement | null = null

    constructor(private readonly container: HTMLDivElement) {}

    public calculate(): PaneLayout | null {
        if (!this.paneCanvas || !this.paneCanvas.isConnected) {
            this.paneCanvas = this.container.querySelector(
                'table tr:first-child td:nth-child(2) canvas',
            ) as HTMLCanvasElement | null
        }

        if (!this.paneCanvas) {
            return null
        }

        return {
            left: this.paneCanvas.offsetLeft,
            top: this.paneCanvas.offsetTop,

            width: this.paneCanvas.clientWidth,
            height: this.paneCanvas.clientHeight,

            backingWidth: this.paneCanvas.width,
            backingHeight: this.paneCanvas.height,
        }
    }
}
