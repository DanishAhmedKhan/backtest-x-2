import { useEffect, useState } from 'react'

import { Toolbar } from './ui/Toolbar'
import { FloatingToolbar } from './ui/FloatingToolbar'
import { ToolbarItemType, type ToolbarItem } from '../drawing/toolbar/ToolbarItem'
import { ToolbarGroup } from './ui/ToolbarGroup'
import { ToolbarButton } from './ui/ToolbarButton'
import { ToolbarDropdown } from './ui/ToolbarDropdown'
import { ToolIcon } from './ui/ToolbarIcon'
import { ToolbarSeparator } from './ui/ToolbarSeparator'
import { ColorPicker } from './common/ColorPicker'

import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'

import svg from '../svg/svg'

type Props = {
    manager: DrawingToolbarManager
}

const WIDTHS = [1, 2, 3, 4]

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
    const [isVisible, setIsVisible] = useState(() => manager?.isVisible() ?? false)
    const [items, setItems] = useState<ToolbarItem[]>(() => manager?.getToolbarItems() ?? [])

    useEffect(() => {
        if (!manager) return

        return manager.subscribe(() => {
            const visible = manager.isVisible()

            setIsVisible(visible)

            if (visible) {
                const nextItems = manager.getToolbarItems()

                if (nextItems.length > 0) {
                    setItems(nextItems)
                }
            }
        })
    }, [manager])

    return (
        <FloatingToolbar
            className={isVisible ? 'floating-toolbar-visible' : 'floating-toolbar-hidden'}
            storageKey="drawing-properties-toolbar"
        >
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
                                                    <ToolIcon
                                                        className="drawing-color-icon"
                                                        width={16}
                                                        height={16}
                                                        svg={svg.pencil}
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
                                                    item.onChange?.(newColor)
                                                }}
                                            />
                                        )}
                                    />
                                )
                            }

                            case ToolbarItemType.Background: {
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
                                                    <ToolIcon
                                                        className="drawing-color-icon"
                                                        width={16}
                                                        height={16}
                                                        svg={svg.fill}
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
                                                        <ToolIcon
                                                            svg={svg.line[`line${width}`]}
                                                            width={18}
                                                            height={width}
                                                        />

                                                        <span className="drawing-width-label">{width}px</span>
                                                    </button>
                                                </div>
                                            )
                                        }}
                                        dropdown={({ select, close }) => (
                                            <div className="drawing-width-dropdown">
                                                {WIDTHS.map((width) => {
                                                    const isSelected = Number(item.value) === width

                                                    return (
                                                        <button
                                                            key={width}
                                                            type="button"
                                                            className={`drawing-width-option ${
                                                                isSelected ? 'selected' : ''
                                                            }`}
                                                            onClick={() => {
                                                                select({
                                                                    id: String(width),
                                                                    label: `${width}px`,
                                                                })

                                                                item.onChange?.(width)
                                                                close()
                                                            }}
                                                        >
                                                            <span className="drawing-width-option-icon">
                                                                <ToolIcon
                                                                    width={18}
                                                                    height={width}
                                                                    svg={svg.line[`line${width}`]}
                                                                />
                                                            </span>

                                                            <span className="drawing-width-option-label">
                                                                {width}px
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    />
                                )

                            case ToolbarItemType.Style:
                                return (
                                    <ToolbarDropdown
                                        key={item.id}
                                        selectedId={String(item.value)}
                                        options={[
                                            {
                                                id: 'solid',
                                                label: 'Line',
                                            },
                                            {
                                                id: 'dashed',
                                                label: 'Dashed line',
                                            },
                                            {
                                                id: 'dotted',
                                                label: 'Dotted line',
                                            },
                                        ]}
                                        tooltip={item.tooltip}
                                        renderTrigger={({ open, toggleDropdown }) => {
                                            const style = String(item.value)

                                            const icon =
                                                style === 'dashed'
                                                    ? svg.style.dashed
                                                    : style === 'dotted'
                                                    ? svg.style.dotted
                                                    : svg.style.solid

                                            return (
                                                <button
                                                    type="button"
                                                    className={`toolbar-trigger ${open ? 'active' : ''}`}
                                                    title={item.tooltip}
                                                    onClick={toggleDropdown}
                                                >
                                                    <ToolIcon svg={icon} />
                                                </button>
                                            )
                                        }}
                                        dropdown={({ close }) => {
                                            const style = String(item.value)

                                            return (
                                                <div className="line-style-dropdown">
                                                    <button
                                                        type="button"
                                                        className={`line-style-option ${
                                                            style === 'solid' ? 'selected' : ''
                                                        }`}
                                                        onClick={() => {
                                                            item.onChange?.('solid')
                                                            close()
                                                        }}
                                                    >
                                                        <ToolIcon className="line-style-icon" svg={svg.style.solid} />

                                                        <span>Line</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={`line-style-option ${
                                                            style === 'dashed' ? 'selected' : ''
                                                        }`}
                                                        onClick={() => {
                                                            item.onChange?.('dashed')
                                                            close()
                                                        }}
                                                    >
                                                        <ToolIcon className="line-style-icon" svg={svg.style.dashed} />

                                                        <span>Dashed line</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className={`line-style-option ${
                                                            style === 'dotted' ? 'selected' : ''
                                                        }`}
                                                        onClick={() => {
                                                            item.onChange?.('dotted')
                                                            close()
                                                        }}
                                                    >
                                                        <ToolIcon className="line-style-icon" svg={svg.style.dotted} />

                                                        <span>Dotted line</span>
                                                    </button>
                                                </div>
                                            )
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
