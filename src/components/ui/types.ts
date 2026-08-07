import type React from 'react'

export type ToolbarItem =
    | ToolbarGroupItem
    | ToolbarButtonItem
    | ToolbarDropdownItem
    | ToolbarArrowDropdownItem
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

export interface ToolbarDropdownBaseProps {
    id: string
    selectedId: string
    options?: ToolbarDropdownOption[]
    renderTrigger?: (context: ToolbarDropdownRenderContext) => React.ReactNode
    triggerClassName?: string
    width?: number | string
    searchable?: boolean
    tooltip?: string
    dropdown?: ToolbarDropdownContent
    onChange?: (option: ToolbarDropdownOption) => void
}

export interface ToolbarDropdownItem extends ToolbarDropdownBaseProps {
    type: 'dropdown'
}

export interface ToolbarArrowDropdownItem extends ToolbarDropdownBaseProps {
    type: 'dropdown-arrow'
    options: ToolbarDropdownOption[]
}

export interface ToolbarDropdownRenderContext {
    selected?: ToolbarDropdownOption
    open: boolean
    openDropdown(): void
    closeDropdown(): void
    toggleDropdown(): void
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

export interface ToolbarToolButtonItem {
    type: 'arrow-button'
    id: string
    selectedId: string
    tools: ToolbarToolButtonOption[]
    tooltip?: string
    onToolChange?: (tool: ToolbarToolButtonOption) => void
    onClick?: (tool: ToolbarToolButtonOption) => void
}

export interface ToolbarToolButtonOption {
    id: string
    icon: React.ReactNode
    label: string
    shortcut?: string
    favorite?: boolean
}
