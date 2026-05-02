import { Candle } from '../core/Candle'

type FolderName = 'M' | 'H' | 'D'

const ROOT_DATA_FOLDER_NAME = 'ticker-data'

export class CsvCandleLoader {
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

    public static async loadChunk(
        ticker: string,
        intervalFolder: FolderName,
        startIndex: number,
        count: number,
    ): Promise<Candle[]> {
        const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())

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

    public static async getFileCount(ticker: string): Promise<number> {
        const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())
        return files.length
    }

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
