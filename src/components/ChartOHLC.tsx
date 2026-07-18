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
        <div
            style={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 20,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                fontSize: 12,
                fontFamily: 'monospace',
                fontWeight: 500,
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            <span style={{ color: '#d9d9d9' }}>O {format(ohlc.open)}</span>

            <span style={{ color: '#4caf50' }}>H {format(ohlc.high)}</span>

            <span style={{ color: '#f44336' }}>L {format(ohlc.low)}</span>

            <span style={{ color: '#42a5f5' }}>C {format(ohlc.close)}</span>

            <span
                style={{
                    color: isBullish ? '#4caf50' : '#f44336',
                    fontWeight: 700,
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
