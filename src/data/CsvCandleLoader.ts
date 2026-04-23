import { Candle } from '../core/Candle'

export class CsvCandleLoader {
    public static async load(ticker: string, intervalFolder: 'M' | 'H' | 'D', fileCount: number): Promise<Candle[]> {
        const manifestUrl = `/data/${ticker}/manifest.json`
        const files: string[] = await fetch(manifestUrl).then((res) => res.json())
        const latestFiles = files.slice(-fileCount)

        const candles: Candle[] = []

        for (const file of latestFiles) {
            const url = `/data/${ticker}/${intervalFolder}/${file}`
            const text = await fetch(url).then((res) => res.text())
            candles.push(...this.parseCsv(text))
        }

        return candles.sort((a, b) => a.time - b.time)
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
