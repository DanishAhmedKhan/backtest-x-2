import { createContext } from 'react'

export type ToolbarDirection = 'horizontal' | 'vertical'

export interface ToolbarContextValue {
    direction: ToolbarDirection
}

export const ToolbarContext = createContext<ToolbarContextValue>({
    direction: 'horizontal',
})
