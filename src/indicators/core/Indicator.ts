import type { IndicatorSource } from './indicatorSource'
import { indicatorRegistry } from './IndicatorRegistry'
import type { IndicatorSettingDefinition } from './IndicatorSettings'

export type IndicatorType = 'sma' | 'ema' | 'atr'

export type IndicatorConfig = {
    id: string
    chartId: string
    type: IndicatorType
    period: number
    source?: IndicatorSource
    settings?: Record<string, unknown>
    visible?: boolean
}

export class Indicator {
    public readonly id: string
    public readonly chartId: string
    public readonly type: IndicatorType

    private period?: number
    private source?: IndicatorSource

    private settings: Record<string, unknown>

    private visible: boolean

    constructor(config: IndicatorConfig) {
        this.id = config.id
        this.chartId = config.chartId
        this.type = config.type

        this.period = config.period
        this.source = config.source

        const definition = indicatorRegistry.get(this.type)
        const defaultSettings: Record<string, unknown> = {}

        if (definition) {
            for (const setting of definition.settings) {
                if (setting.defaultValue !== undefined) {
                    defaultSettings[setting.key] = setting.defaultValue
                }
            }
        }

        this.settings = {
            ...defaultSettings,
            ...(config.settings ?? {}),
        }

        this.visible = config.visible ?? true
    }

    public getConfig(): IndicatorConfig {
        return {
            id: this.id,
            chartId: this.chartId,
            type: this.type,
            period: this.period,
            source: this.source,
            settings: {
                ...this.settings,
            },
            visible: this.visible,
        }
    }

    public update(changes: Partial<Omit<IndicatorConfig, 'id' | 'type'>>) {
        if (changes.period !== undefined) {
            this.period = changes.period
        }

        if (changes.source !== undefined) {
            this.source = changes.source
        }

        if (changes.settings !== undefined) {
            this.settings = {
                ...this.settings,
                ...changes.settings,
            }
        }
    }

    public getPeriod(): number | undefined {
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

    public getSetting<T = unknown>(key: string): T | undefined {
        return this.settings[key] as T | undefined
    }

    public setSetting(key: string, value: unknown) {
        this.settings[key] = value
    }

    public getSettings(): Record<string, unknown> {
        return {
            ...this.settings,
        }
    }

    public getSettingsDefinition(): IndicatorSettingDefinition[] {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            return []
        }

        return definition.settings
    }

    public getStyleSettings(): Record<string, unknown> {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            return {}
        }

        const style: Record<string, unknown> = {}

        for (const setting of definition.settings) {
            if (setting.group !== 'style') {
                continue
            }

            style[setting.key] = this.settings[setting.key] ?? setting.defaultValue
        }

        return style
    }

    public getName(): string {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            return this.type
        }

        return definition.createName(this.getConfig())
    }

    public getDisplay(): 'overlay' | 'pane' {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            throw new Error(`Indicator definition "${this.type}" does not exist`)
        }

        return definition.display
    }
}
