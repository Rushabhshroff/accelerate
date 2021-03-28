import { v1 } from 'uuid'
import { ActiveExerciseProps } from '..';
import { AppSettings, Duration, Units } from '../../utils';
import { oneRM } from '../../utils/body-calculators';
import { ExerciseValues } from './exercise-values';
export interface WorkoutSet {
    _id: string,
    setType: 'normal' | 'drop' | 'failure' | 'warmup',
    reps?: number,
    time?: string,
    distance?: number,
    weight?: number,
    timestamp?: number,
    [key: string]: any
}

export class WorkoutSet implements WorkoutSet {
    _id: string;
    setType: "normal" | "drop" | "failure" | "warmup" = 'normal';
    reps?: number | undefined;
    time?: string | undefined;
    distance?: number | undefined;
    weight?: number | undefined;
    timestamp?: number | undefined;
    constructor() {
        this._id = v1()
    }
    get done() {
        return this.timestamp != undefined
    }
    toExerciseValue(currentUnits: Units) {
        return {
            reps: this.reps || 0,
            time: this.time ? Duration.fromHHMMSS(this.time).milliseconds() : 0,
            distance: this.distance ? Units.convert(currentUnits.distance, AppSettings.current.units.distance, this.distance) : 0,
            weight: this.weight ? Units.convert(currentUnits.weight, AppSettings.current.units.weight, this.weight) : 0,
            volume: this.volume(currentUnits)
        } as ExerciseValues
    }
    volume(currentUnits: Units) {
        return (this.weight ? Units.convert(currentUnits.weight, AppSettings.current.units.weight, this.weight) : 0) * (this.reps || 0)
    }
    oneRM() {
        return oneRM(this.weight || 0, this.reps || 0)
    }
    validate(props: ActiveExerciseProps) {
        for (let key in props) {
            if (this[key] == undefined) {
                return false
            }
        }
        return true;
    }
}