import type { IndicatorDefinition, IndicatorDisplay } from './IndicatorDefinition'
import type { IndicatorSettingDefinition } from './IndicatorSettings'
import { indicatorRegistry } from './IndicatorRegistry'

export type IndicatorType = 'sma' | 'ema' | 'atr'

export type IndicatorConfig = {
    id: string
    chartId: string
    type: IndicatorType
    settings?: Record<string, unknown>
    visible?: boolean
}

export class Indicator {
    public readonly id: string
    public readonly chartId: string
    public readonly type: IndicatorType

    private settings: Record<string, unknown>

    private visible = true

    constructor(config: IndicatorConfig) {
        this.id = config.id
        this.chartId = config.chartId
        this.type = config.type

        this.settings = {
            ...indicatorRegistry.createDefaultSettings(this.type),
            ...(config.settings ?? {}),
        }

        this.visible = config.visible ?? true
    }

    public getConfig(): IndicatorConfig {
        return {
            id: this.id,
            chartId: this.chartId,
            type: this.type,
            settings: {
                ...this.settings,
            },
            visible: this.visible,
        }
    }

    public getDefinition(): IndicatorDefinition {
        const definition = indicatorRegistry.get(this.type)

        if (!definition) {
            throw new Error(`Indicator definition "${this.type}" does not exist`)
        }

        return definition
    }

    public update(changes: Partial<Omit<IndicatorConfig, 'id' | 'chartId' | 'type'>>) {
        if (changes.settings !== undefined) {
            this.settings = {
                ...this.settings,
                ...changes.settings,
            }
        }
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
        return this.getDefinition().settings
    }

    public getStyleSettings(): Record<string, unknown> {
        const definition = this.getDefinition()

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
        return this.getDefinition().createName(this.settings)
    }

    public getDisplay(): IndicatorDisplay {
        return this.getDefinition().display
    }
}
