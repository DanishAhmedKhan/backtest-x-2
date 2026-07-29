import { Toolbar } from './Toolbar'
import type { ToolbarGroupItem } from './types'

export function ToolbarGroup({ items }: ToolbarGroupItem) {
    return (
        <div className="toolbar-group">
            <Toolbar items={items} />
        </div>
    )
}
