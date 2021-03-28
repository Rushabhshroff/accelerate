import model from "../model";
import { WorkoutSet } from "./workout-set";
import DataSet from '../dataset.json'
import { AppSettings } from "../../utils";
import { ExerciseData } from "./exercise-data";
import { Units } from "../../utils/units";
import { Workout } from "./workout";
import { ExerciseValues } from "./exercise-values";
import { ExercisePropsMap } from "..";



export interface IExercise {
    exerciseId: string,
    workoutId: string,
    exerciseName: string,
    bodyPart: BodyPart,
    category: ExerciseCategory,
    sets: WorkoutSet[]
    note?: string,
    restTime?: number,
    superset?: string,
    units: Units,
    timestamp?: number
}


export class Exercise extends model<IExercise>('exercise') {
    constructor(ob?: IExercise) {
        super(ob)
    }
    static from(exerciseId: string, workoutId: string) {
        let ex = ExerciseData.find(exerciseId);
        if (!ex) {
            throw new Error("Exercise Not Found")
        }
        return new Exercise({
            exerciseName: ex.exerciseName,
            exerciseId: ex._id,
            workoutId: workoutId,
            bodyPart: ex.bodyPart as BodyPart,
            category: ex.category as ExerciseCategory,
            sets: [new WorkoutSet()],
            units: AppSettings.current.units
        })
    }
    sum() {
        let res = ExerciseValues.default()
        this.sets.forEach((set) => {
            let val = set.toExerciseValue(this.units)
            ExerciseValues.Add(res, val)
        })
        res.sets = this.sets.filter((s) => s.timestamp != undefined).length
        console.log(res);
        return res;
    }
    max() {
        let res = ExerciseValues.default()
        this.sets.forEach((set) => {
            let val = set.toExerciseValue(this.units)
            ExerciseValues.ResolveMax(res, val)
        })
        return res;
    }
    workout() {
        return Workout.findById(this.workoutId).then((res) => new Workout(res))
    }
    bestOnRm() {
        return this.sets.reduce((a, b) => {
            let aa = a.oneRM()
            let bb = b.oneRM()
            return aa > bb ? a : b
        }).oneRM()
    }
    validateSets() {
        let enables = ExercisePropsMap[this.category]
        for (let set of this.sets) {
            if (!set.validate(enables)) {
                return false
            }
        }
        return true;
    }
    filterSets() {
        let enables = ExercisePropsMap[this.category]
        this.sets = this.sets.filter((s) => s.validate(enables))
    }
}

export type ExerciseCategory = 'barbell' | 'dumbbell' | 'machine' | 'weighted-bodyweight' | 'assisted-body' | 'reps-only' | 'cardio' | 'duration'
export type BodyPart = 'none' | 'core' | 'arms' | 'back' | 'chest' | 'legs' | 'shoulders' | 'other' | 'olympic' | 'full-body' | 'cardio'
export const ExerciseCategories = {
    'barbell': 'Barbell',
    'dumbbell': 'Dumbbell',
    'machine': 'Machine/Other',
    'weighted-bodyweight': 'Weighted Body Weight',
    'assisted-body': 'Assisted Body',
    'reps-only': 'Repetitons Only',
    'cardio': 'Cardio',
    'duration': "Duration"
}

export const BodyParts = {
    'none': 'None',
    'core': 'Core',
    'arms': 'Arms',
    'chest': 'Chest',
    'legs': 'Legs',
    'back': "Back",
    'shoulders': 'Shoulders',
    'other': 'Others',
    'olympic': 'Olympic',
    'full-body': 'Full Body',
    'cardio': 'Cardio'
}

