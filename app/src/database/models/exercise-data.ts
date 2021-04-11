import { BodyPart, ExerciseCategory } from "./exercise";
import Dataset from '../dataset.json'
import model from "../model";
import { Exercise, WorkoutSet } from "..";
import { Document } from "../document";
export interface IExerciseInfo extends Document {
    _id: string,
    exerciseName: string,
    instructions: string[],
    category: ExerciseCategory,
    bodyPart: BodyPart,
    mediaType: 'image' | 'video' | '',
    thumbnail?: string,
    imageUrl?: string,
    videoUrl?: string,
    equipment: string,
    custom?: boolean
}

export class ExerciseInfo extends model<IExerciseInfo>('exercise_info') {
    getHistory() {
        return Exercise.find({
            selector: {
                exerciseId: this._id
            }
        }).then((res) => {
            return res.docs.map((d => {
                let e = new Exercise(d)
                e.sets = e.sets.map((s) => new WorkoutSet(s))
                return e;
            }))
        })
    }
}

export class ExerciseData {
    static dataset: ExerciseInfo[] = Dataset.map((i) => new ExerciseInfo(i as IExerciseInfo))
    static async Load() {
        let data = await ExerciseInfo.getAll()
        ExerciseData.dataset = ExerciseData.dataset.concat(data.docs.map(d => new ExerciseInfo(d)));
        ExerciseData.dataset = ExerciseData.dataset.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
    }
    static find(id: string) {
        return ExerciseData.dataset.find((e) => e._id == id)
    }
    static async Create(exercise: any) {
        let info = new ExerciseInfo({
            ...exercise,
            instructions: [],
            mediaType: '',
            custom: true
        })
        await info.save()
        ExerciseData._insert(info);
    }
    private static _insert(info: ExerciseInfo) {
        ExerciseData.dataset.push(info);
        ExerciseData.dataset = ExerciseData.dataset.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
    }
}