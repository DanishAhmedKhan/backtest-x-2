import { useState } from 'react'
import ChartFrame from './ChartFrame'
import TopBar from './TopBar'
import { TickerRegistry } from '../core/TickerRegstry'
import { TimeframeRegistry } from '../core/TimeframeRegistry'
import type { ChartState } from '../core/ChartState'

export default function ChartWindow() {
    const [charts, setCharts] = useState<ChartState[]>([
        {
            id: 'chart-1',
            ticker: TickerRegistry.getDefault(),
            timeframe: TimeframeRegistry.getDefault(),
        },
        {
            id: 'chart-2',
            ticker: TickerRegistry.getDefault(),
            timeframe: TimeframeRegistry.getDefault(),
        },
    ])

    const [activeChartId, setActiveChartId] = useState('chart-1')

    const activeChart = charts.find((c) => c.id === activeChartId)!

    const updateActiveChart = (partial: Partial<ChartState>) => {
        setCharts((prev) => prev.map((c) => (c.id === activeChartId ? { ...c, ...partial } : c)))
    }

    return (
        <div
            style={{
                height: '100%',
                display: 'grid',
                gridTemplateRows: '50px 1fr',
                overflow: 'hidden',
            }}
        >
            <TopBar
                ticker={activeChart.ticker}
                timeframe={activeChart.timeframe}
                onTickerChange={(t) => updateActiveChart({ ticker: t })}
                onTimeframeChange={(tf) => updateActiveChart({ timeframe: tf })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {charts.map((chart) => (
                    <ChartFrame
                        key={chart.id}
                        chart={chart}
                        isActive={chart.id === activeChartId}
                        onSelect={() => setActiveChartId(chart.id)}
                    />
                ))}
            </div>
        </div>
    )
}
