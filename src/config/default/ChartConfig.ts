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
    localization: {
        timeFormatter: (time) => {
            const date = new Date(time * 1000)

            const weekday = date.toLocaleString('en-US', { weekday: 'short' })
            const day = date.toLocaleString('en-US', { day: '2-digit' })
            const month = date.toLocaleString('en-US', { month: 'short' })
            const year = date.toLocaleString('en-US', { year: '2-digit' })

            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            const seconds = String(date.getSeconds()).padStart(2, '0')

            return `${weekday} ${day} ${month} '${year}  ${hours}:${minutes}:${seconds}`
        },
    },
    timeScale: {
        borderColor: 'rgba(0, 0, 0, .2)',
        timeVisible: true,
        rightOffset: 20,
        rightBarStaysOnScroll: true,
        shiftVisibleRangeOnNewBar: false,
    },
}
