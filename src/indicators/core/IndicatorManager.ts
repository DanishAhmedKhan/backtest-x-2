import { LineSeries, type IChartApi, type ISeriesApi, type Time } from 'lightweight-charts'

import type { Candle } from '../../core/Candle'
import type { IndicatorConfig } from './Indicator'
import { calculateIndicator } from './indicatorCalculator'

type IndicatorInstance = {
    config: IndicatorConfig
    line: ISeriesApi<'Line'>
}

export class IndicatorManager {
    private readonly indicators = new Map<string, IndicatorInstance>()

    constructor(private readonly chart: IChartApi) {}

    public sync(configs: IndicatorConfig[]) {
        const incomingIds = new Set<string>()

        for (const config of configs) {
            incomingIds.add(config.id)

            const existing = this.indicators.get(config.id)

            if (!existing) {
                this.create(config)
                continue
            }

            if (!this.isSameConfig(existing.config, config)) {
                this.updateConfig(config.id, config)
            }
        }

        for (const id of this.indicators.keys()) {
            if (!incomingIds.has(id)) {
                this.remove(id)
            }
        }
    }

    public update(candles: Candle[]) {
        for (const indicator of this.indicators.values()) {
            this.updateIndicator(indicator, candles)
        }
    }

    public remove(id: string) {
        const indicator = this.indicators.get(id)

        if (!indicator) {
            return
        }

        this.chart.removeSeries(indicator.line)

        this.indicators.delete(id)
    }

    public clear() {
        for (const id of [...this.indicators.keys()]) {
            this.remove(id)
        }
    }

    public dispose() {
        this.clear()
    }

    private create(config: IndicatorConfig) {
        const line = this.chart.addSeries(LineSeries, {
            lineWidth: 1,
        })

        const instance: IndicatorInstance = {
            config: { ...config },
            line,
        }

        this.indicators.set(config.id, instance)
    }

    private updateConfig(id: string, config: IndicatorConfig) {
        const existing = this.indicators.get(id)

        if (!existing) {
            this.create(config)
            return
        }

        existing.config = { ...config }
    }

    private updateIndicator(instance: IndicatorInstance, candles: Candle[]) {
        const values = calculateIndicator(candles, instance.config)

        instance.line.setData(
            values.map((value) => ({
                time: value.time as Time,
                value: value.value as number,
            })),
        )
    }

    private isSameConfig(a: IndicatorConfig, b: IndicatorConfig): boolean {
        return a.id === b.id && a.type === b.type && a.period === b.period && a.source === b.source
    }
}
