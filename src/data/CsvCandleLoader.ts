// import { Candle } from '../core/Candle'
// import type { Ticker } from '../core/Ticker'
// import type { Timeframe } from '../core/Timeframe'
// import { TimeframeUnit } from '../core/TimeframeUnit'

// type FolderName = 'M' | 'H' | 'D'

// const ROOT_DATA_FOLDER_NAME = 'ticker-data'

// export class CsvCandleLoader {
//     public static async loadData(ticker: Ticker, timeframe: Timeframe) {
//         let intervalFolder: FolderName

//         const unit = timeframe.unit
//         if (unit === TimeframeUnit.Minute) intervalFolder = 'M'
//         else if (unit === TimeframeUnit.Hour) intervalFolder = 'H'
//         else intervalFolder = 'D'

//         // load latest 2 files
//         const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker.value}/manifest.json`
//         const files: string[] = await fetch(manifestUrl).then((res) => res.json())

//         const startIndex = files.length - 2

//         return await this.loadChunk(ticker.value, intervalFolder, startIndex, 2)
//     }

//     public static async loadChunk(
//         ticker: string,
//         intervalFolder: FolderName,
//         startIndex: number,
//         count: number,
//     ): Promise<Candle[]> {
//         const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
//         const files: string[] = await fetch(manifestUrl).then((res) => res.json())

//         const selectedFiles = files.slice(startIndex, startIndex + count)

//         const candles: Candle[] = []

//         for (const file of selectedFiles) {
//             const url = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/${intervalFolder}/${file}`
//             const text = await fetch(url).then((res) => res.text())
//             candles.push(...this.parseCsv(text))
//         }

//         return candles
//     }

//     private static parseCsv(csv: string): Candle[] {
//         const lines = csv.trim().split('\n')
//         lines.shift()

//         return lines.map((line) => {
//             const [timeStr, open, high, low, close] = line.split(',')

//             const time = this.parseUtcTime(timeStr)

//             return new Candle({
//                 time,
//                 open: Number(open),
//                 high: Number(high),
//                 low: Number(low),
//                 close: Number(close),
//                 volume: 0,
//             })
//         })
//     }

//     private static parseUtcTime(timeStr: string): number {
//         const [datePart, timePart] = timeStr.split(' ')

//         const [year, month, day] = datePart.split('-').map(Number)
//         const [hour, minute, secondMs] = timePart.split(':')
//         const [second] = secondMs.split('.')

//         const utcMs = Date.UTC(year, month - 1, day, Number(hour), Number(minute), Number(second))

//         return Math.floor(utcMs / 1000)
//     }
// }

import { Candle } from '../core/Candle'
import { Timeframe } from '../core/Timeframe'
import { TimeframeUnit } from '../core/TimeframeUnit'

type FolderName = 'M' | 'H' | 'D'

const ROOT_DATA_FOLDER_NAME = 'ticker-data'

export class CsvCandleLoader {
    // =========================
    // LOAD LATEST FILES (INITIAL LOAD)
    // =========================
    public static async load(ticker: string, intervalFolder: FolderName, fileCount: number = 2): Promise<Candle[]> {
        const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())

        const latestFiles = files.slice(-fileCount)

        const candles: Candle[] = []

        for (const file of latestFiles) {
            const url = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/${intervalFolder}/${file}`
            const text = await fetch(url).then((res) => res.text())
            candles.push(...this.parseCsv(text))
        }

        return candles
    }

    // =========================
    // LOAD OLDER CHUNKS (INFINITE SCROLL)
    // =========================
    public static async loadChunk(
        ticker: string,
        intervalFolder: FolderName,
        startIndex: number,
        count: number,
    ): Promise<Candle[]> {
        const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())

        // prevent negative index
        const safeStart = Math.max(0, startIndex)

        const selectedFiles = files.slice(safeStart, safeStart + count)

        const candles: Candle[] = []

        for (const file of selectedFiles) {
            const url = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/${intervalFolder}/${file}`
            const text = await fetch(url).then((res) => res.text())
            candles.push(...this.parseCsv(text))
        }

        return candles
    }

    // =========================
    // GET TOTAL FILE COUNT (IMPORTANT)
    // =========================
    public static async getFileCount(ticker: string): Promise<number> {
        const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())
        return files.length
    }

    // =========================
    // CSV PARSER
    // =========================
    private static parseCsv(csv: string): Candle[] {
        const lines = csv.trim().split('\n')
        lines.shift()

        return lines.map((line) => {
            const [timeStr, open, high, low, close] = line.split(',')

            const time = this.parseUtcTime(timeStr)

            return new Candle({
                time,
                open: Number(open),
                high: Number(high),
                low: Number(low),
                close: Number(close),
                volume: 0,
            })
        })
    }

    private static parseUtcTime(timeStr: string): number {
        const [datePart, timePart] = timeStr.split(' ')

        const [year, month, day] = datePart.split('-').map(Number)
        const [hour, minute, secondMs] = timePart.split(':')
        const [second] = secondMs.split('.')

        const utcMs = Date.UTC(year, month - 1, day, Number(hour), Number(minute), Number(second))

        return Math.floor(utcMs / 1000)
    }
}
