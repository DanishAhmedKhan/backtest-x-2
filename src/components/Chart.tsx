import { useEffect, useRef, useState, memo } from 'react'
import { type CandlestickData, type Time } from 'lightweight-charts'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import type { Candle } from '../core/Candle'

import { useChartData } from '../hooks/charts/useChartData'
import { useViewportSync } from '../hooks/charts/useViewportSync'
import { useCrosshairSync } from '../hooks/charts/useCrosshairSync'
import { useInfiniteScroll } from '../hooks/charts/useInfiniteScroll'
import { useReplaySync } from '../hooks/charts/useReplaySync'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import ReplayOverlay from './ReplayOverlay'
import { useChart } from '../hooks/charts/useChart'
import { useReplayPreview } from '../hooks/charts/useReplayPreview'
import { useChartResize } from '../hooks/charts/useChartResize'
import { DEFAULT_BLANK_CANDLE, DEFAULT_VISIBLE_CANDLE } from '../config/default/CandleConfig'
import { useJumpTo } from '../hooks/charts/useJumpTo'

export type LoadedWindow = {
    oldestFile: number
    latestFile: number
}

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const raw1mCandlesRef = useRef<Candle[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const candleCountRef = useRef<number>(DEFAULT_VISIBLE_CANDLE)
    const spaceCountRef = useRef<number>(DEFAULT_BLANK_CANDLE)

    const isChangingTimeframeRef = useRef<boolean>(false)
    const [isHovered, setIsHovered] = useState(false)

    const loadedWindowRef = useRef({
        oldestFile: 0,
        latestFile: 0,
    })

    const totalFilesRef = useRef(0)
    const isLoadingOlderRef = useRef(false)

    const { chartRef, seriesRef, chartReady } = useChart(containerRef)

    const { previewTime, previewX, clearPreview } = useReplayPreview({
        chartRef,
    })

    useViewportSync({
        chartRef,
        seriesRef,
        candlesRef,
        isChangingTimeframeRef,
        chartReady,
        candleCountRef,
        spaceCountRef,
    })

    useInfiniteScroll({
        chartRef,
        seriesRef,
        candlesRef,
        candleMapRef,
        timesRef,
        ticker,
        timeframe,
        chartReady,
        loadedWindowRef,
        totalFilesRef,
        isLoadingOlderRef,
    })

    useChartResize({
        containerRef,
        chartRef,
    })

    useCrosshairSync({
        id,
        chartRef,
        seriesRef,
        candleMapRef,
        timesRef,
    })

    useChartData({
        ticker,
        timeframe,
        chartReady,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        totalFilesRef,
        candleCountRef,
        spaceCountRef,
        setIsChangingTimeframe: (value) => {
            isChangingTimeframeRef.current = value
        },
    })

    useReplaySync({
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
    })

    useJumpTo({
        ticker,
        timeframe,
        chartRef,
        seriesRef,
        candlesRef,
        raw1mCandlesRef,
        candleMapRef,
        timesRef,
        loadedWindowRef,
        candleCountRef,
        spaceCountRef,
    })

    useEffect(() => {
        chartRef.current?.applyOptions({
            crosshair: {
                horzLine: { visible: isHovered },
            },
        })
    }, [chartRef, isHovered])

    useEffect(() => {
        if (!replayStore.enabled) {
            return
        }

        const seconds = timeframe.toSeconds()

        replayStore.setChartTimeframeSeconds(seconds)
        replayStore.setUpdateIntervalSeconds(seconds)

        eventBus.emit('replayUpdateIntervalChanged', {
            seconds,
        })
    }, [timeframe])

    const handleReplaySelection = () => {
        if (!replayStore.isSelecting) return
        if (!replayStore.showToolbar) return
        if (previewTime === null) return

        replayStore.start(previewTime, timeframe.toSeconds())

        clearPreview()

        eventBus.emit('replayStart', {
            time: previewTime,
        })
    }

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <div
                ref={containerRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleReplaySelection}
                style={{ width: '100%', height: '100%' }}
            />

            {replayStore.showToolbar && replayStore.isSelecting && previewX !== null && <ReplayOverlay x={previewX} />}
        </div>
    )
}

export default memo(Chart)
