import { v1 } from 'uuid'
import { ActiveExerciseProps, ExerciseCategory } from '..';
import { AppSettings, Duration, Unit, Units } from '../../utils';
import { oneRM } from '../../utils/body-calculators';
import { ExerciseValues } from './exercise-values';
export interface WorkoutSet {
    _id: string,
    setType: 'normal' | 'drop' | 'failure' | 'warmup',
    reps?: Unit,
    time?: string,
    distance?: Unit,
    weight?: Unit,
    timestamp?: number,
    [key: string]: any
}

export class WorkoutSet implements WorkoutSet {
    _id: string;
    setType: "normal" | "drop" | "failure" | "warmup" = 'normal';
    reps?: Unit | undefined;
    time?: string | undefined;
    distance?: Unit | undefined;
    weight?: Unit | undefined;
    timestamp?: number | undefined;
    constructor(ob?: WorkoutSet) {
        this._id = v1()
        if (ob) {
            Object.assign(this, ob)
            this.weight = this.weight ? new Unit(this.weight) : undefined;
            this.distance = this.distance ? new Unit(this.distance) : undefined;
            this.reps = this.reps ? new Unit(this.reps) : undefined;
        }
    }
    get done() {
        return this.timestamp != undefined
    }
    toExerciseValue() {
        return {
            reps: this.reps || 0,
            time: this.time ? Duration.fromHHMMSS(this.time).milliseconds() : 0,
            distance: this.distance?.current?.value || 0,
            weight: this.weight?.current?.value || 0,
            volume: this.volume()
        } as ExerciseValues
    }
    volume() {
        return (this.weight?.current?.value || 0) * (this.reps?.value || 0)
    }
    oneRM() {
        return oneRM(this.weight?.value || 0, this.reps?.value || 0)
    }
    validate(props: ActiveExerciseProps) {
        for (let key in props) {
            if (this[key] == undefined) {
                return false
            }
        }
        return true;
    }
    toString(category: ExerciseCategory) {
        switch (category) {
            case 'assisted-body':
            case 'weight-reps':
            case 'weighted-bodyweight':
                return `${this.weight?.toString()} x ${this.reps?.value}`
            case 'reps-only':
                return `${this.reps}`
            case 'distance-duration':
                return `${this.distance?.toString()} | ${this.time}`
            case 'duration':
                return `${this.time}`
        }
    }
}