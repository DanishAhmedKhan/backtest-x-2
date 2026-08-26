import { useSyncExternalStore } from 'react'

import { ToolbarIcon } from './ui/ToolbarIcon'

import type { Indicator } from '../indicators/core/Indicator'
import { indicatorStore } from '../indicators/core/IndicatorStore'

import svg from '../svg/svg'

type Props = {
    chartId: string
    onIndicatorSettings: (indicator: Indicator) => void
}

export default function IndicatorList({ chartId, onIndicatorSettings }: Props) {
    const indicators = useSyncExternalStore(
        indicatorStore.subscribe.bind(indicatorStore),
        () => indicatorStore.getAll(chartId),
        () => indicatorStore.getAll(chartId),
    )

    return (
        <div className="chart-indicator-list">
            {indicators.map((indicator) => {
                return (
                    <div className="chart-indicator-item" key={indicator.id}>
                        <div className="name">{indicator.getName()}</div>

                        <div className="action">
                            <div
                                className="action-button"
                                onClick={() => indicatorStore.toggleVisibility(indicator.id)}
                            >
                                <ToolbarIcon
                                    width={18}
                                    height={18}
                                    svg={indicator.isVisible() ? svg.small.eyeOpen : svg.small.eyeClose}
                                />
                            </div>

                            <div className="action-button" onClick={() => onIndicatorSettings(indicator)}>
                                <ToolbarIcon width={18} height={18} svg={svg.small.settings} />
                            </div>

                            <div className="action-button" onClick={() => indicatorStore.remove(indicator.id)}>
                                <ToolbarIcon width={18} height={18} svg={svg.small.delete} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
