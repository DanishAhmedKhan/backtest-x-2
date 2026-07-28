export enum ToolbarItemType {
    Button = 'button',
    ColorPicker = 'color-picker',
    NumberInput = 'number-input',
    Toggle = 'toggle',
    Separator = 'separator',
}

export interface ToolbarItem {
    id: string
    type: ToolbarItemType
    label: string
    value?: unknown
    action: () => void
    onChange?: (value: unknown) => void
}
