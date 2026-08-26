import { useSyncExternalStore } from 'react'

import { Popup } from './common/Popup'

import type { Indicator } from '../indicators/core/Indicator'
import type { IndicatorSettingDefinition, IndicatorSettingOption } from '../indicators/core/IndicatorSettings'
import { indicatorStore } from '../indicators/core/IndicatorStore'
import { PopupTabs } from './common/PopupTabs'

type Props = {
    open: boolean
    onClose: () => void
    indicator: Indicator | null
}

export default function IndicatorSettings({ open, onClose, indicator }: Props) {
    const indicators = useSyncExternalStore(
        indicatorStore.subscribe.bind(indicatorStore),
        () => indicatorStore.getAll(),
        () => indicatorStore.getAll(),
    )

    const currentIndicator = indicator ? indicators.find((item) => item.id === indicator.id) ?? null : null

    if (!currentIndicator) {
        return null
    }

    return (
        <IndicatorSettingsContent
            key={currentIndicator.id}
            indicator={currentIndicator}
            open={open}
            onClose={onClose}
        />
    )
}

type ContentProps = {
    open: boolean
    onClose: () => void
    indicator: Indicator
}

function IndicatorSettingsContent({ open, onClose, indicator }: ContentProps) {
    const settings = indicator.getSettingsDefinition()

    return (
        <Popup
            open={open}
            width={400}
            title={indicator.getName()}
            onClose={onClose}
            content={
                <PopupTabs
                    tabs={[
                        {
                            id: 'inputs',
                            label: 'Inputs',
                            content: renderGroup('inputs', settings, indicator),
                        },
                        {
                            id: 'style',
                            label: 'Style',
                            content: renderGroup('style', settings, indicator),
                        },
                        {
                            id: 'visibility',
                            label: 'Visibility',
                            content: renderGroup('visibility', settings, indicator),
                        },
                    ]}
                />
            }
        />
    )
}

function renderGroup(
    group: 'inputs' | 'style' | 'visibility',
    settings: IndicatorSettingDefinition[],
    indicator: Indicator,
) {
    const groupSettings = settings.filter((setting) => setting.group === group)

    if (groupSettings.length === 0) {
        return null
    }

    return (
        <div className="indicator-group-content">
            {groupSettings.map((setting) => (
                <SettingControl key={setting.key} indicator={indicator} setting={setting} />
            ))}
        </div>
    )
}

function SettingControl({ indicator, setting }: { indicator: Indicator; setting: IndicatorSettingDefinition }) {
    const currentValue = getCurrentValue(indicator, setting)

    switch (setting.type) {
        case 'number':
            return (
                <label>
                    {setting.label}{' '}
                    <input
                        type="number"
                        value={Number(currentValue)}
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                        onChange={(event) => {
                            const value = Number(event.target.value)

                            indicatorStore.updateSetting(indicator.id, setting.key, value)
                        }}
                    />
                </label>
            )

        case 'select':
            return (
                <label>
                    {setting.label}{' '}
                    <select
                        value={String(currentValue ?? '')}
                        onChange={(event) => {
                            indicatorStore.updateSetting(indicator.id, setting.key, event.target.value)
                        }}
                    >
                        {setting.options?.map((option: IndicatorSettingOption) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            )

        case 'color':
            return (
                <label>
                    {setting.label}{' '}
                    <input
                        type="color"
                        value={String(currentValue ?? '#000000')}
                        onChange={(event) => {
                            indicatorStore.updateSetting(indicator.id, setting.key, event.target.value)
                        }}
                    />
                </label>
            )

        case 'boolean':
            return (
                <label>
                    <input
                        type="checkbox"
                        checked={Boolean(currentValue)}
                        onChange={(event) => {
                            indicatorStore.updateSetting(indicator.id, setting.key, event.target.checked)
                        }}
                    />{' '}
                    {setting.label}
                </label>
            )

        case 'text':
            return (
                <label>
                    {setting.label}{' '}
                    <input
                        type="text"
                        value={String(currentValue ?? '')}
                        onChange={(event) => {
                            indicatorStore.updateSetting(indicator.id, setting.key, event.target.value)
                        }}
                    />
                </label>
            )

        case 'time':
            return (
                <label>
                    {setting.label}{' '}
                    <input
                        type="time"
                        value={String(currentValue ?? '')}
                        onChange={(event) => {
                            indicatorStore.updateSetting(indicator.id, setting.key, event.target.value)
                        }}
                    />
                </label>
            )

        default:
            return null
    }
}

function getCurrentValue(indicator: Indicator, setting: IndicatorSettingDefinition) {
    if (setting.key === 'visible') {
        return indicator.isVisible()
    }

    return indicator.getSetting(setting.key) ?? setting.defaultValue ?? ''
}
