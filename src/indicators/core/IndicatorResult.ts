export type IndicatorValue = {
    time: number
    value: number
}

export type IndicatorLine = {
    id: string
    values: IndicatorValue[]
}

export type IndicatorLevel = {
    id: string
    value: number
}

export type IndicatorMarker = {
    time: number
    position: 'aboveBar' | 'belowBar' | 'inBar'
    shape: 'circle' | 'square' | 'arrowUp' | 'arrowDown'
    color?: string
    text?: string
}

export type IndicatorRectangle = {
    id: string
    from: number
    to: number
    top: number
    bottom: number
}

export type IndicatorCandleStyle = {
    time: number
    color?: string
    borderColor?: string
    wickColor?: string
}

export type IndicatorResult = {
    lines: IndicatorLine[]
    levels: IndicatorLevel[]
    markers: IndicatorMarker[]
    rectangles: IndicatorRectangle[]
    candleStyles: IndicatorCandleStyle[]
}

export function emptyIndicatorResult(): IndicatorResult {
    return {
        lines: [],
        levels: [],
        markers: [],
        rectangles: [],
        candleStyles: [],
    }
}
