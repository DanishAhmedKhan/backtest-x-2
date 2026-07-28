import { useEffect, useState } from 'react'
import type { PopupController } from '../drawing/PopupController'

export function usePopupController(popupController: PopupController, popupId: string) {
    const [, forceUpdate] = useState({})

    useEffect(() => {
        return popupController.subscribe(() => {
            forceUpdate({})
        })
    }, [popupController])

    return {
        open: popupController.isOpen(popupId),

        openPopup: () => popupController.open(popupId),

        closePopup: () => popupController.close(),

        togglePopup: () => popupController.toggle(popupId),
    }
}
