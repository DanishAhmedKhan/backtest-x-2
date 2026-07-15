import { binarySearch } from '../../helper/binarySearch'

export function findNearestTime(times: number[], target: number) {
    if (!times.length) return null

    const { right } = binarySearch(times, target)

    return right >= 0 ? times[right] : times[0]
}
