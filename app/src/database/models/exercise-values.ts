import { AppSettings, Units } from "../../utils";

export interface ExerciseValues {
    reps: number,
    distance: number,
    weight: number,
    time: number,
    sets: number,
    volume: number,
    [key: string]: number
}

export class ExerciseValues {
    static default = (): ExerciseValues => {
        return {
            reps: 0,
            distance: 0,
            weight: 0,
            time: 0,
            sets: 0,
            volume: 0
        }
    }
    static Add(a: ExerciseValues, b: ExerciseValues) {
        for (let key in a) {
            if (b[key]) {
                a[key] += b[key]
            }
        }
        return a;
    }
    static ResolveMax(a: ExerciseValues, b: ExerciseValues) {
        for (let key in a) {
            if (b[key]) {
                a[key] = a[key] > b[key] ? a[key] : b[key]
            }
        }
        return a;
    }
}