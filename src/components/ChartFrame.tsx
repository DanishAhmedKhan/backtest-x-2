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
                height: '100%',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                minWidth: 0,
                minHeight: 0,

                border: isActive ? '3px solid #0051ff' : '3px solid black',

                // borderRadius: '4px',
                // boxShadow: isActive ? 'inset 0 0 0 1px red' : 'none',
                // transition: 'box-shadow 0.15s ease',
            }}
        >
            {/* top highlight bar (TradingView style) */}
            {/* {isActive && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#9B7DFF',
                        zIndex: 10,
                    }}
                />
            )} */}

            <Chart ticker={chart.ticker} timeframe={chart.timeframe} />
        </div>
    )
}
