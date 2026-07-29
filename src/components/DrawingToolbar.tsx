import { useEffect, useState } from 'react'

import { toolStore } from '../drawing/ToolStore'
import { ToolType } from '../drawing/tools/ToolType'
import { Toolbar } from './ui/Toolbar'
import svg from '../svg/svg'

export default function DrawingToolbar() {
    const [selectedTool, setSelectedTool] = useState(toolStore.getSelectedTool())

    useEffect(() => {
        return toolStore.subscribe(setSelectedTool)
    }, [])

    return (
        <Toolbar
            direction="vertical"
            items={[
                {
                    type: 'group',
                    id: 'symbol',
                    direction: 'vertical',
                    items: [
                        {
                            type: 'button',
                            id: 'pan',
                            icon: (
                                <div
                                    style={{ width: 28, height: 28 }}
                                    dangerouslySetInnerHTML={{ __html: svg.tool.pan }}
                                />
                            ),
                            active: selectedTool === ToolType.Pan,
                            onClick: () => {
                                toolStore.select(ToolType.Pan)
                            },
                        },
                        {
                            type: 'button',
                            id: 'trend-line',
                            icon: (
                                <div
                                    style={{ width: 28, height: 28 }}
                                    dangerouslySetInnerHTML={{ __html: svg.tool.trendLine }}
                                />
                            ),
                            active: selectedTool === ToolType.TrendLine,
                            onClick: () => {
                                toolStore.select(ToolType.TrendLine)
                            },
                        },
                    ],
                },
            ]}
        />
    )
}
