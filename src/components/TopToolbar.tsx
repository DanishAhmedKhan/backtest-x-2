import { Toolbar } from './ui/Toolbar'

import type { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { LAYOUT_TYPES, LAYOUTS, type LayoutType } from '../types/Layout'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import type { ToolbarButtonItem, ToolbarDropdownContent } from './ui/types'
import svg from '../svg/svg'
import LayoutPicker from './ui/LayoutPicker'

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

    const layoutByNumber = []

    const layoutButtons = LAYOUT_TYPES.map((layoutType) => {
        return {
            type: 'button',
            id: `l-${layoutType}`,
            icon: (
                <div style={{ width: 21, height: 19 }} dangerouslySetInnerHTML={{ __html: svg.layout[layoutType] }} />
            ),
        } as ToolbarButtonItem
    })

    layoutButtons.forEach((layoutButton) => {
        const layoutType = layoutButton.id.substring(2)
        const chartCount = LAYOUTS[layoutType]
        if (!layoutByNumber[chartCount]) layoutByNumber[chartCount] = []
        layoutByNumber[chartCount].push(layoutButton)
    })

    const layoutGroups: ToolbarButtonItem[][] = [[], [], [], []]

    layoutButtons.forEach((button) => {
        const layoutType = button.id.substring(2)
        const chartCount = LAYOUTS[layoutType]
        layoutGroups[chartCount - 1].push(button)
    })

    const dropdown: ToolbarDropdownContent = ({ select, close }) => (
        <LayoutPicker
            selectedId={`l-${layout}`}
            groups={layoutGroups}
            onSelect={(id) => {
                const layoutType = id.substring(2)

                select({
                    id,
                    label: layoutType,
                })

                onLayoutChange(layoutType as LayoutType)

                close()
            }}
        />
    )

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
                            renderValue: () => (
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
                            type: 'dropdown',
                            id: 'layout',
                            selectedId: `l-${layout}`,
                            options: [],
                            renderValue: () => (
                                <div
                                    style={{ width: 21, height: 19 }}
                                    dangerouslySetInnerHTML={{
                                        __html: svg.layout[layout],
                                    }}
                                />
                            ),
                            dropdown,
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
