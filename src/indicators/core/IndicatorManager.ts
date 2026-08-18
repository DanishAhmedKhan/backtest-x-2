import type { Candle } from '../../core/Candle'
import type { Indicator } from './Indicator'
import { calculateIndicator } from './indicatorCalculator'
import type { IndicatorRenderer } from '../rendering/IndicatorRenderer'

export class IndicatorManager {
    private readonly indicators = new Map<string, Indicator>()

    constructor(private readonly renderer: IndicatorRenderer) {}

    public sync(indicators: Indicator[]) {
        const incomingIds = new Set<string>()

        for (const indicator of indicators) {
            incomingIds.add(indicator.id)

            const existing = this.indicators.get(indicator.id)

            if (!existing) {
                this.create(indicator)
                continue
            }

            this.renderer.setVisible(indicator.id, indicator.isVisible())
        }

        for (const id of this.indicators.keys()) {
            if (!incomingIds.has(id)) {
                this.remove(id)
            }
        }
    }

    public update(candles: Candle[]) {
        for (const indicator of this.indicators.values()) {
            const config = indicator.getConfig()

            const values = calculateIndicator(candles, config)

            this.renderer.setData(indicator.id, values)

            this.renderer.setVisible(indicator.id, indicator.isVisible())
        }
    }

    public remove(id: string) {
        const indicator = this.indicators.get(id)

        if (!indicator) {
            return
        }

        this.renderer.remove(id)

        this.indicators.delete(id)
    }

    public clear() {
        this.indicators.clear()
        this.renderer.clear()
    }

    public dispose() {
        this.clear()
    }

    private create(indicator: Indicator) {
        this.renderer.createLine(indicator.id, {
            lineWidth: 1,
        })

        this.indicators.set(indicator.id, indicator)

        this.renderer.setVisible(indicator.id, indicator.isVisible())
    }
}
