import { ToolbarProvider } from './ToolbarProvider'
import type { ToolbarDirection } from './types'

import './toolbar.css'

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
