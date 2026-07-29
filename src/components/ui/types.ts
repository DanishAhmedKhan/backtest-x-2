import type React from 'react'

export type ToolbarItem =
    | ToolbarGroupItem
    | ToolbarButtonItem
    | ToolbarDropdownItem
    | ToolbarSeparatorItem
    | ToolbarFillItem

export interface ToolbarGroupItem {
    type: 'group'
    id: string
    items: ToolbarItem[]
}

export interface ToolbarButtonItem {
    type: 'button'
    id: string
    icon?: React.ReactNode
    label?: string
    tooltip?: string
    active?: boolean
    onClick?: () => void
    popover?: ToolbarPopover
}

export interface ToolbarDropdownOption {
    id: string
    label: string
    subLabel?: string
    icon?: React.ReactNode
    disabled?: boolean
}

export interface ToolbarDropdownItem {
    type: 'dropdown'
    id: string
    selectedId: string
    options: ToolbarDropdownOption[]
    render?: (selected: ToolbarDropdownOption | undefined) => React.ReactNode
    width?: number | string
    searchable?: boolean
    tooltip?: string
    onChange?: (option: ToolbarDropdownOption) => void
}

export interface ToolbarPopover {
    content: React.ReactNode
    placement?: 'bottom-start' | 'bottom' | 'bottom-end'
    width?: number | string
}

export interface ToolbarSeparatorItem {
    type: 'separator'
    id: string
}

export interface ToolbarFillItem {
    type: 'fill'
    id: string
}
