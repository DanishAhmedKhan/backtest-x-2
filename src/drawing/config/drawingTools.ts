import { ToolType } from '../tools/ToolType'
import svg from '../../svg/svg'

type DrawingToolConfig = {
    type: ToolType
    icon: string
    label: string
}

export const drawingTools: DrawingToolConfig[] = [
    {
        type: ToolType.Pan,
        icon: svg.tool.pan,
        label: 'Pan',
    },
    {
        type: ToolType.TrendLine,
        icon: svg.tool.trendLine,
        label: 'Trend Line',
    },
    {
        type: ToolType.HorizontalLine,
        icon: svg.tool.horizontalLine,
        label: 'Horizontal Line',
    },
    {
        type: ToolType.VerticalLine,
        icon: svg.tool.verticalLine,
        label: 'Vertical Line',
    },
]
