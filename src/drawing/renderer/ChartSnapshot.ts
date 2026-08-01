import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import type { PaneGeometry } from './PaneGeometry'

export interface ChartSnapshotState {
    paneWidth: number
    paneHeight: number

    logicalFrom: number | null
    logicalTo: number | null

    priceFrom: number | null
    priceTo: number | null
}

export class ChartSnapshot {
    constructor(
        private readonly chart: IChartApi,
        private readonly series: ISeriesApi<'Candlestick'>,
        private readonly paneGeometry: PaneGeometry,
    ) {}

    public capture(): ChartSnapshotState {
        const logicalRange = this.chart.timeScale().getVisibleLogicalRange()

        const priceRange = this.series.priceScale().getVisibleRange()

        const pane = this.paneGeometry.calculate()

        return {
            paneWidth: pane.width,
            paneHeight: pane.height,

            logicalFrom: logicalRange?.from ?? null,
            logicalTo: logicalRange?.to ?? null,

            priceFrom: priceRange?.from ?? null,
            priceTo: priceRange?.to ?? null,
        }
    }

    public equals(a: ChartSnapshotState, b: ChartSnapshotState) {
        return (
            a.paneWidth === b.paneWidth &&
            a.paneHeight === b.paneHeight &&
            a.logicalFrom === b.logicalFrom &&
            a.logicalTo === b.logicalTo &&
            a.priceFrom === b.priceFrom &&
            a.priceTo === b.priceTo
        )
    }
}
