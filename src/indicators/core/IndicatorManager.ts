import { LineSeries, type IChartApi, type ISeriesApi, type Time } from 'lightweight-charts'

import type { Candle } from '../../core/Candle'
import type { IndicatorSource } from './indicatorSource'
import { calculateSMA } from '../calculations/sma'

type SMAIndicator = {
    id: string
    type: 'sma'
    period: number
    source: IndicatorSource
    line: ISeriesApi<'Line'>
}

export class IndicatorManager {
    private readonly indicators = new Map<string, SMAIndicator>()

    constructor(private readonly chart: IChartApi) {}

    public addSMA(id: string, period: number, source: IndicatorSource = 'close') {
        if (this.indicators.has(id)) {
            return
        }

        const line = this.chart.addSeries(LineSeries, {
            lineWidth: 1,
        })

        this.indicators.set(id, {
            id,
            type: 'sma',
            period,
            source,
            line,
        })
    }

    public remove(id: string) {
        const indicator = this.indicators.get(id)

        if (!indicator) {
            return
        }

        this.chart.removeSeries(indicator.line)

        this.indicators.delete(id)
    }

    public update(candles: Candle[]) {
        for (const indicator of this.indicators.values()) {
            if (indicator.type === 'sma') {
                const values = calculateSMA(candles, {
                    period: indicator.period,
                    source: indicator.source,
                })

                indicator.line.setData(
                    values.map((value) => ({
                        time: value.time as Time,
                        value: value.value,
                    })),
                )
            }
        }
    }

    public clear() {
        for (const indicator of this.indicators.values()) {
            this.chart.removeSeries(indicator.line)
        }

        this.indicators.clear()
    }

    public dispose() {
        this.clear()
    }
}
