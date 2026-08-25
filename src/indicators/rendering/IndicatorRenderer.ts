import type { IChartApi } from 'lightweight-charts'
import { LineRenderer } from './LineRenderer'
import type { IndicatorResult } from '../core/IndicatorResult'

export class IndicatorRenderer {
    private readonly lineRenderer: LineRenderer

    constructor(chart: IChartApi) {
        this.lineRenderer = new LineRenderer(chart)
    }

    public createLine(id: string, options?: Parameters<LineRenderer['create']>[1]) {
        return this.lineRenderer.create(id, options)
    }

    public render(id: string, result: IndicatorResult, visible: boolean) {
        if (result.lines.length > 0) {
            const line = result.lines[0]

            this.lineRenderer.create(id)

            this.lineRenderer.setData(id, line)

            this.lineRenderer.setVisible(id, visible)
        }
    }

    public remove(id: string) {
        this.lineRenderer.remove(id)
    }

    public clear() {
        this.lineRenderer.clear()
    }

    public dispose() {
        this.lineRenderer.dispose()
    }
}
