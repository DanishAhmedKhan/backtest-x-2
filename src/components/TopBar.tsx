import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import type { LayoutType } from '../types/Layout'
import { replayStore } from '../replay/ReplayStore'
import { eventBus } from '../event/EventBus'

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
    const handleReplayClick = () => {
        const time = replayStore.currentCrosshairTime

        if (!time) {
            console.log('No crosshair position selected')
            return
        }

        replayStore.start(time)

        eventBus.emit('replayStart', {
            time,
        })

        console.log('Replay started at:', time)
    }

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
                <option value="1x1">1 Chart</option>
                <option value="2x1">2 Charts</option>
                <option value="2x2">4 Charts</option>
            </select>

            <button
                onClick={handleReplayClick}
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
