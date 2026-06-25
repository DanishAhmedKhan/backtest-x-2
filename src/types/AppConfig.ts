import type { LayoutType } from './Layout'

export type AppConfig = {
    layout: LayoutType
    charts: {
        ticker: string
        timeframe: string
    }[]
}
