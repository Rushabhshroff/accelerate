import { BodyPart, ExerciseCategory } from "./exercise";
import Dataset from '../dataset.json'
import model from "../model";
import { Exercise } from "..";
export interface IExerciseInfo {
    _id: string,
    exerciseName: string,
    instructions: string[],
    category: ExerciseCategory,
    bodyPart: BodyPart,
    mediaType: 'image' | 'video' | '',
    thumbnail?: string,
    imageUrl?: string,
    videoUrl?: string
}

export class ExerciseInfo extends model<IExerciseInfo>('exercise_info') {
    getHistory() {
        return Exercise.find({
            selector: {
                exerciseId: this._id
            }
        }).then((res) => {
            return res.docs.map((d => new Exercise(d)))
        })
    }
}

export class ExerciseData {
    static dataset: ExerciseInfo[] = Dataset.map((i) => new ExerciseInfo(i as IExerciseInfo))
    static async Load() {
        let data = await ExerciseInfo.getAll()
        ExerciseData.dataset.concat(data.docs.map(d => new ExerciseInfo(d)));
        ExerciseData.dataset = ExerciseData.dataset.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
    }
    static find(id: string) {
        return ExerciseData.dataset.find((e) => e._id == id)
    }
}