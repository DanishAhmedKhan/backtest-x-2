import { useState } from 'react'

type Props = {
    selected: string
    opacity?: number
    onSelect: (color: string) => void
    onChange: (color: string) => void
}

const COLORS = [
    ['#ffffff', '#e5e5e5', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666', '#4d4d4d', '#333333', '#000000'],
    ['#ef4444', '#f97316', '#facc15', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'],
    ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#99f6e4', '#a5f3fc', '#bfdbfe', '#c7d2fe', '#e9d5ff', '#fbcfe8'],
    ['#fca5a5', '#fdba74', '#fde047', '#86efac', '#5eead4', '#67e8f9', '#93c5fd', '#a5b4fc', '#d8b4fe', '#f9a8d4'],
    ['#f87171', '#fb923c', '#facc15', '#4ade80', '#2dd4bf', '#22d3ee', '#60a5fa', '#818cf8', '#c084fc', '#f472b6'],
    ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'],
    ['#991b1b', '#c2410c', '#a16207', '#166534', '#115e59', '#155e75', '#1e40af', '#3730a3', '#6b21a8', '#9d174d'],
]

function hexToRgba(color: string, alpha: number) {
    const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i)

    if (rgbaMatch) {
        return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha / 100})`
    }

    const value = color.replace('#', '')

    const r = parseInt(value.substring(0, 2), 16)
    const g = parseInt(value.substring(2, 4), 16)
    const b = parseInt(value.substring(4, 6), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`
}

function getRgbColor(color: string) {
    const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)$/i)

    if (rgbaMatch) {
        return {
            r: Number(rgbaMatch[1]),
            g: Number(rgbaMatch[2]),
            b: Number(rgbaMatch[3]),
        }
    }

    const hex = color.replace('#', '')

    if (hex.length === 6) {
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        }
    }

    return {
        r: 0,
        g: 0,
        b: 0,
    }
}

export function ColorPicker({ selected, opacity = 100, onSelect, onChange }: Props) {
    const [currentOpacity, setCurrentOpacity] = useState(opacity)

    const rgb = getRgbColor(selected)

    const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value)
        setCurrentOpacity(value)
        onChange(hexToRgba(selected, value))
    }

    return (
        <div className="color-pallet">
            <div className="color-pallet-list">
                {COLORS.flat().map((color, index) => {
                    const isSelected = selected.toLowerCase() === color.toLowerCase()

                    return (
                        <button
                            key={`color-${index}`}
                            className="color-pallet-items"
                            type="button"
                            aria-label={`Select ${color}`}
                            onClick={() => onSelect(hexToRgba(color, currentOpacity))}
                            style={{
                                background: color,
                                outline: isSelected ? '2px solid #2563eb' : 'none',
                                outlineOffset: isSelected ? 1 : 0,
                                boxShadow: color === '#ffffff' ? 'inset 0 0 0 1px #bdbdbd' : 'none',
                            }}
                        />
                    )
                })}
            </div>

            <div className="color-pallet-separator" />

            <button className="add-color-button" type="button" aria-label="Add custom color">
                +
            </button>

            <div className="opacity-title">Opacity</div>

            <div className="opacity-wrapper">
                <div className="opacity-bar">
                    <div
                        className="opacity-color"
                        style={{
                            background: `linear-gradient(
                                to right,
                                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0),
                                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)
                            )`,
                        }}
                    />

                    <input
                        className="opacity-input-range"
                        type="range"
                        min={0}
                        max={100}
                        value={currentOpacity}
                        onChange={handleOpacityChange}
                        aria-label="Opacity"
                    />

                    <div
                        className="opacity-input-handle"
                        style={{
                            left: `calc(
                                7px + (100% - 14px) * ${currentOpacity} / 100
                            )`,
                        }}
                    />
                </div>

                <div className="opacity-input">{currentOpacity}%</div>
            </div>
        </div>
    )
}
