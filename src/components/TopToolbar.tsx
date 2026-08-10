import { Toolbar } from './ui/Toolbar'

import type { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

import { ToolbarGroup } from './ui/ToolbarGroup'
import { ToolbarDropdown } from './ui/ToolbarDropdown'
import { ToolbarSeparator } from './ui/ToolbarSeparator'
import { ToolbarButton } from './ui/ToolbarButton'
import { ToolbarArrowDropdown } from './ui/ToolbarArrowDropdown'
import { ToolbarFill } from './ui/ToolbarFill'
import LayoutPicker from './common/LayoutPicker'

import type { ToolbarButtonItem } from './ui/types'

import svg from '../svg/svg'
import { LAYOUT_TYPES, LAYOUTS, type LayoutType } from '../types/Layout'

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
    const tickerOptions = TickerRegistry.getAll().map((t) => ({
        id: `tkr-${t.value}`,
        label: t.value,
    }))

    const timeframeOptions = TimeframeRegistry.getAll().map((tf) => ({
        id: `tf-${tf.toKey()}`,
        label: tf.toKey(),
    }))

    const layoutButtons = LAYOUT_TYPES.map((layoutType) => ({
        id: `l-${layoutType}`,
        icon: (
            <div
                style={{ width: 21, height: 19 }}
                dangerouslySetInnerHTML={{
                    __html: svg.layout[layoutType],
                }}
            />
        ),
    }))

    const layoutGroups: ToolbarButtonItem[][] = [[], [], [], []]

    layoutButtons.forEach((button) => {
        const layoutType = button.id.substring(2)
        const chartCount = LAYOUTS[layoutType]

        layoutGroups[chartCount - 1].push({
            type: 'button',
            ...button,
        })
    })

    const handleLayoutSelect = (id: string) => {
        const layoutType = id.substring(2)

        onLayoutChange(layoutType as LayoutType)
    }

    return (
        <Toolbar>
            <ToolbarGroup>
                <ToolbarDropdown
                    selectedId={`tkr-${ticker.value}`}
                    options={tickerOptions}
                    onChange={(option) => {
                        onTickerChange(TickerRegistry.getByValue(option.label)!)
                    }}
                />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                {TimeframeRegistry.getAll().map((tf) => (
                    <ToolbarButton
                        key={tf.toKey()}
                        label={tf.toKey()}
                        active={tf.equals(timeframe)}
                        onClick={() => {
                            onTimeframeChange(tf)
                        }}
                    />
                ))}

                <ToolbarArrowDropdown
                    selectedId={`tf-${timeframe.toKey()}`}
                    options={timeframeOptions}
                    onChange={(option) => {
                        onTimeframeChange(Timeframe.parse(option.label))
                    }}
                />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{
                                __html: svg.replay.replay,
                            }}
                        />
                    }
                    onClick={onReplayClick}
                />

                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{
                                __html: svg.goTo,
                            }}
                        />
                    }
                    onClick={onJumpToClick}
                />
            </ToolbarGroup>

            <ToolbarFill />

            <ToolbarGroup>
                <ToolbarDropdown
                    selectedId={`l-${layout}`}
                    options={[]}
                    renderTrigger={({ toggleDropdown, open }) => (
                        <button
                            type="button"
                            className={`toolbar-trigger ${open ? 'active' : ''}`}
                            onClick={toggleDropdown}
                        >
                            <div
                                style={{
                                    width: 21,
                                    height: 19,
                                    pointerEvents: 'none',
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: svg.layout[layout],
                                }}
                            />
                        </button>
                    )}
                    dropdown={({ select }) => (
                        <LayoutPicker
                            selectedId={`l-${layout}`}
                            groups={layoutGroups}
                            onSelect={(id) => {
                                handleLayoutSelect(id)

                                select({
                                    id,
                                    label: id.substring(2),
                                })
                            }}
                        />
                    )}
                />

                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{
                                __html: svg.settings,
                            }}
                        />
                    }
                />

                <ToolbarButton
                    icon={
                        <div
                            style={{ width: 28, height: 28 }}
                            dangerouslySetInnerHTML={{
                                __html: svg.snapshot,
                            }}
                        />
                    }
                />
            </ToolbarGroup>
        </Toolbar>
    )
}
