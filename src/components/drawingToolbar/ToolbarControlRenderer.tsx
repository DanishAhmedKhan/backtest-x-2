import type { PopupController } from '../../drawing/PopupController'
import { ToolbarItemType, type ToolbarItem } from '../../drawing/toolbar/ToolbarItem'
import { ButtonControl } from './ButtonControl'
import { ColorControl } from './ColorControl'
import { SeparatorControl } from './SeparatorControl'
import { WidthControl } from './WidthControl'

type Props = {
    item: ToolbarItem
    popupController: PopupController
}

export function ToolbarControlRenderer({ item, popupController }: Props) {
    switch (item.type) {
        case ToolbarItemType.Button:
            return <ButtonControl item={item} />

        case ToolbarItemType.Color:
            return <ColorControl item={item} popupController={popupController} />

        case ToolbarItemType.Width:
            return <WidthControl item={item} popupController={popupController} />

        case ToolbarItemType.Separator:
            return <SeparatorControl />

        default:
            return null
    }
}
