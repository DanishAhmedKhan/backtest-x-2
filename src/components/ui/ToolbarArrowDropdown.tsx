import svg from '../../svg/svg'
import { ToolbarDropdown } from './ToolbarDropdown'
import type { ToolbarArrowDropdownItem } from './types'

export function ToolbarArrowDropdown(props: ToolbarArrowDropdownItem) {
    return (
        <ToolbarDropdown
            {...props}
            renderTrigger={({ open, toggleDropdown }) => (
                <div
                    className={`toolbar-trigger toolbar-arrow-trigger ${open ? 'active' : ''}`}
                    onClick={toggleDropdown}
                >
                    <div
                        className="toolbar-arrow"
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
