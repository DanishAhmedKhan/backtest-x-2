import type { IndicatorSource } from './indicatorSource'
import { indicatorRegistry } from './IndicatorRegistry'

export type IndicatorType = 'sma' | 'ema' | 'atr'

export type IndicatorConfig = {
    id: string
    type: IndicatorType
    period: number
    source?: IndicatorSource
}

export class Indicator {
    public readonly id: string
    public readonly type: IndicatorType

    private period: number
    private source?: IndicatorSource
    private visible = true

    constructor(config: IndicatorConfig) {
        this.id = config.id
        this.type = config.type
        this.period = config.period
        this.source = config.source
    }

    public getConfig(): IndicatorConfig {
        return {
            id: this.id,
            type: this.type,
            period: this.period,
            source: this.source,
        }
    }

    public update(changes: Partial<Omit<IndicatorConfig, 'id' | 'type'>>) {
        if (changes.period !== undefined) {
            this.period = changes.period
        }

        if (changes.source !== undefined) {
            this.source = changes.source
        }
    }

    public getPeriod(): number {
        return this.period
    }

    public getSource(): IndicatorSource | undefined {
        return this.source
    }

    public isVisible(): boolean {
        return this.visible
    }

    public setVisible(value: boolean) {
        this.visible = value
    }

    public getName(): string {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            return this.type
        }

        return definition.createName(this.getConfig())
    }
}
