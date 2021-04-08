import { Exercise } from "../../database";
import { Duration } from "../../utils";
import { ChartDuration } from "../charts";
export function MaxReps(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().reps
        return [o.timestamp || 0, max]
    })
    return [{
        type: 'area',
        name: "Max Reps",
        data
    }]
}

export function TotalReps(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().reps
        return [o.timestamp || 0, sum]
    })
    return [{
        type: 'area',
        name: "Total Reps",
        data
    }]
}

export function MaxWeight(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().weight
        return [o.timestamp || 0, max]
    })
    return [{
        type: 'area',
        name: "Max Weight",
        data
    }]
}

export function TotalWeight(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().weight
        return [o.timestamp || 0, sum]
    })
    return [{
        type: 'area',
        name: "Total Weight",
        data
    }]
}

export function MaxVolume(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().volume
        return [o.timestamp || 0, max]
    })
    return [{
        type: 'line',
        name: "Max Volume",
        data
    }]
}

export function TotalVolume(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().volume
        return [o.timestamp || 0, sum]
    })
    return [{
        type: 'line',
        name: "Total Volume",
        data
    }]
}

export function MaxDistance(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().distance
        return [o.timestamp || 0, new Duration(max).toHHMMSS()]
    })
    return [{
        type: 'line',
        name: "Max Distance",
        data
    }]
}

export function TotalDistance(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().distance
        return [o.timestamp || 0, new Duration(sum).toHHMMSS()]
    })
    return [{
        type: 'line',
        name:"Total Distance",
        data
    }]
}

export function MaxTime(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let max = o.max().time
        return [o.timestamp || 0, new Duration(max).toHHMMSS()]
    })
    return [{
        type: 'line',
        name:"Max Time",
        data
    }]
}

export function TotalTime(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let sum = o.sum().time
        return [o.timestamp || 0, new Duration(sum).toHHMMSS()]
    })
    return [{
        type: 'line',
        name:"Total Time",
        data
    }]
}

export function OneRM(history: Exercise[], duration: ChartDuration) {
    let startDate = Duration.toStartDate(duration);
    let data = history.filter((h) => h.timestamp || 0 > startDate).map((o) => {
        let rm = o.bestOnRm()
        return [o.timestamp || 0, rm]
    })
    return [{
        type: 'line',
        name:"1RM",
        data
    }]
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