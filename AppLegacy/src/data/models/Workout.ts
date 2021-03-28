import Database from "../../Database";
import { Settings } from "../../pages/Settings/hook";
import model from "../Model";
import { BodyPart, ExerciseCategory, ExerciseMap, IExercise } from "./Exercise";
import { Convert, Unit } from "../../utils/Units";
import { convertMS } from "../../utils";
import WorkoutTemplate from "./WorkoutTemplate";
import Time from "../../utils/Time";
export interface IWorkout {
    name: string,
    startTimestamp: number,
    endTimestamp: number,
    note?: string,
    templateId?: string
}

export interface IWorkoutSet {
    _id: string,
    warmup?: boolean,
    reps?: number,
    time?: string,
    distance?: number,
    weight?: number,
    timestamp?: number
}
type Unit = 'metric' | 'imperial'
export interface IWorkoutExercise {
    exerciseId: string,
    workoutId: string,
    exerciseName: string,
    bodyPart: BodyPart,
    category: ExerciseCategory,
    sets: IWorkoutSet[]
    warmupset: IWorkoutSet[]
    note?: { _id: string, text: string }[],
    restTime?: number,
    warmUpRestTimer?: number,
    weightUnit?: 'metric' | 'imperial',
    distanceUnit?: 'metric' | 'imperial',
    sizeUnit?: 'metric' | 'imperial'
    timestamp: number
}

export class Workout extends model<IWorkout>('workout') {
    static findForDate(date: Date) {
        let start = new Date(date).setHours(0, 0, 0, 0);
        let end = new Date(date).setHours(23, 59, 59, 999);
        return Workout.find({
            selector: {
                startTimestamp: {
                    $gte: start
                },
                endTimestamp: {
                    $lte: end
                }
            }
        })
    }
    static fromTemplate(template: WorkoutTemplate) {
        let workout = new Workout();
        workout.name = template.name
        workout.note = template.note;
        return workout;
    }
    async template() {
        if (this.templateId) {
            return WorkoutTemplate.findById(this.templateId)
        }
    }
    exercises() {
        return Database<IWorkoutExercise>().find({
            selector: {
                type: 'workout_exercise',
                workoutId: this._id
            }
        }).then((res) => {
            return res.docs.map((d) => new WorkoutExercise(d))
        })
    }
    timeString() {
        let diff = this.endTimestamp - this.startTimestamp
        let conv = convertMS(diff)
        return `${conv.hour}h ${conv.minute}m ${conv.seconds}S`
    }
    delete() {
        this._deleted = true;
        return this.save()
    }
}

