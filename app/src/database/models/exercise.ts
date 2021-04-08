import model from "../model";
import { WorkoutSet } from "./workout-set";
import { AppSettings } from "../../utils";
import { ExerciseData } from "./exercise-data";
import { Units } from "../../utils/units";
import { Workout } from "./workout";
import { ExerciseValues } from "./exercise-values";
import { ExercisePropsMap } from "..";
import { Document } from "../document";



export interface IExercise extends Document {
    exerciseId: string,
    workoutId: string,
    exerciseName: string,
    bodyPart: BodyPart,
    category: ExerciseCategory,
    sets: WorkoutSet[]
    note?: string,
    restTime?: number,
    superset?: string,
    units: Partial<Units>,
    timestamp?: number
}


export class Exercise extends model<IExercise>('exercise') {
    constructor(ob?: Omit<IExercise,"_id">) {
        super(ob)
        if (ob) {
            this.sets = this.sets.map((s) => new WorkoutSet(s))
        }
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
            units: {}
        })
    }
    sum() {
        let res = ExerciseValues.default()
        this.sets.forEach((set) => {
            let val = set.toExerciseValue()
            ExerciseValues.Add(res, val)
        })
        res.sets = this.sets.filter((s) => s.timestamp != undefined).length
        return res;
    }
    max() {
        let res = ExerciseValues.default()
        this.sets.forEach((set) => {
            let val = set.toExerciseValue()
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
    previous() {
        return Exercise.find({
            selector: {
                timestamp: { $gt: true },
                exerciseId: this.exerciseId
            },
            sort: [{ timestamp: 'desc' }],
            limit: 1
        }).then((res) => {
            if (res.docs.length > 0) {
                return new Exercise(res.docs[0])
            } else {
                return undefined
            }
        }).catch((err) => {
            console.log(err)
            return undefined;
        })
    }
    static clone(ob: Exercise) {
        let n = Object.assign({}, ob) as any
        delete n._id; delete n._rev; delete n._deleted;
        return new Exercise(n);
    }
}

export type ExerciseCategory = 'weight-reps' | 'weighted-bodyweight' | 'assisted-body' | 'reps-only' | 'distance-duration' | 'duration'
export type BodyPart = 'none' | 'core' | 'biceps' | 'triceps' | 'glutes' | 'back' | 'chest' | 'legs' | 'shoulders' | 'other' | 'olympic' | 'full-body' | 'cardio'
export const ExerciseCategories: any = {
    'weight-reps': 'Weights & Reps',
    'weighted-bodyweight': 'Weighted BodyWeight',
    'assisted-body': 'Assisted Body',
    'reps-only': 'Repetitons Only',
    'distance-duration': 'Distance & Duration',
    'duration': "Duration"
}

export const BodyParts: any = {
    'none': 'None',
    'core': 'Core',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'glutes': "Glutes",
    'chest': 'Chest',
    'legs': 'Legs',
    'back': "Back",
    'shoulders': 'Shoulders',
    'other': 'Others',
    'olympic': 'Olympic',
    'full-body': 'Full Body',
    'cardio': 'Cardio'
}

export const ExerciseEquipments: any = {
    'none': 'None',
    'barbell': 'Barbell',
    'dumbbell': 'Dumbbell',
    'machine': 'Machine',
    'kettlebell': 'Kettlebell',
    'band': 'Band',
    'cable': 'Cable',
    'plate': 'Plate'
}