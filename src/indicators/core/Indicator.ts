import type { IndicatorSource } from './indicatorSource'
import { indicatorRegistry } from './IndicatorRegistry'
import type { IndicatorSettingDefinition } from './IndicatorSettings'

export type IndicatorType = 'sma' | 'ema' | 'atr'

export type IndicatorConfig = {
    id: string
    type: IndicatorType
    period: number
    source?: IndicatorSource
    settings?: Record<string, unknown>
}

export class Indicator {
    public readonly id: string
    public readonly type: IndicatorType

    private period?: number
    private source?: IndicatorSource

    private settings: Record<string, unknown>

    private visible = true

    constructor(config: IndicatorConfig) {
        this.id = config.id
        this.type = config.type

        this.period = config.period
        this.source = config.source

        this.settings = {
            ...(config.settings ?? {}),
        }
    }

    public getConfig(): IndicatorConfig {
        return {
            id: this.id,
            type: this.type,
            period: this.period,
            source: this.source,
            settings: {
                ...this.settings,
            },
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

    public getDisplay(): 'overlay' | 'pane' {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            throw new Error(`Indicator definition "${this.type}" does not exist`)
        }

        return definition.display
    }
}
