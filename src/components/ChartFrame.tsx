import Chart from './Chart'
import type { ChartState } from '../types/ChartState'
import type { DrawingToolbarManager } from '../drawing/toolbar/DrawingToolbarManager'

type Props = {
    id: string
    chart: ChartState
    isActive: boolean
    onSelect: () => void
    onDrawingToolbarManagerReady?: (manager: DrawingToolbarManager) => void
}

export default function ChartFrame({ chart, isActive, onSelect, onDrawingToolbarManagerReady }: Props) {
    return (
        <div
            className="chart-frame"
            onClick={onSelect}
            style={{
                border: isActive ? '2px solid #0051ff' : '2px solid white',
            }}
        >
            <Chart
                id={chart.id}
                ticker={chart.ticker}
                timeframe={chart.timeframe}
                onDrawingToolbarManagerReady={isActive ? onDrawingToolbarManagerReady : undefined}
            />
        </div>
    )
}
