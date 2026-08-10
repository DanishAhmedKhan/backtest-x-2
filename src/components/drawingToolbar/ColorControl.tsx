import { Popup } from '../common/Popup'
import { usePopupController } from '../../hooks/usePopupController'

import { ColorPalette } from '../common/ColorPicker'

import type { ToolbarItem } from '../../drawing/toolbar/ToolbarItem'
import type { PopupController } from '../../drawing/PopupController'

type Props = {
    item: ToolbarItem
    popupController: PopupController
}

export function ColorControl({ item, popupController }: Props) {
    const { open, togglePopup, closePopup } = usePopupController(popupController, item.id)
    const color = item.value as string

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
                    width: 32,
                    height: 32,
                    border: '1px solid #444',
                    borderRadius: 6,
                    background: '#222',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                <div
                    style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: color,
                        border: '1px solid #777',
                    }}
                />
            </button>

            <Popup open={open} onClose={closePopup}>
                <ColorPalette
                    selected={color}
                    onSelect={(newColor) => {
                        item.onChange?.(newColor)
                        closePopup()
                    }}
                />
            </Popup>
        </div>
    )
}
