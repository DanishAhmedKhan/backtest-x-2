import { useToolbar } from '../../ui/toolbar/useToolbar'

export function ToolbarSeparator() {
    const { direction } = useToolbar()

    return <div className={`toolbar-separator toolbar-separator-${direction}`} />
}
