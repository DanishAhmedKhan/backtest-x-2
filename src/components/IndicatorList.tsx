import { useSyncExternalStore } from 'react'
import { indicatorStore } from '../indicators/core/IndicatorStore'
import svg from '../svg/svg'
import { ToolbarIcon } from './ui/ToolbarIcon'

export default function IndicatorList() {
    const indicators = useSyncExternalStore(
        indicatorStore.subscribe.bind(indicatorStore),
        () => indicatorStore.getAll(),
        () => indicatorStore.getAll(),
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
                                <ToolbarIcon width={18} height={18} svg={svg.eyeOpen} />
                            </div>
                            <div className="action-button">
                                <ToolbarIcon width={18} height={18} svg={svg.settings} />
                            </div>
                            <div className="action-button" onClick={() => indicatorStore.remove(indicator.id)}>
                                <ToolbarIcon width={18} height={18} svg={svg.delete18} />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
