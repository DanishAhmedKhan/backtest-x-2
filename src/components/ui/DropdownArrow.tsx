import svg from '../../svg/svg'

type Props = {
    open?: boolean
    size?: number
}

export function DropdownArrow({ open = false, size = 10 }: Props) {
    return (
        <div
            className={`dropdown-arrow ${open ? 'open' : ''}`}
            style={{
                width: size,
                height: size / 2,
            }}
            dangerouslySetInnerHTML={{
                __html: svg.dropdown,
            }}
        />
    )
}
