import { useState } from 'react'
import { STORAGE_KEYS } from '../../storage/key'
import { getColorOpacity, getHexFromRgb, hexToHsl, hexToRgba, hslToRgb, rgbaToHex } from '../../helper/color'

type Props = {
    selected: string
    opacity?: number
    onSelect: (color: string) => void
    onChange: (color: string) => void
}

const COLORS = [
    ['#ffffff', '#dbdbdb', '#b8b8b8', '#cdcdcd', '#808080', '#636363', '#4a4a4a', '#2e2e2e', '#0f0f0f', '#000000'],
    ['#f23a45', '#ff9800', '#ffeb3b', '#4caf50', '#089981', '#00bcd4', '#2962ff', '#673ab7', '#9c27b0', '#e91e63'],
    ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#99f6e4', '#a5f3fc', '#bfdbfe', '#c7d2fe', '#e9d5ff', '#fbcfe8'],
    ['#fca5a5', '#fdba74', '#fde047', '#86efac', '#5eead4', '#67e8f9', '#93c5fd', '#a5b4fc', '#d8b4fe', '#f9a8d4'],
    ['#f87171', '#fb923c', '#facc15', '#4ade80', '#2dd4bf', '#22d3ee', '#60a5fa', '#818cf8', '#c084fc', '#f472b6'],
    ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'],
    ['#991b1b', '#c2410c', '#a16207', '#166534', '#115e59', '#155e75', '#1e40af', '#3730a3', '#6b21a8', '#9d174d'],
]

