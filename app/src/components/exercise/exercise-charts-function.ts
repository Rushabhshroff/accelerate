import { Exercise } from "../../database";
import { Duration } from "../../utils";
export type ChartDuration = '3m' | '6m' | '1y' | 'L'
export function MaxReps(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().reps
        return [o.timestamp || 0, max]
    })
}

export function TotalReps(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().reps
        return [o.timestamp || 0, sum]
    })
}

export function MaxWeight(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().weight
        return [o.timestamp || 0, max]
    })
}

export function TotalWeight(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().weight
        return [o.timestamp || 0, sum]
    })
}

export function MaxVolume(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().volume
        return [o.timestamp || 0, max]
    })
}

export function TotalVolume(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().volume
        return [o.timestamp || 0, sum]
    })
}

export function MaxDistance(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().distance
        return [o.timestamp || 0, new Duration(max).toHHMMSS()]
    })
}

export function TotalDistance(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().distance
        return [o.timestamp || 0, new Duration(sum).toHHMMSS()]
    })
}

export function MaxTime(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().time
        return [o.timestamp || 0, new Duration(max).toHHMMSS()]
    })
}

export function TotalTime(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().time
        return [o.timestamp || 0, new Duration(sum).toHHMMSS()]
    })
}

export function OneRM(history: Exercise[], duration: ChartDuration) {
    let startDate = toStartDate(duration);
    return history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let rm = o.bestOnRm()
        return [o.timestamp || 0, rm]
    })
}
export function toStartDate(duration: ChartDuration) {
    let now = new Date();
    switch (duration) {
        case '3m':
            return now.setMonth(now.getMonth() - 3)
        case '6m':
            return now.setMonth(now.getMonth() - 6)
        case '1y':
            return now.setMonth(now.getMonth() - 12)
        case 'L':
            return now.setTime(0)
    }
}

export const ChartFunctionMap = {
    'max-reps': MaxReps,
    'total-reps': TotalReps,
    '1RM': OneRM,
    'max-weight': MaxWeight,
    'total-weight': TotalWeight,
    'max-volume': MaxVolume,
    'total-volume': TotalVolume,
    'max-time': MaxTime,
    'total-time': TotalTime,
    'max-distance': MaxDistance,
    'total-distance': TotalDistance
}

export type ChartType = 'max-reps' | 'total-reps' | '1RM' | 'max-weight' | 'total-weight' | 'max-volume' | 'total-volume' | 'max-time' | 'total-time' | 'max-distance' | 'total-distance'