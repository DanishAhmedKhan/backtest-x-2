export type DrawingAction =
    | {
          id: 'delete'
          label: string
          execute: () => void
      }
    | {
          id: 'color'
          label: string
          value: string
          execute: (color: string) => void
      }
    | {
          id: 'line-width'
          label: string
          value: number
          execute: (width: number) => void
      }
    | {
          id: 'style'
          label: string
          value: string
          execute: (style: string) => void
      }
    | {
          id: 'settings'
          label: string
          execute: () => void
      }
