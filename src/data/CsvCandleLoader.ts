import { Candle } from '../core/Candle'

type FolderName = 'M' | 'H' | 'D'

const ROOT_DATA_FOLDER_NAME = 'ticker-data'

export class CsvCandleLoader {
    private static async getSortedFiles(ticker: string): Promise<string[]> {
        const manifestUrl = `/${ROOT_DATA_FOLDER_NAME}/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())

        return files.sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, ''))
            const numB = parseInt(b.replace(/\D/g, ''))
            return numA - numB
        })
    }

    public static async load(ticker: string, intervalFolder: FolderName, fileCount: number = 2): Promise<Candle[]> {
        const files = await this.getSortedFiles(ticker)

        return this.loadWindow(ticker, intervalFolder, Math.max(0, files.length - fileCount), fileCount)
    }

    public static async loadChunk(
        ticker: string,
        intervalFolder: FolderName,
        startIndex: number,
        count: number,
    ): Promise<Candle[]> {
        const files = await this.getSortedFiles(ticker)

        const safeStart = Math.max(0, startIndex)

        const selectedFiles = files.slice(safeStart, safeStart + count)

        if (selectedFiles.length === 0) {
            console.warn('No files selected (index out of range)')
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
        const files = await this.getSortedFiles(ticker)

        const date = new Date(timestamp * 1000)
        const { year, week } = this.getIsoWeek(date)

        const fileName = `${year}-${week}.csv`

        return files.indexOf(fileName)
    }

    private static getIsoWeek(date: Date) {
        const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))

        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))

        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))

        const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)

        return {
            year: d.getUTCFullYear(),
            week,
        }
    }

    public static async getFileCount(ticker: string): Promise<number> {
        const files = await this.getSortedFiles(ticker)
        return files.length
    }

    private static parseCsv(csv: string): Candle[] {
        const lines = csv.trim().split('\n')

        if (lines.length <= 1) return []

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
