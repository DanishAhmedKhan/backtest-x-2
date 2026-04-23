import { TimeframeUnit } from './TimeframeUnit'

export class Timeframe {
    public readonly value: number
    public readonly unit: TimeframeUnit

    public static DEFAULT = new Timeframe(1, TimeframeUnit.Minute)

    constructor(value: number, unit: TimeframeUnit) {
        if (!Number.isInteger(value)) {
            throw new Error(`Timeframe amount must be an integer, got ${value}`)
        }

        if (value <= 0) {
            throw new Error('Timeframe amount must be greater than zero')
        }

        if (!Object.values(TimeframeUnit).includes(unit)) {
            throw new Error(`Invalid timeframe unit: "${unit}"`)
        }

        this.value = value
        this.unit = unit
    }

    get label() {
        return this.value + this.unit
    }

    public static parse(tf: string): Timeframe {
        if (!tf || typeof tf !== 'string') {
            throw new Error('Timeframe must be a non-empty string')
        }

        const match = tf.trim().match(/^(\d+)([a-zA-Z])$/)
        if (!match) {
            throw new Error(`Invalid timeframe format: "${tf}"`)
        }

        const amount = Number(match[1])
        const unitChar = match[2].toLowerCase()

        if (!Number.isInteger(amount)) {
            throw new Error(`Timeframe amount must be an integer: "${amount}"`)
        }

        const unitMap: Record<string, TimeframeUnit> = {
            s: TimeframeUnit.Second,
            m: TimeframeUnit.Minute,
            h: TimeframeUnit.Hour,
            d: TimeframeUnit.Day,
        }

        const unit = unitMap[unitChar]
        if (!unit) {
            throw new Error(`Invalid timeframe unit: "${unitChar}"`)
        }

        return new Timeframe(amount, unit)
    }

    public toSeconds(): number {
        switch (this.unit) {
            case TimeframeUnit.Second:
                return this.value
            case TimeframeUnit.Minute:
                return this.value * 60
            case TimeframeUnit.Hour:
                return this.value * 3600
            case TimeframeUnit.Day:
                return this.value * 86400
        }
    }

    public toString(): string {
        return `${this.value}${this.unit}`
    }

    public equals(timeframe: Timeframe): boolean {
        return this.value === timeframe.value && this.unit === timeframe.unit
    }
}
