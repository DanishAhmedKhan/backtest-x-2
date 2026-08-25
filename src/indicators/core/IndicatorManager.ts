import type { Candle } from '../../core/Candle'
import type { Indicator } from './Indicator'
import { calculateIndicator } from './indicatorCalculator'
import type { IndicatorRenderer } from '../rendering/IndicatorRenderer'
import type { IndicatorContext } from './IndicatorContext'
import type { Timeframe } from '../../core/Timeframe'

type IndicatorInstance = {
    indicator: Indicator
}

export class IndicatorManager {
    private readonly indicators = new Map<string, IndicatorInstance>()

    constructor(private readonly renderer: IndicatorRenderer, private readonly timeframe: Timeframe) {}

    public sync(indicators: Indicator[]) {
        const incomingIds = new Set<string>()

        for (const indicator of indicators) {
            incomingIds.add(indicator.id)

            const existing = this.indicators.get(indicator.id)

            if (!existing) {
                this.create(indicator)
                continue
            }

            existing.indicator = indicator
        }

        for (const id of this.indicators.keys()) {
            if (!incomingIds.has(id)) {
                this.remove(id)
            }
        }
    }

    public update(candles: Candle[]) {
        const context: IndicatorContext = {
            candles,
            timeframe: this.timeframe,
        }

        for (const instance of this.indicators.values()) {
            this.updateIndicator(instance, context)
        }
    }

    public remove(id: string) {
        const instance = this.indicators.get(id)

        if (!instance) {
            return
        }

        this.renderer.remove(id)

        this.indicators.delete(id)
    }

    public clear() {
        for (const id of [...this.indicators.keys()]) {
            this.remove(id)
        }
    }

    public dispose() {
        this.clear()
        this.renderer.dispose()
    }

    private create(indicator: Indicator) {
        this.indicators.set(indicator.id, {
            indicator,
        })
    }

    private updateIndicator(instance: IndicatorInstance, context: IndicatorContext) {
        const result = calculateIndicator(context, instance.indicator)

        this.renderer.render(instance.indicator.id, result, instance.indicator.isVisible())
    }
}
