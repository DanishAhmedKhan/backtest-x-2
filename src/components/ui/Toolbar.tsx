import { ToolbarItems } from './ToolbarItems'
import type { ToolbarDirection, ToolbarItem } from './types'

import './toolbar.css'

type Props = {
    items: ToolbarItem[]
    direction?: ToolbarDirection
}

export function Toolbar({ items, direction = 'horizontal' }: Props) {
    return (
        <div className={`toolbar toolbar-${direction}`}>
            <ToolbarItems items={items} />
        </div>
    )
}
