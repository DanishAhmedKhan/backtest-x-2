import { Popup } from '../common/Popup'
import { usePopupController } from '../../hooks/usePopupController'

import type { ToolbarItem } from '../../drawing/toolbar/ToolbarItem'
import type { PopupController } from '../../drawing/PopupController'

type Props = {
    item: ToolbarItem
    popupController: PopupController
}

const WIDTHS = [1, 2, 3, 4, 5]

export function WidthControl({ item, popupController }: Props) {
    const { open, togglePopup, closePopup } = usePopupController(popupController, item.id)

    return (
        <div
            style={{
                position: 'relative',
            }}
        >
            <button
                title={item.tooltip}
                onClick={togglePopup}
                style={{
                    width: 36,
                    height: 32,
                    border: 'none',
                    borderRadius: 6,
                    background: '#2a2a2a',
                    color: '#ddd',
                    cursor: 'pointer',
                }}
            >
                ━
            </button>

            <Popup open={open} onClose={closePopup}>
                {WIDTHS.map((width) => (
                    <button
                        key={width}
                        onClick={() => {
                            item.onChange?.(width)
                            closePopup()
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: 120,
                            padding: '6px 10px',
                            border: 'none',
                            background: item.value === width ? '#3b82f6' : 'transparent',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: width,
                                background: 'white',
                            }}
                        />
                        {width}px
                    </button>
                ))}
            </Popup>
        </div>
    )
}
