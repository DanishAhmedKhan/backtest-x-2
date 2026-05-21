export type ReplayState = {
    isPlaying: boolean
    speed: number

    currentTime: number | null

    startTime: number | null
    endTime: number | null
}
