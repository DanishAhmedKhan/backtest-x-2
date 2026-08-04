import { useEffect, useState } from 'react'

import { toolStore } from '../drawing/ToolStore'
import { ToolType } from '../drawing/tools/ToolType'
import { Toolbar } from './ui/Toolbar'
import svg from '../svg/svg'

export default function DrawingToolbar() {
    const [selectedTool, setSelectedTool] = useState(toolStore.getSelectedTool())

    const tools = []
    for (let i = 0; i < 10; i++) {
        tools[i] = {
            id: `tool-${i}`,
            label: `tool${i}`,
            icon: <div style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: svg.tool.trendLine }} />,
        }
    }

    tools.push({
        id: `trend-line`,
        label: `Trend Line`,
        icon: <div style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: svg.tool.trendLine }} />,
    })

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
                        {
                            type: 'button',
                            id: 'howizontal-line',
                            icon: (
                                <div
                                    style={{ width: 28, height: 28 }}
                                    dangerouslySetInnerHTML={{ __html: svg.tool.horizontalLine }}
                                />
                            ),
                            active: selectedTool === ToolType.HorizontalLine,
                            onClick: () => {
                                toolStore.select(ToolType.HorizontalLine)
                            },
                        },
                        // {
                        //     type: 'dropdown',
                        //     id: 'asdsa',
                        //     selectedId: `trend-line`,
                        //     options: tools,
                        //     renderTrigger: ({ selected, open, toggleDropdown }) => {
                        //         console.log(selected)
                        //         return (
                        //             <div className="toolbar-btn-dropdown">
                        //                 <button className={'toolbar-icon ' + `${open ? 'open' : ''}`}>
                        //                     <div
                        //                         style={{
                        //                             display: 'flex',
                        //                             alignItems: 'center',
                        //                             padding: '0px 6px',
                        //                             height: '100%',
                        //                         }}
                        //                     >
                        //                         {selected?.icon}
                        //                     </div>
                        //                 </button>
                        //                 <button className="toolbar-btn-dropdown-arrow"></button>
                        //             </div>
                        //         )
                        //     },
                        // },
                    ],
                },
            ]}
        />
    )
}
