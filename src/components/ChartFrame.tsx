import type { ChartState } from '../core/ChartState'
import Chart from './Chart'

type Props = {
    chart: ChartState
    isActive: boolean
    onSelect: () => void
}

export default function ChartFrame({ chart, isActive, onSelect }: Props) {
    return (
        <div
            onClick={onSelect}
            style={{
                border: isActive ? '2px solid #9B7DFF' : '1px solid #333',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            <Chart ticker={chart.ticker} timeframe={chart.timeframe} />
        </div>
    )
}
