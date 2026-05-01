import { useState } from 'react'
import TopBar from './TopBar'
import ChartWindow from './ChartWindow'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import ToolBar from './ToolBar'
import type { ChartState } from '../types/ChartState'
import type { LayoutType } from '../types/Layout'

const createCharts = (count: number): ChartState[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `chart-${i + 1}`,
        ticker: TickerRegistry.getDefault(),
        timeframe: TimeframeRegistry.getDefault(),
    }))
}

export default function Main() {
    const [layout, setLayout] = useState<LayoutType>('2x1')
    const [charts, setCharts] = useState<ChartState[]>(createCharts(2))
    const [activeChartId, setActiveChartId] = useState('chart-1')

    const activeChart = charts.find((c) => c.id === activeChartId)!

    const updateActiveChart = (partial: Partial<ChartState>) => {
        setCharts((prev) => prev.map((c) => (c.id === activeChartId ? { ...c, ...partial } : c)))
    }

    const handleLayoutChange = (newLayout: LayoutType) => {
        setLayout(newLayout)

        const countMap = {
            '1x1': 1,
            '2x1': 2,
            '2x2': 4,
        }

        const newCount = countMap[newLayout]
        setCharts(createCharts(newCount))
        setActiveChartId('chart-1')
    }

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: '50px 1fr',
                gridTemplateColumns: '60px 1fr',
                height: '100%',
            }}
        >
            <div style={{ gridColumn: '1 / span 2' }}>
                <TopBar
                    ticker={activeChart.ticker}
                    timeframe={activeChart.timeframe}
                    layout={layout}
                    onTickerChange={(t) => updateActiveChart({ ticker: t })}
                    onTimeframeChange={(tf) => updateActiveChart({ timeframe: tf })}
                    onLayoutChange={handleLayoutChange}
                />
            </div>

            <ToolBar />

            <ChartWindow
                charts={charts}
                activeChartId={activeChartId}
                onSelectChart={setActiveChartId}
                layout={layout}
            />
        </div>
    )
}
