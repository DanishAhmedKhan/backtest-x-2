import { useEffect, useState } from 'react'

import './DrawingPropertiesToolbar.css'
import type { DrawingToolbarManager } from '../../drawing/toolbar/DrawingToolbarManager'
import { ToolbarItemType } from '../../drawing/toolbar/ToolbarItem'

type Props = {
    manager: DrawingToolbarManager
}

export function DrawingPropertiesToolbar({ manager }: Props) {
    const [items, setItems] = useState(() => manager.getToolbarItems())

    useEffect(() => {
        return manager.subscribe(() => {
            setItems(manager.getToolbarItems())
        })
    }, [manager])

    if (!manager.isVisible()) {
        return null
    }

    return (
        <div
            className="drawing-toolbar"
            style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto',
            }}
        >
            {items.map((item) => {
                switch (item.type) {
                    case ToolbarItemType.Button:
                        return (
                            <button key={item.id} onClick={item.action}>
                                {item.label}
                            </button>
                        )

                    case ToolbarItemType.ColorPicker:
                        return (
                            <input
                                key={item.id}
                                type="color"
                                value={item.value as string}
                                onChange={(e) => item.onChange?.(e.target.value)}
                            />
                        )

                    case ToolbarItemType.NumberInput:
                        return (
                            <input
                                key={item.id}
                                type="number"
                                min={1}
                                max={10}
                                value={item.value as number}
                                onChange={(e) => item.onChange?.(Number(e.target.value))}
                            />
                        )

                    case ToolbarItemType.Separator:
                        return <div key={item.id} className="toolbar-separator" />
                }
            })}
        </div>
    )
}
