import type { ReactNode } from 'react'
import type { ToolbarDirection } from './types'
import { ToolbarContext } from '../../ui/toolbar/ToolbarContext'

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
