import type { IChartApi, ISeriesApi } from 'lightweight-charts'

export interface ChartSnapshotState {
    width: number
    height: number

    logicalFrom: number | null
    logicalTo: number | null

    priceFrom: number | null
    priceTo: number | null
}

export class ChartSnapshot {
    constructor(
        private readonly chart: IChartApi,
        private readonly series: ISeriesApi<'Candlestick'>,
        private readonly container: HTMLElement,
    ) {}

    public capture(): ChartSnapshotState {
        const logicalRange = this.chart.timeScale().getVisibleLogicalRange()

        const priceRange = this.series.priceScale().getVisibleRange()

        return {
            width: this.container.clientWidth,
            height: this.container.clientHeight,

            logicalFrom: logicalRange?.from ?? null,
            logicalTo: logicalRange?.to ?? null,

            priceFrom: priceRange?.from ?? null,
            priceTo: priceRange?.to ?? null,
        }
    }

    public equals(a: ChartSnapshotState, b: ChartSnapshotState) {
        return (
            a.width === b.width &&
            a.height === b.height &&
            a.logicalFrom === b.logicalFrom &&
            a.logicalTo === b.logicalTo &&
            a.priceFrom === b.priceFrom &&
            a.priceTo === b.priceTo
        )
    }
}
