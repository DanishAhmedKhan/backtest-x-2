import type { IndicatorConfig, IndicatorType } from './Indicator'
import type { IndicatorSource } from './indicatorSource'
import type { IndicatorSettingDefinition } from './IndicatorSettings'

export type IndicatorDisplay = 'overlay' | 'pane'

export type IndicatorDefinition = {
    type: IndicatorType
    name: string
    description: string
    display: IndicatorDisplay

    defaultConfig: {
        period: number
        source?: IndicatorSource
    }

    settings: IndicatorSettingDefinition[]

    createName: (config: IndicatorConfig) => string
}
