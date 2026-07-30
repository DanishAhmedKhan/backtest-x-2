import type React from 'react'

export type ToolbarItem =
    | ToolbarGroupItem
    | ToolbarButtonItem
    | ToolbarDropdownItem
    | ToolbarSeparatorItem
    | ToolbarFillItem

export type ToolbarDirection = 'horizontal' | 'vertical'

export interface ToolbarGroupItem {
    type: 'group'
    id: string
    items: ToolbarItem[]
    direction?: ToolbarDirection
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
    options?: ToolbarDropdownOption[]
    renderValue?: (selected: ToolbarDropdownOption | undefined) => React.ReactNode
    width?: number | string
    searchable?: boolean
    tooltip?: string
    dropdown?: ToolbarDropdownContent
    onChange?: (option: ToolbarDropdownOption) => void
}

export interface ToolbarDropdownContext {
    selectedId: string
    close(): void
    select(option: ToolbarDropdownOption): void
}

export type ToolbarDropdownContent = (context: ToolbarDropdownContext) => React.ReactNode

export interface ToolbarPopover {
    content: React.ReactNode
    placement?: 'bottom-start' | 'bottom' | 'bottom-end'
    width?: number | string
}

export interface ToolbarSeparatorItem {
    type: 'separator'
    id: string
    direction?: ToolbarDirection
}

export interface ToolbarFillItem {
    type: 'fill'
    id: string
}
