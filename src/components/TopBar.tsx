import type { Ticker } from '../core/Ticker'
import type { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
    onTickerChange: (ticker: Ticker) => void
    onTimeframeChange: (timeframe: Timeframe) => void
}

export default function TopBar({ ticker, timeframe, onTickerChange, onTimeframeChange }: Props) {
    const handleTickerChange = (value: string) => {
        const selected = TickerRegistry.getByValue(value)
        if (selected && !selected.equals(ticker)) {
            onTickerChange(selected)
        }
    }

    const handleTimeframeChange = (value: string) => {
        const selected = TimeframeRegistry.getByValue(value)
        if (selected && !selected.equals(timeframe)) {
            onTimeframeChange(selected)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderBottom: '1px solid #222',
                background: '#0f0f0f',
            }}
        >
            {/* Ticker */}
            <select value={ticker.value} onChange={(e) => handleTickerChange(e.target.value)}>
                {TickerRegistry.getAll().map((tkr) => (
                    <option key={tkr.toKey()} value={tkr.value}>
                        {tkr.value}
                    </option>
                ))}
            </select>

            {/* Timeframe */}
            <select value={timeframe.toString()} onChange={(e) => handleTimeframeChange(e.target.value)}>
                {TimeframeRegistry.getAll().map((tf) => (
                    <option key={tf.toKey()} value={tf.toString()}>
                        {tf.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
