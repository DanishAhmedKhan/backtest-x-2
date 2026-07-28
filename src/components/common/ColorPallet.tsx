type Props = {
    selected: string
    onSelect: (color: string) => void
}

const COLORS = [
    '#000000',
    '#ffffff',

    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',

    '#7f1d1d',
    '#78350f',
    '#365314',
    '#164e63',
    '#1e3a8a',
    '#4c1d95',
]

export function ColorPalette({ selected, onSelect }: Props) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 24px)',
                gap: 6,
            }}
        >
            {COLORS.map((color) => (
                <button
                    key={color}
                    onClick={() => onSelect(color)}
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: selected === color ? '2px solid white' : '1px solid #555',
                        background: color,
                        cursor: 'pointer',
                    }}
                />
            ))}
        </div>
    )
}
