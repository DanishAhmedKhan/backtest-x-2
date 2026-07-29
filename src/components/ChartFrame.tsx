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
            onClick={onSelect}
            style={{
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                minWidth: 0,
                minHeight: 0,
                borderRadius: 6,
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
