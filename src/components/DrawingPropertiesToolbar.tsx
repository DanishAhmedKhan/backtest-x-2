import { useEffect, useState } from 'react'

import { Toolbar } from './ui/Toolbar'
import { FloatingToolbar } from './ui/FloatingToolbar'
import { ToolbarItemType } from '../drawing/toolbar/ToolbarItem'
import { ToolbarGroup } from './ui/ToolbarGroup'
import { ToolbarButton } from './ui/ToolbarButton'
import { ToolbarDropdown } from './ui/ToolbarDropdown'
import { ToolbarSeparator } from './ui/ToolbarSeparator'
import { ColorPicker } from './common/ColorPicker'

import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'

import svg from '../svg/svg'

type Props = {
    manager: DrawingToolbarManager
}

const WIDTHS = [1, 2, 3, 4, 5]

const BUTTON_ICONS: Record<string, string> = {
    delete: svg.delete,
    settings: svg.settings,
}

function getButtonIcon(id: string) {
    const icon = BUTTON_ICONS[id]

    if (!icon) return null

    return <div style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: icon }} />
}

export function DrawingPropertiesToolbar({ manager }: Props) {
    const [, forceUpdate] = useState(0)

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
        <FloatingToolbar storageKey="drawing-properties-toolbar">
            <Toolbar direction="horizontal">
                <ToolbarGroup>
                    {items.map((item) => {
                        switch (item.type) {
                            case ToolbarItemType.Button:
                                return (
                                    <ToolbarButton
                                        key={item.id}
                                        icon={getButtonIcon(item.id)}
                                        tooltip={item.tooltip}
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
                                                <div className="drawing-color-trigger">
                                                    <div
                                                        className="drawing-color-icon"
                                                        dangerouslySetInnerHTML={{
                                                            __html: svg.pencil,
                                                        }}
                                                    />

                                                    <div
                                                        className="drawing-color-indicator"
                                                        style={{
                                                            backgroundImage: `
                                                                    linear-gradient(${color}, ${color}),
                                                                    repeating-conic-gradient(
                                                                        #d0d0d0 0% 25%,
                                                                        #ffffff 0% 50%
                                                                    )
                                                                `,
                                                        }}
                                                    />
                                                </div>
                                            </button>
                                        )}
                                        dropdown={({ close }) => (
                                            <ColorPicker
                                                selected={color}
                                                onSelect={(newColor) => {
                                                    item.onChange?.(newColor)
                                                    close()
                                                }}
                                                onChange={(newColor) => {
                                                    console.log(newColor)
                                                    item.onChange?.(newColor)
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
                                        renderTrigger={({ selected, open, toggleDropdown }) => {
                                            const width = Number(selected?.id ?? item.value)

                                            return (
                                                <div className="drawing-width-trigger">
                                                    <button
                                                        type="button"
                                                        className={`toolbar-trigger ${open ? 'active' : ''}`}
                                                        title={item.tooltip}
                                                        onClick={toggleDropdown}
                                                    >
                                                        <div className="drawing-width-trigger-inner">
                                                            <div
                                                                className="drawing-width-line"
                                                                style={{
                                                                    height: width,
                                                                }}
                                                            />

                                                            <span className="drawing-width-label">{width}px</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            )
                                        }}
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
