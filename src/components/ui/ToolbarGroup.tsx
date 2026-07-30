import { useToolbar } from '../../ui/toolbar/useToolbar'
import { ToolbarItems } from './ToolbarItems'
import type { ToolbarGroupItem } from './types'

export function ToolbarGroup({ items }: ToolbarGroupItem) {
    const { direction } = useToolbar()

    return (
        <div className={`toolbar-group toolbar-group-${direction}`}>
            <ToolbarItems items={items} />
        </div>
    )
}
