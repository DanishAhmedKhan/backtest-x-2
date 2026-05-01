import ChartFrame from './ChartFrame'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'

type Props = {
    charts: ChartState[]
    activeChartId: string
    onSelectChart: (id: string) => void
    layout: LayoutType
}

export default function ChartWindow({ charts, activeChartId, onSelectChart, layout }: Props) {
    const layoutMap = {
        '1x1': '1fr / 1fr',
        '2x1': '1fr / 1fr 1fr',
        '2x2': '1fr 1fr / 1fr 1fr',
    }

    const [rows, cols] = layoutMap[layout].split(' / ')

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: rows,
                gridTemplateColumns: cols,
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {charts.map((chart) => (
                <ChartFrame
                    key={chart.id}
                    chart={chart}
                    isActive={chart.id === activeChartId}
                    onSelect={() => onSelectChart(chart.id)}
                />
            ))}
        </div>
    )
}
