import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import type { DrawingManager } from '../managers/DrawingManager'
import type { PreviewDrawingManager } from '../PreviewDrawingManager'
import { CoordinateTransformer } from './CoordinateTransformer'
import type { RendererManager } from './RendererManager'

export class DrawingCanvasRenderer {
    private readonly transformer: CoordinateTransformer

    private readonly ctx: CanvasRenderingContext2D

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly rendererManager: RendererManager,
        private readonly canvas: HTMLCanvasElement,
        chart: IChartApi,
        series: ISeriesApi<'Candlestick'>,
    ) {
        this.transformer = new CoordinateTransformer(chart, series)

        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('Unable to get 2D drawing context.')
        }

        this.ctx = ctx
    }

    public render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (const drawing of this.drawingManager.getDrawings()) {
            this.rendererManager.render(drawing, this.ctx, this.transformer)
        }

        const preview = this.previewDrawingManager.get()

        if (preview) {
            this.rendererManager.render(preview, this.ctx, this.transformer)
        }
    }
}
