import { indicatorStore } from '../indicators/core/IndicatorStore'

export default function IndicatorList() {
    return (
        <div className="chart-indicator-list">
            {indicatorStore.getAll().map((indicator) => {
                return (
                    <div className="chart-indicator-item" key={indicator.id}>
                        <div className="name">{indicator.type}</div>
                        <div className="action">
                            <div className="hide"></div>
                            <div className="setting"></div>
                            <div className="delete"></div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
