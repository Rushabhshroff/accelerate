import { IExercise } from "..";
import { Document } from "../document";
import model from "../model";

export interface IWorkoutRoutine extends Document {
    name: string,
    exercises: IExercise[]
}

export class WorkoutRoutine extends model<IWorkoutRoutine>('workout_routine'){
    
}