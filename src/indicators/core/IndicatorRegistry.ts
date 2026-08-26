import type { IndicatorType } from './Indicator'
import type { IndicatorDefinition } from './IndicatorDefinition'
import type { IndicatorSettingDefinition } from './IndicatorSettings'

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

    public getSettings(type: IndicatorType): IndicatorSettingDefinition[] {
        return this.definitions.get(type)?.settings ?? []
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
            settings: [
                {
                    key: 'period',
                    label: 'Length',
                    group: 'inputs',
                    type: 'number',
                    min: 1,
                    step: 1,
                },
                {
                    key: 'source',
                    label: 'Source',
                    group: 'inputs',
                    type: 'select',
                    options: [
                        { value: 'open', label: 'Open' },
                        { value: 'high', label: 'High' },
                        { value: 'low', label: 'Low' },
                        { value: 'close', label: 'Close' },
                        { value: 'hl2', label: 'HL2' },
                        { value: 'hlc3', label: 'HLC3' },
                        { value: 'ohlc4', label: 'OHLC4' },
                    ],
                },
                {
                    key: 'color',
                    label: 'Color',
                    group: 'style',
                    type: 'color',
                    defaultValue: '#2962FF',
                },
                {
                    key: 'lineWidth',
                    label: 'Line Width',
                    group: 'style',
                    type: 'number',
                    min: 1,
                    max: 5,
                    step: 1,
                    defaultValue: 1,
                },
                {
                    key: 'visible',
                    label: 'Visible',
                    group: 'visibility',
                    type: 'boolean',
                    defaultValue: true,
                },
            ],
            createName: (config) => {
                return `SMA ${config.period} ${config.source}`
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
            settings: [
                {
                    key: 'period',
                    label: 'Length',
                    group: 'inputs',
                    type: 'number',
                    min: 1,
                    step: 1,
                },
                {
                    key: 'source',
                    label: 'Source',
                    group: 'inputs',
                    type: 'select',
                    options: [
                        { value: 'open', label: 'Open' },
                        { value: 'high', label: 'High' },
                        { value: 'low', label: 'Low' },
                        { value: 'close', label: 'Close' },
                        { value: 'hl2', label: 'HL2' },
                        { value: 'hlc3', label: 'HLC3' },
                        { value: 'ohlc4', label: 'OHLC4' },
                    ],
                },
                {
                    key: 'visible',
                    label: 'Visible',
                    group: 'visibility',
                    type: 'boolean',
                    defaultValue: true,
                },
            ],
            createName: (config) => {
                return `EMA ${config.period} ${config.source}`
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
            settings: [
                {
                    key: 'period',
                    label: 'Length',
                    group: 'inputs',
                    type: 'number',
                    min: 1,
                    step: 1,
                },
                {
                    key: 'visible',
                    label: 'Visible',
                    group: 'visibility',
                    type: 'boolean',
                    defaultValue: true,
                },
            ],
            createName: (config) => {
                return `ATR ${config.period}`
            },
        })
    }
}

export const indicatorRegistry = new IndicatorRegistry()
