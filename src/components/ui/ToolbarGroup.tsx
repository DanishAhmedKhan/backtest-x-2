import { ToolbarItems } from './ToolbarItems'
import type { ToolbarGroupItem } from './types'

export function ToolbarGroup({ items, direction = 'horizontal' }: ToolbarGroupItem) {
    return (
        <div className={`toolbar-group toolbar-group-${direction}`}>
            <ToolbarItems items={items} />
        </div>
    )
}
