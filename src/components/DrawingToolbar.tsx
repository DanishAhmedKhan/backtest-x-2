// import { useEffect, useState } from 'react'

// import { toolStore } from '../drawing/ToolStore'
// import { ToolType } from '../drawing/tools/ToolType'

// export default function DrawingToolbar() {
//     const [, forceUpdate] = useState(0)

//     useEffect(() => {
//         const interval = setInterval(() => {
//             forceUpdate((v) => v + 1)
//         }, 100)

//         return () => clearInterval(interval)
//     }, [])

//     return (
//         <div
//             style={{
//                 padding: 10,
//                 backgroundColor: '#fff',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 6,
//             }}
//         >
//             <button onClick={() => toolStore.select(ToolType.Pan)}>✋</button>

//             <button onClick={() => toolStore.select(ToolType.TrendLine)}>╱</button>
//         </div>
//     )
// }

import { useEffect, useState } from 'react'

import { toolStore } from '../drawing/ToolStore'
import { ToolType } from '../drawing/tools/ToolType'

export default function DrawingToolbar() {
    const [selectedTool, setSelectedTool] = useState(toolStore.getSelectedTool())

    useEffect(() => {
        return toolStore.subscribe(setSelectedTool)
    }, [])

    return (
        <div
            style={{
                padding: 10,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
            }}
        >
            <button
                style={{
                    background: selectedTool === ToolType.Pan ? '#ddd' : undefined,
                }}
                onClick={() => toolStore.select(ToolType.Pan)}
            >
                ✋
            </button>

            <button
                style={{
                    background: selectedTool === ToolType.TrendLine ? '#ddd' : undefined,
                }}
                onClick={() => toolStore.select(ToolType.TrendLine)}
            >
                ╱
            </button>
        </div>
    )
}
