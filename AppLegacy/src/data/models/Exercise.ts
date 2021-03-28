import exerciseData from '../../dataset.json'
import model from '../Model'
import {EventEmitter} from 'events'
export interface IExercise {
    _id: string,
    exerciseName: string,
    category: ExerciseCategory,
    bodyPart: BodyPart,
    instructions?: string[],
    mediaType?: 'image' | 'video' | '',
    thumbnail?: string,
    videoUrl?: string,
    imageUrl?: string
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
export const ExerciseMap: {
    [key: string]: {
        weight?: true,
        reps?: true,
        time?: true,
        distance?: true
    }
} = {
    'barbell': {
        weight: true,
        reps: true
    },
    'dumbbell': {
        weight: true,
        reps: true
    },
    'machine': {
        weight: true,
        reps: true
    },
    'weighted-bodyweight': {
        weight: true,
        reps: true
    },
    'assisted-body': {
        weight: true,
        reps: true
    },
    'reps-only': {
        reps: true
    },
    'cardio': {
        distance: true,
        time: true
    },
    'duration': {
        time: true
    }
}

export class ExerciseData {
    static events = new EventEmitter();
    static data = exerciseData;
    static get _map() {
        let ob: { [key: string]: IExercise | undefined } = {}
        ExerciseData.data.forEach((ex) => {
            ob[ex._id] = ex as IExercise
        })
        return ob;
    }
    static map = ExerciseData._map
    
}

export default class Exercise extends model<IExercise>('exercise') {
    static async Add(name: string, category: string, bodyPart: string) {
        let ex = new Exercise();
        ex.exerciseName = name
        ex.category = category as ExerciseCategory;
        ex.bodyPart = bodyPart as BodyPart;
        ex.instructions = [];
        ex.mediaType = ''
        await ex.save()
        //@ts-ignore
        ExerciseData.data.push(ex);
        ExerciseData.data = ExerciseData.data.sort((a, b) => a.exerciseName.localeCompare(b.exerciseName))
        ExerciseData.map = ExerciseData._map
        ExerciseData.events.emit('change')
    }
    static async LoadAll() {
        let exs = await Exercise.getAll();
        //@ts-ignore
        ExerciseData.data = ExerciseData.data.concat(exs.docs).sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
        ExerciseData.map = ExerciseData._map
        ExerciseData.events.emit('change')
    }
}