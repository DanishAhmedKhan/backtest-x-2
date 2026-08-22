export const toDate = (time: number) => {
    return new Date(time * 1000)
}

export const printDate = (time: number) => {
    const date = toDate(time)
    console.log(date)
}

export const formatDate = (time: number) => {
    const date = toDate(time)

    const weekday = date.toLocaleString('en-US', { weekday: 'short' })
    const day = date.toLocaleString('en-US', { day: '2-digit' })
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.toLocaleString('en-US', { year: '2-digit' })

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${weekday} ${day} ${month} '${year}  ${hours}:${minutes}:${seconds}`
}
