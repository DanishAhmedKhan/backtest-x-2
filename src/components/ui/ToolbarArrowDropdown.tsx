import svg from '../../svg/svg'
import { ToolbarDropdown } from './ToolbarDropdown'
import type { ToolbarArrowDropdownItem } from './types'

export function ToolbarArrowDropdown(props: ToolbarArrowDropdownItem) {
    return (
        <ToolbarDropdown
            {...props}
            renderTrigger={({ open, openDropdown }) => (
                <div className="toolbar-trigger toolbar-arrow-trigger" onClick={openDropdown}>
                    <div
                        className={`toolbar-arrow ${open ? 'open' : ''}`}
                        style={{
                            width: 8,
                            height: 4,
                        }}
                        dangerouslySetInnerHTML={{
                            __html: svg.dropdown,
                        }}
                    />
                </div>
            )}
        />
    )
}
