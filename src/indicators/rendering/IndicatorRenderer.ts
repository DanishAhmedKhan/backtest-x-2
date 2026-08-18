import { LineSeries, type IChartApi, type ISeriesApi, type LineSeriesOptions, type Time } from 'lightweight-charts'
import type { IndicatorValue } from '../core/indicatorSource'

export class IndicatorRenderer {
    private readonly series = new Map<string, ISeriesApi<'Line'>>()

    constructor(private readonly chart: IChartApi) {}

    public createLine(id: string, options?: Partial<LineSeriesOptions>): ISeriesApi<'Line'> {
        const existing = this.series.get(id)

        if (existing) {
            return existing
        }

        const series = this.chart.addSeries(LineSeries, {
            lineWidth: 2,
            priceLineVisible: false,
            crosshairMarkerVisible: false,
            ...options,
        })

        this.series.set(id, series)

        return series
    }

    public setData(id: string, values: IndicatorValue[]) {
        const series = this.series.get(id)

        if (!series) {
            throw new Error(`Indicator series "${id}" does not exist`)
        }

        series.setData(
            values.map((value) => ({
                time: value.time as Time,
                value: value.value,
            })),
        )
    }

    public setVisible(id: string, visible: boolean) {
        const series = this.series.get(id)

        if (!series) {
            return
        }

        series.applyOptions({
            visible,
        })
    }

    public remove(id: string) {
        const series = this.series.get(id)

        if (!series) {
            return
        }

        this.chart.removeSeries(series)
        this.series.delete(id)
    }

    public clear() {
        for (const series of this.series.values()) {
            this.chart.removeSeries(series)
        }

        this.series.clear()
    }

    public dispose() {
        this.clear()
    }
}
