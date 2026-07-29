import { ToolbarGroup } from './ToolbarGroup'
import type { ToolbarButtonItem, ToolbarGroupItem } from './types'

type Props = {
    selectedId: string
    groups: ToolbarButtonItem[][]
    onSelect: (id: string) => void
}

export default function LayoutPicker({ selectedId, groups, onSelect }: Props) {
    return (
        <div className="layout-picker">
            {groups.map((buttons, index) => {
                if (buttons.length === 0) {
                    return null
                }

                const group: ToolbarGroupItem = {
                    type: 'group',
                    id: `layout-group-${index}`,
                    items: buttons.map((button) => ({
                        ...button,
                        active: button.id === selectedId,
                        onClick: () => onSelect(button.id),
                    })),
                }

                return (
                    <div key={group.id} className="layout-picker-row">
                        <div className="layout-picker-number">{index + 1}</div>

                        <ToolbarGroup {...group} />
                    </div>
                )
            })}
        </div>
    )
}
