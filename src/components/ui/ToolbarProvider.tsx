import type { ReactNode } from 'react'
import { ToolbarContext } from '../../ui/toolbar/ToolbarContext'
import type { ToolbarDirection } from './Toolbar'

type Props = {
    direction: ToolbarDirection
    children: ReactNode
}

export function ToolbarProvider({ direction, children }: Props) {
    return (
        <ToolbarContext.Provider
            value={{
                direction,
            }}
        >
            {children}
        </ToolbarContext.Provider>
    )
}
