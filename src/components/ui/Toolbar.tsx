import type { ToolbarItem } from './types'
import { ToolbarGroup } from './ToolbarGroup'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarDropdown } from './ToolbarDropdown'
import { ToolbarFill } from './ToolbarFill'
import { ToolbarSeparator } from './ToolbarSeparator'

import './toolbar.css'

interface Props {
    items: ToolbarItem[]
}

export function Toolbar({ items }: Props) {
    return (
        <div
            className="toolbar"
            style={{
                display: 'flex',
                backgroundColor: 'white',
                height: '38px',
            }}
        >
            {items.map((item) => {
                switch (item.type) {
                    case 'button':
                        return <ToolbarButton key={item.id} {...item} />

                    case 'dropdown':
                        return <ToolbarDropdown key={item.id} {...item} />

                    case 'group':
                        return <ToolbarGroup key={item.id} {...item} />

                    case 'separator':
                        return <ToolbarSeparator key={item.id} />

                    case 'fill':
                        return <ToolbarFill key={item.id} />
                }
            })}
        </div>
    )
}
