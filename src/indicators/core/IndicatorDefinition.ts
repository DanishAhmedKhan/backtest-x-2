import type { IndicatorConfig, IndicatorType } from './Indicator'
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
    createName: (config: IndicatorConfig) => string
}
