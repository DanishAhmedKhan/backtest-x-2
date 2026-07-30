import { CrosshairMode } from 'lightweight-charts'

export const DEFAULT_CHART_CONFIG = {
    layout: {
        background: { color: '#fff' },
        textColor: '#0f0f0f',
        attributionLogo: false,
    },
    grid: {
        vertLines: { color: 'rgba(0, 0, 0, .06)' },
        horzLines: { color: 'rgba(0, 0, 0, .06)' },
    },
    rightPriceScale: {
        borderColor: 'rgba(0, 0, 0, .2)',
    },
    crosshair: {
        mode: CrosshairMode.Normal,
    },
    timeScale: {
        borderColor: 'rgba(0, 0, 0, .2)',
        timeVisible: true,
        rightOffset: 20,
        rightBarStaysOnScroll: true,
        shiftVisibleRangeOnNewBar: false,
    },
}