export class WorkoutExercise extends model<IWorkoutExercise>('workout_exercise') {
    constructor(ob?: IWorkoutExercise, forceId?: boolean) {
        super(ob, forceId);
        this.weightUnit = ob?.weightUnit || Settings.current.weightUnit;
        this.distanceUnit = ob?.distanceUnit || Settings.current.distanceUnit;
        this.sizeUnit = ob?.sizeUnit || Settings.current.sizeUnit;
    }
    static isSetEmpty(set: IWorkoutSet) {
        return !set.weight && !set.distance && !set.time
    }
    WorkoutSetToText(set: IWorkoutSet) {
        if (set.weight) {
            return `${set.weight} ${Unit(this.weightUnit, 'weight')} x ${set.reps}`
        } else if (set.distance) {
            return `${set.distance} ${Unit(this.distanceUnit, 'distance')} | ${set.time}`
        }
    }
    workout() {
        return Database<IWorkout>().find({
            selector: {
                type: 'workout',
                _id: this.workoutId
            }
        }).then((res) => res.docs && res.docs.length > 0 ? new Workout(res.docs[0]) : undefined);
    }
    static history(exercise: IExercise) {
        return Database<IWorkoutExercise>().find({
            selector: {
                exerciseId: exercise._id,
                timestamp: { $exists: true }
            },
            sort: [{ timestamp: 'desc' }]
        }).then((res) => res.docs.map((d) => new WorkoutExercise(d)))
    }
    static records(exercise: IExercise, history: WorkoutExercise[]) {
        interface Record { value: number | string, unit?: Unit, text: string, timestamp?: number, type?: 'distance' | 'weight' }
        let maxDistance: Record | undefined = undefined
        let maxWeight: Record | undefined = undefined
        let maxDuration: Record | undefined = undefined;
        let maxReps: Record | undefined = undefined;
        let totalDistance: Record | undefined = undefined;
        let totalWeight: Record | undefined = undefined;
        let totalReps: Record | undefined = undefined;
        let totalDuration: Record | undefined = undefined;
        for (let exercise of history) {
            for (let set of exercise.sets) {
                if (set.distance) {
                    if (maxDistance) {
                        maxDistance = maxDistance.value > set.distance ? maxDistance : {
                            value: Convert(exercise.distanceUnit as Unit, Settings.current.distanceUnit, 'distance', set.distance),
                            text: 'Max Distance',
                            timestamp: set.timestamp,
                            unit: Settings.current.distanceUnit,
                            type: 'distance'
                        }
                    } else {
                        maxDistance = {
                            value: Convert(exercise.distanceUnit as Unit, Settings.current.distanceUnit, 'distance', set.distance),
                            text: 'Max Distance',
                            timestamp: set.timestamp,
                            unit: Settings.current.distanceUnit,
                            type: 'distance'
                        }
                    }
                    if (!totalDistance) {
                        totalDistance = {
                            value: set.distance,
                            text: 'Total Distance',
                            type: 'distance',
                            unit: Settings.current.distanceUnit
                        }
                    } else {
                        //@ts-ignore
                        totalDistance.value += Convert(exercise.distanceUnit as Unit, Settings.current.distanceUnit, 'distance', set.distance)
                    }
                }
                if (set.weight) {
                    if (maxWeight) {
                        maxWeight = maxWeight.value > set.weight ? maxWeight : {
                            value: Convert(exercise.weightUnit as Unit, Settings.current.weightUnit, 'distance', set.weight),
                            text: 'Max Weight',
                            timestamp: set.timestamp,
                            unit: Settings.current.weightUnit,
                            type: 'weight'
                        }
                    } else {
                        maxWeight = {
                            value: Convert(exercise.weightUnit as Unit, Settings.current.weightUnit, 'distance', set.weight),
                            text: 'Max Weight',
                            timestamp: set.timestamp,
                            unit: Settings.current.weightUnit,
                            type: 'weight'
                        }
                    }
                    if (!totalWeight) {
                        totalWeight = {
                            value: set.weight,
                            text: 'Total Weight',
                            type: 'weight',
                            unit: Settings.current.weightUnit
                        }
                    } else {
                        //@ts-ignore
                        totalWeight.value += Convert(exercise.weightUnit as Unit, Settings.current.weightUnit, 'distance', set.weight)
                    }
                }
                if (set.reps) {
                    if (maxReps) {
                        maxReps = maxReps.value > set.reps ? maxReps : {
                            value: set.reps,
                            text: 'Max Reps',
                            timestamp: set.timestamp
                        }
                    } else {
                        maxReps = {
                            value: set.reps,
                            text: 'Max Reps',
                            timestamp: set.timestamp
                        }
                    }
                    if (!totalReps) {
                        totalReps = {
                            value: set.reps,
                            text: 'Total Reps'
                        }
                    } else {
                        //@ts-ignore
                        totalReps.value += set.reps
                    }
                }
                if (set.time) {
                    let time = new Time(set.time).milliseconds()
                    if (maxDuration) {
                        maxDuration = maxDuration.value > time ? maxReps : {
                            value: time,
                            text: 'Max Duration',
                            timestamp: set.timestamp
                        }
                    } else {
                        maxDuration = {
                            value: time,
                            text: 'Max Duration',
                            timestamp: set.timestamp
                        }
                    }
                    if (!totalDuration) {
                        totalDuration = {
                            value: time,
                            text: 'Total Duration'
                        }
                    } else {
                        //@ts-ignore
                        totalDuration.value += time
                    }
                }
            }
        }
        if (totalDuration) {
            //@ts-ignore
            totalDuration.value = Math.round(totalDuration.value / 1000).toHHMMSS()
        }
        return {
            maximums: [maxDistance, maxWeight, maxReps, maxDuration].filter((x) => x !== undefined),
            total: [totalDistance, totalWeight, totalReps, totalDuration].filter((x) => x !== undefined)
        }
    }
    static graphs(exercise: IExercise, history: WorkoutExercise[]) {
        interface Record {
            key: string,
            title: string,
            series: { name: string, data: [number, number][] }[]
        }
        let records: { [key: string]: Record } = {}
        let enables = ExerciseMap[exercise.category];
        let maxSets = Math.max(...history.map((h) => h.sets.length));
        if (enables.weight) {
            records['weight'] = {
                key: 'weight',
                title: `Weight (${Unit(Settings.current.weightUnit, 'weight')})`,
                series: []
            }
        }
        if (enables.distance) {
            records['distance'] = {
                key: 'distance',
                title: `Distance (${Unit(Settings.current.weightUnit, 'distance')})`,
                series: []
            }
        }
        if (enables.reps) {
            records['reps'] = {
                key: 'reps',
                title: 'Reps',
                series: []
            }
        }
        if (enables.time) {
            records['time'] = {
                key: 'time',
                title: 'Time',
                series: []
            }
        }
        for (let ex of history) {
            for (let i = 0; i < maxSets; i++) {
                for (let key in enables) {

                    if (records[key].series.length <= i) {
                        records[key].series.push({ name: `Set ${i + 1}`, data: [] })
                    }
                    if (i < ex.sets.length) {
                        let value: any = undefined
                        if (key === 'weight') {
                            value = Convert(ex.weightUnit || Settings.current.weightUnit, Settings.current.weightUnit, key, ex.sets[i][key] || 0)
                        }
                        if (key === 'distance') {
                            value = Convert(ex.distanceUnit || Settings.current.distanceUnit, Settings.current.distanceUnit, key, ex.sets[i][key] || 0)
                        }
                        //@ts-ignore
                        records[key].series[i].data.push([ex.timestamp, value || ex.sets[i][key]])
                    } else {
                        records[key].series[i].data.push([ex.timestamp, 0])
                    }
                }
            }
        }
        return records;
    }
    recent() {
        return WorkoutExercise.find({
            selector: {
                timestamp: { $gt: true },
                exerciseName: this.exerciseName
            },
            sort: [{
                timestamp: 'desc'
            }],
            limit: 1
        }).then((res) => {
            return res.docs && res.docs.length > 0 ? new WorkoutExercise(res.docs[0]) : undefined
        })
    }
    toText() {
        return `${this.sets.length} X ${this.exerciseName}`
    }
    total() {
        let total = {
            weight: {
                value: 0,
                unit: this.weightUnit || Settings.current.weightUnit
            },
            distance: {
                value: 0,
                unit: this.distanceUnit || Settings.current.distanceUnit
            }

        }
        this.sets.forEach((item) => {
            total.distance.value += (item.distance || 0);
            total.weight.value += (item.weight || 0) * (item.reps || 0)
        })
        return total;
    }
    bestSet() {
        if (this.sets.length <= 0) {
            return;
        }
        let highest = this.sets.reduce((a, b) => {
            if (a.weight && b.weight) {
                return (a.weight * (a.reps || 0)) > (b.weight * (b.reps || 0)) ? a : b
            } else if (a.distance && b.distance) {
                return a.distance > b.distance ? a : b
            } else {
                return a;
            }
        })
        if (highest.weight) {
            return `${highest.weight} ${Unit(this.weightUnit, 'weight')} x ${highest.reps}`
        }
        if (highest.distance) {
            return `${highest.distance} ${Unit(this.distanceUnit, 'distance')}`
        }
    }
    filterOutEmptySets() {
        this.sets = this.sets.filter((s) => !WorkoutExercise.isSetEmpty(s));
    }
    delete() {
        this._deleted = true;
        return this.save()
    }
}