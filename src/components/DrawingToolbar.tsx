import { useEffect, useState } from 'react'

import { Toolbar } from './ui/Toolbar'
import { ToolbarGroup } from './ui/ToolbarGroup'
import { ToolbarButton } from './ui/ToolbarButton'

import { toolStore } from '../drawing/tools/ToolStore'
import { drawingTools } from '../drawing/config/drawingTools'

export default function DrawingToolbar() {
    const [selectedTool, setSelectedTool] = useState(toolStore.getSelectedTool())

    useEffect(() => {
        return toolStore.subscribe(setSelectedTool)
    }, [])

    return (
        <Toolbar direction="vertical">
            <ToolbarGroup>
                {drawingTools.map((tool) => (
                    <ToolbarButton
                        key={tool.type}
                        icon={<div style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: tool.icon }} />}
                        active={selectedTool === tool.type}
                        onClick={() => {
                            toolStore.select(tool.type)
                        }}
                    />
                ))}
            </ToolbarGroup>
        </Toolbar>
    )
}
