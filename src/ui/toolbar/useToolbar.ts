import { useContext } from 'react'

import { ToolbarContext } from './ToolbarContext'

export function useToolbar() {
    return useContext(ToolbarContext)
}
