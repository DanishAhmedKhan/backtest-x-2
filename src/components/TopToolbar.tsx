import { Toolbar } from './ui/Toolbar'

import type { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'

import { ToolbarGroup } from './ui/ToolbarGroup'
import { ToolbarDropdown } from './ui/ToolbarDropdown'
import { ToolbarButton } from './ui/ToolbarButton'
import { ToolIcon } from './ui/ToolbarIcon'
import { ToolbarSeparator } from './ui/ToolbarSeparator'
import { ToolbarFill } from './ui/ToolbarFill'
import { ToolbarArrowDropdown } from './ui/ToolbarArrowDropdown'
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
        icon: <ToolIcon width={21} height={19} svg={svg.layout[layoutType]} />,
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
                    width={100}
                    selectedId={`tf-${timeframe.toKey()}`}
                    options={timeframeOptions}
                    onChange={(option) => {
                        onTimeframeChange(Timeframe.parse(option.label))
                    }}
                />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ToolbarButton icon={<ToolIcon svg={svg.replay.replay} />} onClick={onReplayClick} />
                <ToolbarButton icon={<ToolIcon svg={svg.goTo} />} onClick={onJumpToClick} />
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
                            <ToolIcon svg={svg.layout[layout]} width={21} height={19} />
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

                <ToolbarButton icon={<ToolIcon svg={svg.settings} />} />
                <ToolbarButton icon={<ToolIcon svg={svg.snapshot} />} />
            </ToolbarGroup>
        </Toolbar>
    )
}
