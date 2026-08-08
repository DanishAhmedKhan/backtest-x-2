import { ToolbarButton } from './ToolbarButton'
import { ToolbarGroup } from './ToolbarGroup'
import type { ToolbarButtonProps } from './types'

type LayoutButton = ToolbarButtonProps & {
    id: string
}

type Props = {
    selectedId: string
    groups: LayoutButton[][]
    onSelect: (id: string) => void
}

export default function LayoutPicker({ selectedId, groups, onSelect }: Props) {
    return (
        <div className="layout-picker">
            {groups.map((buttons, index) => {
                if (buttons.length === 0) {
                    return null
                }

                return (
                    <div key={`layout-group-${index}`} className="layout-picker-row">
                        <div className="layout-picker-number">{index + 1}</div>

                        <ToolbarGroup>
                            {buttons.map((button) => (
                                <ToolbarButton
                                    key={button.id}
                                    {...button}
                                    active={button.id === selectedId}
                                    onClick={() => onSelect(button.id)}
                                />
                            ))}
                        </ToolbarGroup>
                    </div>
                )
            })}
        </div>
    )
}
