import { Toolbar } from './ui/Toolbar'

import type { Ticker } from '../core/Ticker'
import type { Timeframe } from '../core/Timeframe'
import type { LayoutType } from '../types/Layout'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import type { ToolbarButtonItem } from './ui/types'

type Props = {
    ticker: Ticker
    timeframe: Timeframe
    layout: LayoutType
    onTickerChange: (t: Ticker) => void
    onTimeframeChange: (t: Timeframe) => void
    onLayoutChange: (l: LayoutType) => void
    onReplayClick: () => void
    onJumpToClick: () => void
}

export default function TopToolbar({
    ticker,
    timeframe,
    layout,
    onTickerChange,
    onTimeframeChange,
    onLayoutChange,
    onReplayClick,
    onJumpToClick,
}: Props) {
    const tickerOptions = TickerRegistry.getAll().map((t) => {
        return {
            id: `tkr-op-${t.value}`,
            label: t.value,
        }
    })

    const timeframeDisplay = TimeframeRegistry.getAll().map((tf) => {
        return {
            type: 'button',
            id: `tf-${tf.toKey()}`,
            label: tf.toKey(),
        } as ToolbarButtonItem
    })

    const timeframeOptions = TimeframeRegistry.getAll().map((tf) => {
        return {
            id: `tf-${tf.toKey()}`,
            label: tf.toKey(),
        }
    })

    return (
        <Toolbar
            items={[
                {
                    type: 'group',
                    id: 'symbol',
                    items: [
                        {
                            type: 'dropdown',
                            id: 'ticker',
                            selectedId: `tkr-op-${ticker.value}`,
                            options: tickerOptions,
                            onChange: (option) => {
                                onTickerChange(TickerRegistry.getByValue(option.label)!)
                            },
                        },
                    ],
                },
                {
                    type: 'separator',
                    id: 's-1',
                },
                {
                    type: 'group',
                    id: 'tf',
                    items: timeframeDisplay,
                },
                {
                    type: 'separator',
                    id: 's-2',
                },
                {
                    type: 'group',
                    id: 'replay',
                    items: [
                        {
                            type: 'button',
                            id: 'replay',
                            label: 'Replay',
                        },
                    ],
                },
                {
                    type: 'separator',
                    id: 's-3',
                },
                {
                    type: 'group',
                    id: 'go-to',
                    items: [
                        {
                            type: 'button',
                            id: 'go-to',
                            label: 'Go To',
                        },
                    ],
                },
            ]}
        />
    )
}
