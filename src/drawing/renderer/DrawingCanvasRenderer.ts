import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import type { DrawingManager } from '../managers/DrawingManager'
import type { PreviewDrawingManager } from '../PreviewDrawingManager'
import { CoordinateTransformer } from './CoordinateTransformer'
import type { RendererManager } from './RendererManager'

export class DrawingCanvasRenderer {
    private readonly transformer: CoordinateTransformer

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly rendererManager: RendererManager,
        private readonly canvas: HTMLCanvasElement,
        chart: IChartApi,
        series: ISeriesApi<'Candlestick'>,
    ) {
        this.transformer = new CoordinateTransformer(chart, series)
    }

    public render() {
        const ctx = this.canvas.getContext('2d')

        if (!ctx) {
            return
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (const drawing of this.drawingManager.getDrawings()) {
            this.rendererManager.render(drawing, ctx, this.transformer)
        }

        const preview = this.previewDrawingManager.get()

        if (preview) {
            this.rendererManager.render(preview, ctx, this.transformer)
        }
    }
}
