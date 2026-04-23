import type { Symbol } from '../core/Symbol'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

type Props = {
    symbol: Symbol
}

export default function TopBar({ symbol }: Props) {
    const onTickerChange = (value) => {}
    const onTimeframeChange = () => {}

    return (
        <div
            style={{
                display: 'flex',
                gap: '10px',
                padding: '10px',
                borderBottom: '1px solid #ccc',
            }}
        >
            <select value={symbol.ticker.symbol} onChange={(e) => onTickerChange(e.target.value)}>
                {TickerRegistry.getAll().map((tkr) => (
                    <option key={tkr.symbol} value={tkr.symbol}>
                        {tkr.symbol}
                    </option>
                ))}
            </select>

            <select value={symbol.timeframe.value} onChange={(e) => onTimeframeChange(e.target.value)}>
                {TimeframeRegistry.getAll().map((tf) => (
                    <option key={tf.value} value={tf.value}>
                        {tf.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
