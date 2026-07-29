import { ToolbarItems } from './ToolbarItems'
import type { ToolbarItem } from './types'

import './toolbar.css'

type Props = {
    items: ToolbarItem[]
}

export function Toolbar({ items }: Props) {
    return (
        <div className="toolbar">
            <ToolbarItems items={items} />
        </div>
    )
}
