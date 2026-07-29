import { ToolbarItems } from './ToolbarItems'
import type { ToolbarGroupItem } from './types'

export function ToolbarGroup({ items }: ToolbarGroupItem) {
    return (
        <div className="toolbar-group">
            <ToolbarItems items={items} />
        </div>
    )
}
