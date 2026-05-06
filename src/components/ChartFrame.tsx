import Chart from './Chart'
import type { ChartState } from '../types/ChartState'

type Props = {
    id: string
    chart: ChartState
    isActive: boolean
    onSelect: () => void
}

export default function ChartFrame({ chart, isActive, onSelect }: Props) {
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
                border: isActive ? '3px solid #0051ff' : '3px solid black',
            }}
        >
            <Chart id={chart.id} ticker={chart.ticker} timeframe={chart.timeframe} />
        </div>
    )
}
