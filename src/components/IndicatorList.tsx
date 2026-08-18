import { indicatorRegistry } from '../indicators/core/IndicatorRegistry'
import { Popup } from './common/Popup'

type Props = {
    open: boolean
    onClose: () => void
}

export default function IndicatorList({ open, onClose }: Props) {
    return (
        <Popup
            open={open}
            width={400}
            title="Indicator"
            onClose={onClose}
            content={
                <div className="indicator-list">
                    {indicatorRegistry.getAll().map((indicator) => {
                        return (
                            <div className="indicator-item" key={indicator.type}>
                                {indicator.name}
                            </div>
                        )
                    })}
                </div>
            }
        />
    )
}
