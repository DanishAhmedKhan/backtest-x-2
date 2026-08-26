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

    public render(id: string, result: IndicatorResult, visible: boolean, style?: Record<string, unknown>) {
        if (result.lines.length > 0) {
            const line = result.lines[0]

            this.lineRenderer.create(id)

            this.lineRenderer.setData(id, line)

            function isLineWidth(value: unknown): value is 1 | 2 | 3 | 4 {
                return value === 1 || value === 2 || value === 3 || value === 4
            }

            this.lineRenderer.setOptions(id, {
                color: typeof style?.color === 'string' ? style.color : undefined,
                lineWidth: isLineWidth(style?.lineWidth) ? style.lineWidth : undefined,
            })

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
