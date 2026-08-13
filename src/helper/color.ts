export function hexToRgba(hex: string, opacity = 100) {
    const value = hex.replace('#', '').trim()

    if (value.length !== 6 && value.length !== 8) {
        return hex
    }

    if (!/^[0-9a-fA-F]{6}$/.test(value)) {
        return hex
    }

    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)

    if ([r, g, b].some(Number.isNaN)) {
        return hex
    }

    const alpha = Math.max(0, Math.min(100, opacity)) / 100

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function rgbaToHex(color: string) {
    if (!color) {
        return '#000000'
    }

    const value = color.trim()

    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        return value
    }

    if (/^#[0-9a-fA-F]{8}$/.test(value)) {
        return value.slice(0, 7)
    }

    const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i)

    if (!match) {
        return color
    }

    const [, r, g, b] = match

    return '#' + [r, g, b].map((value) => Number(value).toString(16).padStart(2, '0')).join('')
}

export function getColorOpacity(color: string) {
    if (!color) {
        return 100
    }

    const value = color.trim()

    if (/^#[0-9a-fA-F]{8}$/.test(value)) {
        const alpha = parseInt(value.slice(7, 9), 16)

        return Math.round((alpha / 255) * 100)
    }

    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        return 100
    }

    const match = value.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i)

    if (!match || match[1] === undefined) {
        return 100
    }

    const alpha = match[1].endsWith('%') ? Number(match[1].slice(0, -1)) : Number(match[1]) * 100

    return Math.round(Math.max(0, Math.min(100, alpha)))
}

export function getRgb(color: string) {
    const hex = rgbaToHex(color)

    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    }
}

export function getHexFromRgb(r: number, g: number, b: number) {
    return (
        '#' +
        [r, g, b]
            .map((value) =>
                Math.max(0, Math.min(255, Math.round(value)))
                    .toString(16)
                    .padStart(2, '0'),
            )
            .join('')
    )
}

export function hsvToHex(h: number, s: number, v: number) {
    s /= 100
    v /= 100

    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c

    let r = 0
    let g = 0
    let b = 0

    if (h < 60) {
        r = c
        g = x
    } else if (h < 120) {
        r = x
        g = c
    } else if (h < 180) {
        g = c
        b = x
    } else if (h < 240) {
        g = x
        b = c
    } else if (h < 300) {
        r = x
        b = c
    } else {
        r = c
        b = x
    }

    return getHexFromRgb(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255))
}

export function hexToHsv(hex: string) {
    const { r, g, b } = getRgb(hex)

    const red = r / 255
    const green = g / 255
    const blue = b / 255

    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)

    const delta = max - min

    let h = 0

    if (delta !== 0) {
        if (max === red) {
            h = 60 * (((green - blue) / delta) % 6)
        } else if (max === green) {
            h = 60 * ((blue - red) / delta + 2)
        } else {
            h = 60 * ((red - green) / delta + 4)
        }
    }

    if (h < 0) {
        h += 360
    }

    const s = max === 0 ? 0 : (delta / max) * 100
    const v = max * 100

    return {
        h,
        s,
        v,
    }
}

export function removeAlpha(color: string): string {
    if (/^#[0-9a-fA-F]{8}$/.test(color)) {
        return color.slice(0, 7)
    }

    return color
}
