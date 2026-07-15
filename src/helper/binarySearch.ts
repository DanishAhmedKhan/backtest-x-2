export function binarySearch(times: number[], target: number) {
    let left = 0
    let right = times.length - 1

    while (left <= right) {
        const mid = (left + right) >> 1

        if (times[mid] < target) {
            left = mid + 1
        } else if (times[mid] > target) {
            right = mid - 1
        } else {
            return { left: mid, right: mid, exact: true }
        }
    }

    return { left, right, exact: false }
}
