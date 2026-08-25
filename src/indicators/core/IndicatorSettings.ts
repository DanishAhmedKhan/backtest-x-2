export type IndicatorSettingGroup = 'inputs' | 'style' | 'visibility'

export type IndicatorSettingType = 'number' | 'select' | 'color' | 'boolean' | 'text' | 'time'

export type IndicatorSettingOption = {
    value: string
    label: string
}

export type IndicatorSettingDefinition = {
    key: string
    label: string
    group: IndicatorSettingGroup
    type: IndicatorSettingType

    min?: number
    max?: number
    step?: number

    options?: IndicatorSettingOption[]

    defaultValue?: unknown
}
