import { useEffect, useState } from 'react'

import { useDraggable } from '../../hooks/useDraggable'

import './DrawingPropertiesToolbar.css'

import type { DrawingToolbarManager } from '../../drawing/toolbar/DrawingToolbarManager'
import { ToolbarControlRenderer } from './ToolbarControlRenderer'

type Props = {
    manager: DrawingToolbarManager
}

export function DrawingPropertiesToolbar({ manager }: Props) {
    const [items, setItems] = useState(() => manager.getToolbarItems())

    const { position, onMouseDown } = useDraggable({
        x: window.innerWidth / 2 - 180,
        y: 120,
    })

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
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                background: '#1b1b1b',
                border: '1px solid #333',
                borderRadius: 8,
                padding: '6px 8px',
                gap: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,.4)',
                userSelect: 'none',
            }}
        >
            <div
                onMouseDown={onMouseDown}
                style={{
                    cursor: 'move',
                    color: '#888',
                    padding: '0 6px',
                    fontSize: 18,
                }}
            >
                ⋮⋮
            </div>

            {items.map((item) => (
                <ToolbarControlRenderer key={item.id} item={item} popupController={manager.getPopupController()} />
            ))}
        </div>
    )
}
