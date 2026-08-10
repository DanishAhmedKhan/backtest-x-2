import { useEffect, useState } from 'react'

import { Toolbar } from '../ui/Toolbar'
import { FloatingToolbar } from '../ui/FloatingToolbar'
import { ToolbarItemType } from '../../drawing/toolbar/ToolbarItem'
import { ToolbarGroup } from '../ui/ToolbarGroup'
import { ToolbarButton } from '../ui/ToolbarButton'
import { ToolbarDropdown } from '../ui/ToolbarDropdown'
import { ToolbarSeparator } from '../ui/ToolbarSeparator'
import { ColorPicker } from '../common/ColorPicker'

import type { DrawingToolbarManager } from '../../drawing/toolbar/DrawingToolbarManager'

type Props = {
    manager: DrawingToolbarManager
}

const WIDTHS = [1, 2, 3, 4, 5]

function getButtonLabel(id: string) {
    switch (id) {
        case 'delete':
            return '🗑'

        case 'settings':
            return '⚙'

        default:
            return '•'
    }
}

export function DrawingPropertiesToolbar({ manager }: Props) {
    const [, forceUpdate] = useState(0)

    // const { position, onMouseDown } = useDraggable({
    //     x: window.innerWidth / 2 - 180,
    //     y: 120,
    // })

    useEffect(() => {
        return manager.subscribe(() => {
            forceUpdate((value) => value + 1)
        })
    }, [manager])

    if (!manager.isVisible()) {
        return null
    }

    const items = manager.getToolbarItems()

    return (
        <FloatingToolbar>
            <Toolbar direction="horizontal">
                <ToolbarGroup>
                    {items.map((item) => {
                        switch (item.type) {
                            case ToolbarItemType.Button:
                                return (
                                    <ToolbarButton
                                        key={item.id}
                                        tooltip={item.tooltip}
                                        label={getButtonLabel(item.id)}
                                        onClick={item.execute}
                                    />
                                )

                            case ToolbarItemType.Color: {
                                const color = item.value as string

                                return (
                                    <ToolbarDropdown
                                        key={item.id}
                                        selectedId={item.id}
                                        options={[]}
                                        tooltip={item.tooltip}
                                        renderTrigger={({ open, toggleDropdown }) => (
                                            <button
                                                type="button"
                                                className={`toolbar-trigger ${open ? 'active' : ''}`}
                                                title={item.tooltip}
                                                onClick={toggleDropdown}
                                            >
                                                <div
                                                    style={{
                                                        width: 18,
                                                        height: 18,
                                                        borderRadius: '50%',
                                                        background: color,
                                                        border: '1px solid #777',
                                                    }}
                                                />
                                            </button>
                                        )}
                                        dropdown={({ close }) => (
                                            <ColorPicker
                                                selected={color}
                                                onSelect={(newColor) => {
                                                    item.onChange?.(newColor)
                                                    close()
                                                }}
                                            />
                                        )}
                                    />
                                )
                            }

                            case ToolbarItemType.Width:
                                return (
                                    <ToolbarDropdown
                                        key={item.id}
                                        selectedId={String(item.value)}
                                        options={WIDTHS.map((width) => ({
                                            id: String(width),
                                            label: `${width}px`,
                                        }))}
                                        tooltip={item.tooltip}
                                        onChange={(option) => {
                                            item.onChange?.(Number(option.id))
                                        }}
                                    />
                                )

                            case ToolbarItemType.Separator:
                                return <ToolbarSeparator key={item.id} />

                            default:
                                return null
                        }
                    })}
                </ToolbarGroup>
            </Toolbar>
        </FloatingToolbar>
    )
}
