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
    execute: () => void
    onChange?: (value: unknown) => void
}
