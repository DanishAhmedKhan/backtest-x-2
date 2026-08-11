import type { PopupController } from '../PopupController'

export enum ToolbarItemType {
    Button = 'button',
    Color = 'color',
    Width = 'width',
    Style = 'style',
    Toggle = 'toggle',
    Separator = 'separator',
}

export interface ToolbarItem {
    id: string
    type: ToolbarItemType
    tooltip?: string
    value?: unknown
    popupController: PopupController
    execute: () => void
    onChange?: (value: unknown) => void
}
