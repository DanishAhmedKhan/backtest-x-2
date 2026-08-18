import type { IndicatorType } from './Indicator'
import type { IndicatorSource } from './indicatorSource'

export type IndicatorDefinition = {
    type: IndicatorType
    name: string
    description: string
    display: 'overlay' | 'pane'

    defaultConfig: {
        period: number
        source?: IndicatorSource
    }
}

class IndicatorRegistry {
    private readonly definitions = new Map<IndicatorType, IndicatorDefinition>()

    constructor() {
        this.registerDefaults()
    }

    public get(type: IndicatorType): IndicatorDefinition | undefined {
        return this.definitions.get(type)
    }

    public getAll(): IndicatorDefinition[] {
        return [...this.definitions.values()]
    }

    public has(type: IndicatorType): boolean {
        return this.definitions.has(type)
    }

    public register(definition: IndicatorDefinition) {
        if (this.definitions.has(definition.type)) {
            throw new Error(`Indicator already registered: ${definition.type}`)
        }

        this.definitions.set(definition.type, definition)
    }

    private registerDefaults() {
        this.register({
            type: 'sma',
            name: 'Simple Moving Average',
            description: 'Calculates the simple moving average of price.',
            display: 'overlay',
            defaultConfig: {
                period: 20,
                source: 'close',
            },
        })

        this.register({
            type: 'ema',
            name: 'Exponential Moving Average',
            description: 'Calculates the exponential moving average of price.',
            display: 'overlay',
            defaultConfig: {
                period: 20,
                source: 'close',
            },
        })

        this.register({
            type: 'atr',
            name: 'Average True Range',
            description: 'Measures market volatility using true range.',
            display: 'pane',
            defaultConfig: {
                period: 14,
            },
        })

        this.register({
            type: 'rsi',
            name: 'Relative Strength Index',
            description: 'Measures the speed and magnitude of price movements.',
            display: 'pane',
            defaultConfig: {
                period: 14,
                source: 'close',
            },
        })
    }
}

export const indicatorRegistry = new IndicatorRegistry()
