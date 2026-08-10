export function hexToRgba(hex, opacity = 100) {
    const value = hex.replace('#', '').trim()

    if (!/^[0-9a-fA-F]{6}$/.test(value)) {
        return hex
    }

    const r = parseInt(value.slice(0, 2), 16)
    const g = parseInt(value.slice(2, 4), 16)
    const b = parseInt(value.slice(4, 6), 16)

    const alpha = Math.max(0, Math.min(100, opacity)) / 100

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function rgbaToHex(color) {
    if (!color) {
        return '#000000'
    }

    const hexMatch = color.match(/^#([0-9a-f]{6})$/i)

    if (hexMatch) {
        return `#${hexMatch[1]}`
    }

    const rgbMatch = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i)

    if (!rgbMatch) {
        return '#000000'
    }

    const [, r, g, b] = rgbMatch

    return '#' + [r, g, b].map((value) => Number(value).toString(16).padStart(2, '0')).join('')
}

export function getColorOpacity(color) {
    if (!color) {
        return 100
    }

    const match = color.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*([\d.]+))?\s*\)/i)

    if (!match || match[1] === undefined) {
        return 100
    }

    return Math.round(Math.max(0, Math.min(1, Number(match[1]))) * 100)
}

export function getRgb(color) {
    const hex = rgbaToHex(color)

    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    }
}

export function getHexFromRgb(r, g, b) {
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

export function rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)

    let h = 0
    let s = 0

    const l = (max + min) / 2

    if (max !== min) {
        const d = max - min

        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break

            case g:
                h = (b - r) / d + 2
                break

            case b:
                h = (r - g) / d + 4
                break
        }

        h /= 6
    }

    return {
        h: h * 360,
        s: s * 100,
        l: l * 100,
    }
}

export function hexToHsl(hex) {
    const { r, g, b } = getRgb(hex)

    return rgbToHsl(r, g, b)
}

export function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360
    s = Math.max(0, Math.min(100, s)) / 100
    l = Math.max(0, Math.min(100, l)) / 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

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

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    }
}

export function hslToHex(h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l)

    return getHexFromRgb(r, g, b)
}

export function getHueColor(hue) {
    return `hsl(${hue}, 100%, 50%)`
}
