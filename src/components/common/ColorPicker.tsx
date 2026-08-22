import { useRef, useState } from 'react'

import { ToolbarIcon } from '../ui/ToolbarIcon'

import { getColorOpacity, hexToHsv, hexToRgba, hsvToHex, rgbaToHex } from '../../helper/color'
import svg from '../../svg/svg'

import { STORAGE_KEYS } from '../../storage/storageKeys'

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
    const selectedOpacity = getColorOpacity(selected)

    const [opacityState, setOpacityState] = useState(() => ({
        color: selectedHex,
        value: selectedOpacity,
    }))

    const [opacityInput, setOpacityInput] = useState(() => String(selectedOpacity))

    const currentOpacity =
        opacityState.color.toLowerCase() === selectedHex.toLowerCase() ? opacityState.value : getColorOpacity(selected)

    const [customColors, setCustomColors] = useState(loadCustomColors)
    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [customColor, setCustomColor] = useState(selectedHex)

    const initialHsv = hexToHsv(selectedHex)

    const [hue, setHue] = useState(initialHsv.h)
    const [saturation, setSaturation] = useState(initialHsv.s)
    const [value, setValue] = useState(initialHsv.v)

    const gradientRef = useRef<HTMLDivElement>(null)
    const gradientDraggingRef = useRef(false)

    const updateOpacity = (value: number) => {
        updateOpacityState(value)
        setOpacityInput(String(value))
        onChange?.(hexToRgba(selectedHex, value))
    }

    const updateOpacityState = (value: number) => {
        setOpacityState({
            color: selectedHex,
            value,
        })
    }

    const handleOpacityChange = (event) => {
        const value = Number(event.target.value)
        updateOpacity(value)
    }

    const handleColorSelect = (color: string) => {
        const rgba = hexToRgba(color, currentOpacity)

        setOpacityInput(String(currentOpacity))

        onSelect(rgba)
    }

    const openCustomPicker = () => {
        const hsv = hexToHsv(selectedHex)

        setCustomColor(selectedHex)
        setHue(hsv.h)
        setSaturation(hsv.s)
        setValue(hsv.v)
        setShowCustomPicker(true)
    }

    const handleHexChange = (value: string) => {
        setCustomColor(value)

        if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
            return
        }

        const hsv = hexToHsv(value)

        setHue(hsv.h)
        setSaturation(hsv.s)
        setValue(hsv.v)
    }

    const handleOpacityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        if (value === '') {
            setOpacityInput('')
            return
        }

        if (!/^\d+$/.test(value)) return
        if (Number(value) > 100) return
        if (value.length === 3 && value !== '100') return

        setOpacityInput(value)

        const opacity = Number(value)

        updateOpacityState(opacity)
        onChange?.(hexToRgba(selectedHex, opacity))
    }

    const handleOpacityInputBlur = () => {
        if (opacityInput === '') {
            setOpacityInput(String(currentOpacity))
        }
    }

    const updateGradientColor = (clientX: number, clientY: number) => {
        const element = gradientRef.current

        if (!element) return

        const rect = element.getBoundingClientRect()

        const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
        const y = Math.max(0, Math.min(rect.height, clientY - rect.top))

        const nextSaturation = (x / rect.width) * 100
        const nextValue = 100 - (y / rect.height) * 100

        setSaturation(nextSaturation)
        setValue(nextValue)

        const nextColor = hsvToHex(hue, nextSaturation, nextValue)

        setCustomColor(nextColor)
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

    const handleGradientPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        gradientDraggingRef.current = true

        event.currentTarget.setPointerCapture(event.pointerId)

        updateGradientColor(event.clientX, event.clientY)
    }

    const handleGradientPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!gradientDraggingRef.current) return

        event.preventDefault()

        updateGradientColor(event.clientX, event.clientY)
    }

    const handleGradientPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        gradientDraggingRef.current = false

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
    }

    const handleGradientPointerCancel = () => {
        gradientDraggingRef.current = false
    }

    const hueDraggingRef = useRef(false)
    const [hueDragging, setHueDragging] = useState(false)

    const updateHue = (clientY: number, element: HTMLElement) => {
        const rect = element.getBoundingClientRect()

        const position = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

        const nextHue = position * 360
        setHue(nextHue)

        const nextColor = hsvToHex(nextHue, saturation, value)
        setCustomColor(nextColor)
    }

    const handleHuePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault()

        updateHue(event.clientY, event.currentTarget)

        event.currentTarget.setPointerCapture(event.pointerId)

        hueDraggingRef.current = true
    }

    const handleHuePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!hueDraggingRef.current) {
            return
        }

        event.preventDefault()

        if (!hueDragging) {
            setHueDragging(true)
        }

        updateHue(event.clientY, event.currentTarget)
    }

    const handleHuePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        hueDraggingRef.current = false
        setHueDragging(false)

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
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
                            onChange={(e) => handleHexChange(e.target.value)}
                        />

                        <div className="custom-color-actions">
                            <button
                                type="button"
                                className="custom-color-back"
                                onClick={() => setShowCustomPicker(false)}
                                aria-label="Back"
                            >
                                <ToolbarIcon svg={svg.left} />
                            </button>

                            <button type="button" className="custom-color-add" onClick={handleAddCustomColor}>
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="custom-color-body">
                        <div
                            ref={gradientRef}
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
                            onPointerDown={handleGradientPointerDown}
                            onPointerMove={handleGradientPointerMove}
                            onPointerUp={handleGradientPointerUp}
                            onPointerCancel={handleGradientPointerCancel}
                        >
                            <div
                                className="custom-color-gradient-handle"
                                style={{
                                    left: `${saturation}%`,
                                    top: `${100 - value}%`,
                                }}
                            />
                        </div>

                        <div
                            className={`custom-color-hue ${hueDragging ? 'dragging' : ''}`}
                            onPointerDown={handleHuePointerDown}
                            onPointerMove={handleHuePointerMove}
                            onPointerUp={handleHuePointerUp}
                            onPointerCancel={handleHuePointerUp}
                        >
                            <div
                                className="custom-color-hue-handle"
                                style={{
                                    top: `calc(3px + (100% - 6px) * ${hue / 360})`,
                                    background: `hsl(${hue}, 100%, 50%)`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="color-pallet">
            <div className="color-pallet-list">
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

            <div className="color-pallet-custom-color">
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
                <button
                    className="add-color-button"
                    type="button"
                    aria-label="Add custom color"
                    onClick={openCustomPicker}
                ></button>
            </div>

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

                <div className="opacity-input">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={opacityInput}
                        onChange={handleOpacityInputChange}
                        onBlur={handleOpacityInputBlur}
                        aria-label="Opacity percentage"
                    />

                    <span>%</span>
                </div>
            </div>
        </div>
    )
}
