import type { Ticker } from '../core/Ticker'
import type { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
}

export default function TopBar({ ticker, timeframe }: Props) {
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
            <select value={ticker.value} onChange={(e) => onTickerChange(e.target.value)}>
                {TickerRegistry.getAll().map((tkr) => (
                    <option key={tkr.value} value={tkr.value}>
                        {tkr.value}
                    </option>
                ))}
            </select>

            <select value={timeframe.value} onChange={(e) => onTimeframeChange(e.target.value)}>
                {TimeframeRegistry.getAll().map((tf) => (
                    <option key={tf.value} value={tf.value}>
                        {tf.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
