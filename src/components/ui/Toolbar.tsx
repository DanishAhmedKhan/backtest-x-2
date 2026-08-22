import { ToolbarProvider } from './ToolbarProvider'

export type ToolbarDirection = 'horizontal' | 'vertical'

type Props = {
    children: React.ReactNode
    direction?: ToolbarDirection
}

export function Toolbar({ children, direction = 'horizontal' }: Props) {
    return (
        <ToolbarProvider direction={direction}>
            <div className={`toolbar toolbar-${direction}`}>{children}</div>
        </ToolbarProvider>
    )
}
