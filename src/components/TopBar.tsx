import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import { LAYOUT_TYPES, type LayoutType } from '../types/Layout'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
    layout: LayoutType
    onTickerChange: (t: Ticker) => void
    onTimeframeChange: (t: Timeframe) => void
    onLayoutChange: (l: LayoutType) => void
    onReplayClick: () => void
}

export default function TopBar({
    ticker,
    timeframe,
    layout,
    onTickerChange,
    onTimeframeChange,
    onLayoutChange,
    onReplayClick,
}: Props) {
    return (
        <div
            style={{
                display: 'flex',
                gap: 10,
                padding: 10,
                backgroundColor: '#fff',
                height: '100%',
            }}
        >
            <select
                value={ticker.value}
                onChange={(e) => {
                    onTickerChange(TickerRegistry.getByValue(e.target.value)!)
                }}
            >
                {TickerRegistry.getAll().map((t) => (
                    <option key={t.value} value={t.value}>
                        {t.value}
                    </option>
                ))}
            </select>

            <select
                value={timeframe.toKey()}
                onChange={(e) => {
                    onTimeframeChange(Timeframe.parse(e.target.value))
                }}
            >
                {TimeframeRegistry.getAll().map((tf) => (
                    <option key={tf.toKey()} value={tf.toKey()}>
                        {tf.label}
                    </option>
                ))}
            </select>

            <select value={layout} onChange={(e) => onLayoutChange(e.target.value as LayoutType)}>
                {LAYOUT_TYPES.map((layoutType) => (
                    <option key={layoutType} value={layoutType}>
                        {layoutType}
                    </option>
                ))}
            </select>

            <button
                onClick={onReplayClick}
                style={{
                    padding: '0px 10px',
                    cursor: 'pointer',
                }}
            >
                Replay
            </button>
        </div>
    )
}
