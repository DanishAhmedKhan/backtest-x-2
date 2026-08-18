import { Popup } from './common/Popup'

import { indicatorRegistry, type IndicatorDefinition } from '../indicators/core/IndicatorRegistry'

type Props = {
    open: boolean
    onClose: () => void
    onIndicatorClick: (indicator: IndicatorDefinition) => void
}

export default function IndicatorSelector({ open, onClose, onIndicatorClick }: Props) {
    return (
        <Popup
            open={open}
            width={400}
            title="Indicator"
            onClose={onClose}
            content={
                <div className="indicator-selector-list">
                    {indicatorRegistry.getAll().map((indicator) => {
                        return (
                            <div
                                className="indicator-selector-item"
                                key={indicator.type}
                                onClick={() => {
                                    onIndicatorClick(indicator)
                                }}
                            >
                                {indicator.name}
                            </div>
                        )
                    })}
                </div>
            }
        />
    )
}
