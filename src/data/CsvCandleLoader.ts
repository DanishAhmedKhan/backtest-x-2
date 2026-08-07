import { Candle } from '../core/Candle'

type FolderName = 'M' | 'H' | 'D'

interface FileRange {
    file: string
    firstTime: number
    lastTime: number
}

const ROOT_DATA_FOLDER_NAME = 'ticker-data'

export class CsvCandleLoader {
    private static fileRangesCache = new Map<string, FileRange[]>()

    private static async getFileRanges(ticker: string): Promise<FileRange[]> {
        const cached = this.fileRangesCache.get(ticker)

        if (cached) {
            return cached
        }

        const files = await this.getSortedFiles(ticker)

        const ranges: FileRange[] = []

        for (const file of files) {
            const url = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/M/${file}`

            const text = await fetch(url).then((res) => res.text())

            const candles = this.parseCsv(text)

            if (candles.length === 0) {
                continue
            }

            ranges.push({
                file,
                firstTime: candles[0].time,
                lastTime: candles[candles.length - 1].time,
            })
        }

        this.fileRangesCache.set(ticker, ranges)

        return ranges
    }

    private static async getSortedFiles(ticker: string): Promise<string[]> {
        try {
            const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
            const files: string[] = await fetch(manifestUrl).then((res) => res.json())

            return files.sort((a, b) => {
                const [, yearA, weekA] = a.match(/^(\d{4})-(\d+)\.csv$/)!
                const [, yearB, weekB] = b.match(/^(\d{4})-(\d+)\.csv$/)!

                const yDiff = Number(yearA) - Number(yearB)

                if (yDiff !== 0) {
                    return yDiff
                }

                return Number(weekA) - Number(weekB)
            })
        } catch (error) {
            console.log(`${ticker} data not found. Error: ${error}`)
            return []
        }
    }

    public static async loadWindow(
        ticker: string,
        intervalFolder: FolderName,
        startIndex: number,
        fileCount: number,
    ): Promise<Candle[]> {
        const files = await this.getSortedFiles(ticker)

        const safeStart = Math.max(0, startIndex)

        const selectedFiles = files.slice(safeStart, safeStart + fileCount)

        if (selectedFiles.length === 0) {
            return []
        }

        const candles: Candle[] = []

        for (const file of selectedFiles) {
            const url = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/${intervalFolder}/${file}`
            const text = await fetch(url).then((res) => res.text())
            candles.push(...this.parseCsv(text))
        }

        candles.sort((a, b) => a.time - b.time)

        return candles
    }

    public static async findFileIndex(ticker: string, timestamp: number): Promise<number> {
        const ranges = await this.getFileRanges(ticker)

        let left = 0
        let right = ranges.length - 1

        while (left <= right) {
            const mid = Math.floor((left + right) / 2)
            const range = ranges[mid]

            if (timestamp < range.firstTime) {
                right = mid - 1
            } else if (timestamp > range.lastTime) {
                left = mid + 1
            } else {
                return mid
            }
        }

        return -1
    }

    public static async getFileCount(ticker: string): Promise<number> {
        const files = await this.getSortedFiles(ticker)
        return files.length
    }

    private static parseCsv(csv: string): Candle[] {
        const lines = csv.trim().split('\n')

        if (lines.length <= 1) return []

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
