export function findNextAvailableTime(times: number[], target: number): number | null {
    let left = 0
    let right = times.length - 1

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (times[mid] < target) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }

    return left < times.length ? times[left] : null
}
