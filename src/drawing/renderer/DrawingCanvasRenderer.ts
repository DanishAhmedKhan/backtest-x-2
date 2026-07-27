import type { IChartApi, ISeriesApi } from 'lightweight-charts'

import type { DrawingManager } from '../managers/DrawingManager'
import { PreviewDrawingManager } from '../PreviewDrawingManager'
import { RendererManager } from './RendererManager'
import type { DrawingStateManager } from '../managers/DrawingStateManager'
import { CoordinateTransformer } from './CoordinateTransformer'

export class DrawingCanvasRenderer {
    private readonly ctx: CanvasRenderingContext2D

    private readonly transformer: CoordinateTransformer

    constructor(
        private readonly drawingManager: DrawingManager,
        private readonly previewDrawingManager: PreviewDrawingManager,
        private readonly rendererManager: RendererManager,
        private readonly drawingStateManager: DrawingStateManager,
        private readonly canvas: HTMLCanvasElement,
        chart: IChartApi,
        series: ISeriesApi<'Candlestick'>,
    ) {
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('Unable to get drawing context.')
        }

        this.ctx = ctx

        this.transformer = new CoordinateTransformer(chart, series)
    }

    public render() {
        const state = {
            hovered: this.drawingStateManager.getHovered(),
            selected: this.drawingStateManager.getSelected(),
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (const drawing of this.drawingManager.getDrawings()) {
            this.rendererManager.render(drawing, this.ctx, this.transformer, state)
        }

        const preview = this.previewDrawingManager.get()

        if (preview) {
            this.rendererManager.render(preview, this.ctx, this.transformer, state)
        }
    }
}