function loadCustomColors() {
    try {
        const value = localStorage.getItem(STORAGE_KEYS.COLOR_PICKER_SAVED_COLOR)

        if (!value) {
            return []
        }

        const parsed = JSON.parse(value)

        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function saveCustomColors(colors) {
    localStorage.setItem(STORAGE_KEYS.COLOR_PICKER_SAVED_COLOR, JSON.stringify(colors))
}

export function ColorPicker({ selected, onSelect, onChange }: Props) {
    const selectedHex = rgbaToHex(selected)

    const [opacityState, setOpacityState] = useState(() => ({
        color: selectedHex,
        value: getColorOpacity(selected),
    }))

    const currentOpacity =
        opacityState.color.toLowerCase() === selectedHex.toLowerCase() ? opacityState.value : getColorOpacity(selected)

    const [customColors, setCustomColors] = useState(loadCustomColors)
    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [customColor, setCustomColor] = useState(selectedHex)

    const initialHsl = hexToHsl(selectedHex)

    const [hue, setHue] = useState(initialHsl.h)
    const [saturation, setSaturation] = useState(initialHsl.s)
    const [lightness, setLightness] = useState(initialHsl.l)

    const updateOpacityState = (value) => {
        setOpacityState({
            color: selectedHex,
            value,
        })
    }

    const handleOpacityChange = (event) => {
        const value = Number(event.target.value)
        updateOpacityState(value)
        onChange?.(hexToRgba(selectedHex, value))
    }

    const handleColorSelect = (color) => {
        onSelect(hexToRgba(color, currentOpacity))
    }

    const openCustomPicker = () => {
        const hsl = hexToHsl(selectedHex)

        setCustomColor(selectedHex)
        setHue(hsl.h)
        setSaturation(hsl.s)
        setLightness(hsl.l)
        setShowCustomPicker(true)
    }

    const handleHexChange = (value: string) => {
        setCustomColor(value)

        if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
            return
        }

        const hsl = hexToHsl(value)

        setHue(hsl.h)
        setSaturation(hsl.s)
        setLightness(hsl.l)
    }

    const handleGradientMouseDown = (event) => {
        const updateGradient = (clientX: number, clientY: number) => {
            const rect = event.currentTarget.getBoundingClientRect()

            const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))

            const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

            const hueRgb = hslToRgb(hue, 100, 50)

            const red = Math.round(255 + (hueRgb.r - 255) * x)
            const green = Math.round(255 + (hueRgb.g - 255) * x)
            const blue = Math.round(255 + (hueRgb.b - 255) * x)

            const darkenedRed = Math.round(red * (1 - y))
            const darkenedGreen = Math.round(green * (1 - y))
            const darkenedBlue = Math.round(blue * (1 - y))

            const nextColor = getHexFromRgb(darkenedRed, darkenedGreen, darkenedBlue)

            setSaturation(x * 100)
            setLightness((1 - y) * 50)
            setCustomColor(nextColor)
        }

        updateGradient(event.clientX, event.clientY)

        const handleMouseMove = (moveEvent) => {
            updateGradient(moveEvent.clientX, moveEvent.clientY)
        }

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    const handleHueMouseDown = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()

        const updateHue = (clientY: number) => {
            const position = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

            const nextHue = position * 360

            setHue(nextHue)

            const hueRgb = hslToRgb(nextHue, 100, 50)

            const x = saturation / 100
            const y = 1 - lightness / 50

            const red = Math.round(255 + (hueRgb.r - 255) * x)
            const green = Math.round(255 + (hueRgb.g - 255) * x)
            const blue = Math.round(255 + (hueRgb.b - 255) * x)

            const darkenedRed = Math.round(red * (1 - y))
            const darkenedGreen = Math.round(green * (1 - y))
            const darkenedBlue = Math.round(blue * (1 - y))

            setCustomColor(getHexFromRgb(darkenedRed, darkenedGreen, darkenedBlue))
        }

        updateHue(event.clientY)

        const handleMouseMove = (moveEvent) => {
            updateHue(moveEvent.clientY)
        }

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseup', handleMouseUp)
    }

    const handleAddCustomColor = () => {
        if (!/^#[0-9a-fA-F]{6}$/.test(customColor)) {
            return
        }

        const normalizedColor = customColor.toLowerCase()
        const nextColors = [...customColors.filter((color) => color.toLowerCase() !== normalizedColor), normalizedColor]

        setCustomColors(nextColors)
        saveCustomColors(nextColors)

        onSelect(hexToRgba(normalizedColor, currentOpacity))
    }

    const gradientHueColor = `hsl(${hue}, 100%, 50%)`

    if (showCustomPicker) {
        return (
            <div className="color-pallet">
                <div className="custom-color-picker">
                    <div className="custom-color-header">
                        <div
                            className="custom-color-preview"
                            style={{
                                background: customColor,
                            }}
                        />

                        <input
                            className="custom-color-input"
                            value={customColor}
                            onChange={(event) => handleHexChange(event.target.value)}
                        />

                        <button type="button" className="custom-color-add" onClick={handleAddCustomColor}>
                            Add
                        </button>
                    </div>

                    <div className="custom-color-body">
                        <div
                            className="custom-color-gradient"
                            style={{
                                background: `
                                    linear-gradient(
                                        to top,
                                        #000000 0%,
                                        transparent 100%
                                    ),
                                    linear-gradient(
                                        to right,
                                        #ffffff 0%,
                                        transparent 100%
                                    ),
                                    ${gradientHueColor}
                                `,
                            }}
                            onMouseDown={handleGradientMouseDown}
                        >
                            <div
                                className="custom-color-gradient-handle"
                                style={{
                                    left: `${saturation}%`,
                                    top: `${100 - (lightness / 50) * 100}%`,
                                }}
                            />
                        </div>

                        <div className="custom-color-hue" onMouseDown={handleHueMouseDown}>
                            <div
                                className="custom-color-hue-handle"
                                style={{
                                    top: `${(hue / 360) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <button type="button" className="custom-color-back" onClick={() => setShowCustomPicker(false)}>
                        Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="color-pallet">
            <div className="color-pallet-list">
                {customColors.map((color, index) => {
                    const isSelected = selectedHex.toLowerCase() === color.toLowerCase()

                    return (
                        <button
                            key={`custom-${index}`}
                            className="color-pallet-items"
                            type="button"
                            aria-label={`Select ${color}`}
                            onClick={() => handleColorSelect(color)}
                            style={{
                                background: color,
                                outline: isSelected ? '2px solid #2563eb' : 'none',
                                outlineOffset: isSelected ? 1 : 0,
                            }}
                        />
                    )
                })}

                {COLORS.flat().map((color, index) => {
                    const isSelected = selectedHex.toLowerCase() === color.toLowerCase()

                    return (
                        <button
                            key={`color-${index}`}
                            className="color-pallet-items"
                            type="button"
                            aria-label={`Select ${color}`}
                            onClick={() => handleColorSelect(color)}
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

            <button className="add-color-button" type="button" aria-label="Add custom color" onClick={openCustomPicker}>
                +
            </button>

            <div className="opacity-title">Opacity</div>

            <div className="opacity-wrapper">
                <div className="opacity-bar">
                    <div
                        className="opacity-color"
                        style={{
                            background: `
                                linear-gradient(
                                    to right,
                                    rgba(255, 255, 255, 0),
                                    ${selectedHex}
                                )
                            `,
                        }}
                    />

                    <input
                        className="opacity-input-range"
                        type="range"
                        min="0"
                        max="100"
                        value={currentOpacity}
                        onChange={handleOpacityChange}
                        aria-label="Opacity"
                    />

                    <div
                        className="opacity-input-handle"
                        style={{
                            left: `calc(
                                7px +
                                (100% - 14px) *
                                ${currentOpacity} / 100
                            )`,
                        }}
                    />
                </div>

                <div className="opacity-input">{currentOpacity}%</div>
            </div>
        </div>
    )
}
