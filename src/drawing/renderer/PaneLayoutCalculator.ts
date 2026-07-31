import type { PaneLayout } from './PaneLayout'

export class PaneLayoutCalculator {
    constructor(private readonly container: HTMLDivElement) {}

    public calculate(): PaneLayout {
        const canvases = this.container.querySelectorAll('canvas')

        let priceScaleWidth = 0
        let timeScaleHeight = 0

        canvases.forEach((canvas) => {
            const rect = canvas.getBoundingClientRect()

            if (rect.height > rect.width && rect.width < 120) {
                priceScaleWidth = Math.max(priceScaleWidth, rect.width)
            }

            if (rect.width > rect.height && rect.height < 60) {
                timeScaleHeight = Math.max(timeScaleHeight, rect.height)
            }
        })

        return {
            width: this.container.clientWidth - priceScaleWidth,
            height: this.container.clientHeight - timeScaleHeight,

            priceScaleWidth,
            timeScaleHeight,
        }
    }
}
