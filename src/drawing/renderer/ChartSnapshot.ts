import type { IChartApi, ISeriesApi } from 'lightweight-charts'
import type { PaneLayoutCalculator } from './PaneLayoutCalculator'

export interface ChartSnapshotState {
    paneWidth: number
    paneHeight: number

    priceScaleWidth: number
    timeScaleHeight: number

    logicalFrom: number | null
    logicalTo: number | null

    priceFrom: number | null
    priceTo: number | null
}

export class ChartSnapshot {
    constructor(
        private readonly chart: IChartApi,
        private readonly series: ISeriesApi<'Candlestick'>,
        private readonly paneLayoutCalculator: PaneLayoutCalculator,
    ) {}

    public capture(): ChartSnapshotState {
        const logicalRange = this.chart.timeScale().getVisibleLogicalRange()

        const priceRange = this.series.priceScale().getVisibleRange()

        const pane = this.paneLayoutCalculator.calculate()

        return {
            paneWidth: pane.width,
            paneHeight: pane.height,

            priceScaleWidth: pane.priceScaleWidth,
            timeScaleHeight: pane.timeScaleHeight,

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
            a.priceScaleWidth === b.priceScaleWidth &&
            a.timeScaleHeight === b.timeScaleHeight &&
            a.logicalFrom === b.logicalFrom &&
            a.logicalTo === b.logicalTo &&
            a.priceFrom === b.priceFrom &&
            a.priceTo === b.priceTo
        )
    }
}
