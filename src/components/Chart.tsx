import { useEffect, useRef, useState, memo } from 'react'
import type { CandlestickData, Time } from 'lightweight-charts'

import ReplayOverlay from './ReplayOverlay'

import { Ticker } from '../core/Ticker'
import { Timeframe } from '../core/Timeframe'
import type { Candle } from '../core/Candle'

import { useChart } from '../hooks/charts/useChart'
import { useChartData } from '../hooks/charts/useChartData'
import { useChartResize } from '../hooks/charts/useChartResize'
import { useViewportSync } from '../hooks/charts/useViewportSync'
import { useCrosshairSync } from '../hooks/charts/useCrosshairSync'
import { useInfiniteScroll } from '../hooks/charts/useInfiniteScroll'
import { useReplayPreview } from '../hooks/charts/useReplayPreview'
import { useReplaySync } from '../hooks/charts/useReplaySync'
import { useJumpTo } from '../hooks/charts/useJumpTo'

import { eventBus } from '../event/EventBus'
import { replayStore } from '../replay/ReplayStore'
import type { ViewportState } from '../types/Viewport'
import { DEFAULT_BLANK_CANDLE, DEFAULT_VISIBLE_CANDLE } from '../config/default/CandleConfig'

type Props = {
    id: string
    ticker: Ticker
    timeframe: Timeframe
}

function Chart({ id, ticker, timeframe }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const candlesRef = useRef<CandlestickData<Time>[]>([])
    const fullCandlesRef = useRef<CandlestickData<Time>[]>([])
    const raw1mCandlesRef = useRef<Candle[]>([])
    const candleMapRef = useRef<Map<number, CandlestickData<Time>>>(new Map())
    const timesRef = useRef<number[]>([])

    const viewportRef = useRef<ViewportState>({
        visibleBars: DEFAULT_VISIBLE_CANDLE,
        rightWhitespace: DEFAULT_BLANK_CANDLE,
        barsAfterViewport: 0,
    })

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
        viewportRef,
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
        isChangingTimeframeRef,
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
        viewportRef,
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
        candleMapRef,
        timesRef,
        viewportRef,
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
        viewportRef,
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
