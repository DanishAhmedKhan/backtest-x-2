import { ToolbarProvider } from './ToolbarProvider'
import { ToolbarItems } from './ToolbarItems'
import type { ToolbarDirection, ToolbarItem } from './types'

import './toolbar.css'

type Props = {
    items: ToolbarItem[]
    direction?: ToolbarDirection
}

export function Toolbar({ items, direction = 'horizontal' }: Props) {
    return (
        <ToolbarProvider direction={direction}>
            <div className={`toolbar toolbar-${direction}`}>
                <ToolbarItems items={items} />
            </div>
        </ToolbarProvider>
    )
}
