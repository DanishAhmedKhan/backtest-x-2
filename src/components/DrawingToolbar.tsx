import { useEffect, useState } from 'react'

import { Toolbar } from './ui/Toolbar'
import { ToolbarGroup } from './ui/ToolbarGroup'
import { ToolbarButton } from './ui/ToolbarButton'

import { ToolType } from '../drawing/tools/ToolType'

import { toolStore } from '../drawing/tools/ToolStore'
import svg from '../svg/svg'

export default function DrawingToolbar() {
    const [selectedTool, setSelectedTool] = useState(toolStore.getSelectedTool())

    useEffect(() => {
        return toolStore.subscribe(setSelectedTool)
    }, [])

    return (
        <Toolbar direction="vertical">
            <ToolbarGroup>
                <ToolbarButton
                    icon={<div style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: svg.tool.pan }} />}
                    active={selectedTool === ToolType.Pan}
                    onClick={() => {
                        toolStore.select(ToolType.Pan)
                    }}
                />

                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{ __html: svg.tool.trendLine }}
                        />
                    }
                    active={selectedTool === ToolType.TrendLine}
                    onClick={() => {
                        toolStore.select(ToolType.TrendLine)
                    }}
                />

                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{ __html: svg.tool.horizontalLine }}
                        />
                    }
                    active={selectedTool === ToolType.HorizontalLine}
                    onClick={() => {
                        toolStore.select(ToolType.HorizontalLine)
                    }}
                />
            </ToolbarGroup>
        </Toolbar>
    )
}
