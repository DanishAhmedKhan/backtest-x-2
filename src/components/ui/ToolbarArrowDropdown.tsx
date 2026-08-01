import svg from '../../svg/svg'
import { ToolbarDropdown } from './ToolbarDropdown'
import type { ToolbarArrowDropdownItem } from './types'

export function ToolbarArrowDropdown(props: ToolbarArrowDropdownItem) {
    return (
        <ToolbarDropdown
            {...props}
            renderTrigger={({ open }) => (
                <button className={`toolbar-trigger toolbar-arrow-trigger`}>
                    <div
                        className={`toolbar-arrow ${open ? 'open' : ''}`}
                        style={{ width: 8, height: 4 }}
                        dangerouslySetInnerHTML={{
                            __html: svg.dropdown,
                        }}
                    />
                </button>
            )}
        />
    )
}
