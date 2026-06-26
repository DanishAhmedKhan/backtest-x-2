import { CrosshairMode } from 'lightweight-charts'

export const DEFAULT_CHART_CONFIG = {
    layout: {
        background: { color: '#0f0f0f' },
        textColor: '#d1d4dc',
    },
    grid: {
        vertLines: { color: '#1e1e1e' },
        horzLines: { color: '#1e1e1e' },
    },
    crosshair: {
        mode: CrosshairMode.Normal,
        horzLine: { visible: false },
    },
    timeScale: {
        timeVisible: true,
        rightOffset: 20,
        rightBarStaysOnScroll: true,
        shiftVisibleRangeOnNewBar: false,
    },
}
