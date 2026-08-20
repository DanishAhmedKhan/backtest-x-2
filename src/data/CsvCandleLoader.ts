import { Candle } from '../core/Candle'

type FolderName = 'M' | 'H' | 'D'

const ROOT_DATA_FOLDER_NAME = 'ticker-data'

export class CsvCandleLoader {
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

    public static getYearWeek(timestamp: number) {
        const date: Date = new Date(timestamp * 1000)

        date.setHours(0, 0, 0, 0)

        const dayNum = date.getDay() || 7
        date.setDate(date.getDate() + 4 - dayNum)

        const yearStart = new Date(date.getFullYear(), 0, 1)

        const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
        const year = date.getFullYear()

        return { year, week }
    }

    public static getBeforeYearWeek(year: number, week: number) {
        let newYear, newWeek

        if (week === 1) {
            newYear = year - 1
            newWeek = 52
        } else {
            newYear = year
            newWeek = week - 1
        }

        return { year: newYear, week: newWeek }
    }

    public static getFilename(year: number, week: number) {
        return `${year}-${week}.csv`
    }

    public static async getFileIndex(ticker: string, timestamp: number) {
        const files = await this.getSortedFiles(ticker)

        return this.findFileIndex(timestamp, files)
    }

    public static findFileIndex(timestamp: number, files: string[]) {
        const loopCount = 5
        let index = -1

        let { year, week } = this.getYearWeek(timestamp)

        for (let i = 0; i < loopCount; i++) {
            const fileName = this.getFilename(year, week)
            console.log(fileName)

            index = files.indexOf(fileName)

            if (index < 0) {
                const newYearWeek = this.getBeforeYearWeek(year, week)
                year = newYearWeek.year
                week = newYearWeek.week
            }
        }

        return index
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
