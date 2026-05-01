import Chart from './Chart'
import type { ChartState } from '../types/ChartState'

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
                border: '1px solid #333',
                boxShadow: isActive ? 'inset 0 0 0 2px #9B7DFF' : 'none',
                minHeight: 0,
                minWidth: 0,
                overflow: 'hidden',
            }}
        >
            <Chart ticker={chart.ticker} timeframe={chart.timeframe} />
        </div>
    )
}
