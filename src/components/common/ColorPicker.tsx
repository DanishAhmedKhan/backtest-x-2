type Props = {
    selected: string
    opacity?: number
    onSelect: (color: string) => void
    onOpacityChange?: (opacity: number) => void
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

export function ColorPicker({ selected, opacity = 100, onSelect, onOpacityChange }: Props) {
    const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onOpacityChange?.(Number(event.target.value))
    }

    return (
        <div className="color-pallet">
            <div className="color-pallet-list ">
                {COLORS.flat().map((color) => {
                    const isSelected = selected.toLowerCase() === color.toLowerCase()

                    return (
                        <button
                            key={color}
                            className="color-pallet-items"
                            type="button"
                            aria-label={`Select ${color}`}
                            onClick={() => onSelect(color)}
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

            <div className="opacity-title ">Opacity</div>

            <div className="opacity-wrapper">
                <div className="opacity-bar">
                    <div
                        className="opacity-color "
                        style={{
                            background: `linear-gradient(
                                to right,
                                rgba(0, 0, 0, 0),
                                ${selected}
                            )`,
                        }}
                    />

                    <input
                        className="opacity-input-range"
                        type="range"
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={handleOpacityChange}
                        aria-label="Opacity"
                    />

                    <div
                        className="opacity-input-handle"
                        style={{
                            left: `calc(${opacity}% - 5px)`,
                        }}
                    />
                </div>

                <div className="opacity-input">{opacity}%</div>
            </div>
        </div>
    )
}
