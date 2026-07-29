import { Toolbar } from './ui/Toolbar'

import type { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { LAYOUT_TYPES, type LayoutType } from '../types/Layout'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import type { ToolbarButtonItem } from './ui/types'
import svg from '../svg/svg'

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
            id: `tkr-${t.value}`,
            label: t.value,
        }
    })

    const timeframeDisplay = TimeframeRegistry.getAll().map((tf) => {
        return {
            type: 'button',
            id: `tf-d-${tf.toKey()}`,
            label: tf.toKey(),
            active: tf.equals(timeframe),
            onClick: () => {
                onTimeframeChange(tf)
            },
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
                            selectedId: `tkr-${ticker.value}`,
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
                    items: [
                        ...timeframeDisplay,
                        {
                            type: 'dropdown',
                            id: 'asa',
                            selectedId: `tf-${timeframe.toKey()}`,
                            options: timeframeOptions,
                            render: () => (
                                <div
                                    style={{ width: 10, height: 5 }}
                                    dangerouslySetInnerHTML={{ __html: svg.dropdown }}
                                />
                            ),
                            onChange: (option) => {
                                onTimeframeChange(Timeframe.parse(option.label))
                            },
                        },
                    ],
                },
                {
                    type: 'separator',
                    id: 's-2',
                },
                {
                    type: 'group',
                    id: 'function',
                    items: [
                        {
                            type: 'button',
                            id: 'replay',
                            icon: (
                                <div
                                    style={{ width: 28, height: 28 }}
                                    dangerouslySetInnerHTML={{ __html: svg.replay }}
                                />
                            ),
                            onClick: onReplayClick,
                        },
                        {
                            type: 'button',
                            id: 'go-to',
                            icon: (
                                <div style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: svg.goTo }} />
                            ),
                            onClick: onJumpToClick,
                        },
                    ],
                },
                {
                    type: 'fill',
                    id: 'center-gap',
                },
                {
                    type: 'group',
                    id: 'right-side',
                    items: [
                        {
                            type: 'button',
                            id: 'go-to',
                            icon: (
                                <div
                                    style={{ width: 21, height: 19 }}
                                    dangerouslySetInnerHTML={{ __html: svg.layout['1x1'] }}
                                />
                            ),
                            onClick: () => {},
                        },
                        {
                            type: 'button',
                            id: 'settings',
                            icon: (
                                <div
                                    style={{ width: 28, height: 28 }}
                                    dangerouslySetInnerHTML={{ __html: svg.settings }}
                                />
                            ),
                        },
                        {
                            type: 'button',
                            id: 'snapshot',
                            icon: (
                                <div
                                    style={{ width: 28, height: 28 }}
                                    dangerouslySetInnerHTML={{ __html: svg.snapshot }}
                                />
                            ),
                        },
                    ],
                },
            ]}
        />
    )
}
