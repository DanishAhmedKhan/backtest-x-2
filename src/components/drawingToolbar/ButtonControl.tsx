import type { ToolbarItem } from '../../drawing/toolbar/ToolbarItem'

type Props = {
    item: ToolbarItem
}

function getButtonLabel(id: string) {
    switch (id) {
        case 'delete':
            return '🗑'

        case 'settings':
            return '⚙'

        default:
            return '•'
    }
}

export function ButtonControl({ item }: Props) {
    return (
        <button
            title={item.tooltip}
            onClick={item.execute}
            style={{
                width: 32,
                height: 32,
                border: 'none',
                borderRadius: 6,
                background: 'transparent',
                color: '#ddd',
                cursor: 'pointer',
                fontSize: 16,
            }}
        >
            {getButtonLabel(item.id)}
        </button>
    )
}
