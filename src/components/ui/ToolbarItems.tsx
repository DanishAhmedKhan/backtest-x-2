import { ToolbarArrowDropdown } from './ToolbarArrowDropdown'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarDropdown } from './ToolbarDropdown'
import { ToolbarFill } from './ToolbarFill'
import { ToolbarGroup } from './ToolbarGroup'
import { ToolbarSeparator } from './ToolbarSeparator'
import type { ToolbarItem } from './types'

type Props = {
    items: ToolbarItem[]
}

export function ToolbarItems({ items }: Props) {
    return (
        <>
            {items.map((item) => {
                switch (item.type) {
                    case 'button':
                        return <ToolbarButton key={item.id} {...item} />

                    case 'dropdown':
                        return <ToolbarDropdown key={item.id} {...item} />
                    case 'dropdown-arrow':
                        return <ToolbarArrowDropdown key={item.id} {...item} />
                    case 'group':
                        return <ToolbarGroup key={item.id} {...item} />

                    case 'separator':
                        return <ToolbarSeparator key={item.id} />

                    case 'fill':
                        return <ToolbarFill key={item.id} />
                }
            })}
        </>
    )
}
