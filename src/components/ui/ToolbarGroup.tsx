import { useToolbar } from '../../ui/toolbar/useToolbar'

type Props = {
    children: React.ReactNode
}

export function ToolbarGroup({ children }: Props) {
    const { direction } = useToolbar()

    return <div className={`toolbar-group toolbar-group-${direction}`}>{children}</div>
}
