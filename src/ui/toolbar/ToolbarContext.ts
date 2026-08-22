import { createContext } from 'react'
import type { ToolbarDirection } from '../../components/ui/Toolbar'

export interface ToolbarContextValue {
    direction: ToolbarDirection
}

export const ToolbarContext = createContext<ToolbarContextValue>({
    direction: 'horizontal',
})
