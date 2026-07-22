import { useEffect, useState } from 'react'

import { toolStore } from '../drawing/ToolStore'
import { ToolType } from '../drawing/tools/ToolType'

export default function DrawingToolbar() {
    const [, forceUpdate] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate((v) => v + 1)
        }, 100)

        return () => clearInterval(interval)
    }, [])

    return (
        <div
            style={{
                padding: 10,
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
            }}
        >
            <button onClick={() => toolStore.select(ToolType.Pan)}>✋</button>

            <button onClick={() => toolStore.select(ToolType.TrendLine)}>╱</button>
        </div>
    )
}
