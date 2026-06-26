import type { LayoutType } from './Layout'

export type ChartConfig = {
    ticker: string
    timeframe: string
}

export type AppConfig = {
    layout: LayoutType
    charts: ChartConfig[]
}
