import { memo } from 'react'
import type { OhlcData } from '../hooks/charts/useOHLCOverlay'

type Props = {
    ohlc: OhlcData | null
    precision?: number
}

function ChartOHLC({ ohlc, precision = 5 }: Props) {
    if (!ohlc) {
        return null
    }

    const format = (value: number) => value.toFixed(precision)

    const isBullish = ohlc.change >= 0

    return (
        <div className="chart-ohlc">
            <span className="chart-ohlc-value">O {format(ohlc.open)}</span>

            <span className="chart-ohlc-value">H {format(ohlc.high)}</span>

            <span className="chart-ohlc-value">L {format(ohlc.low)}</span>

            <span className="chart-ohlc-value">C {format(ohlc.close)}</span>

            <span
                className="chart-ohlc-value chart-ohlc-percent"
                style={{
                    color: isBullish ? '#4caf50' : '#f44336',
                }}
            >
                {isBullish ? '+' : ''}
                {ohlc.change.toFixed(precision)} ({isBullish ? '+' : ''}
                {ohlc.changePercent.toFixed(2)}%)
            </span>
        </div>
    )
}

export default memo(ChartOHLC)
