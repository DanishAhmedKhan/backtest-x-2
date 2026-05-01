import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import type { LayoutType } from '../types/Layout'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
    layout: LayoutType
    onTickerChange: (t: Ticker) => void
    onTimeframeChange: (t: Timeframe) => void
    onLayoutChange: (l: LayoutType) => void
}

export default function TopBar({
    ticker,
    timeframe,
    layout,
    onTickerChange,
    onTimeframeChange,
    onLayoutChange,
}: Props) {
    return (
        <div style={{ display: 'flex', gap: 10, padding: 10 }}>
            {/* Ticker */}
            <select value={ticker.value} onChange={(e) => onTickerChange(TickerRegistry.getByValue(e.target.value)!)}>
                {TickerRegistry.getAll().map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.value}
                    </option>
                ))}
            </select>

            {/* Timeframe */}
            <select
                value={timeframe.toString()}
                onChange={(e) => onTimeframeChange(TimeframeRegistry.getByValue(e.target.value)!)}
            >
                {TimeframeRegistry.getAll().map((tf) => (
                    <option key={tf.toString()} value={tf.toString()}>
                        {tf.label}
                    </option>
                ))}
            </select>

            {/* Layout */}
            <select value={layout} onChange={(e) => onLayoutChange(e.target.value as LayoutType)}>
                <option value="1x1">1 Chart</option>
                <option value="2x1">2 Charts</option>
                <option value="2x2">4 Charts</option>
            </select>
        </div>
    )
}
