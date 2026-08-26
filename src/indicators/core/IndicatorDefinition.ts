import type { IndicatorType } from './Indicator'
import type { IndicatorSettingDefinition } from './IndicatorSettings'

export type IndicatorDisplay = 'overlay' | 'pane'

export type IndicatorDefinition = {
    type: IndicatorType
    name: string
    description: string
    display: 'overlay' | 'pane'
    settings: IndicatorSettingDefinition[]
    createName: (settings: Record<string, unknown>) => string
}
