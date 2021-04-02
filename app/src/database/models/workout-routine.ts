import { IExercise } from "..";
import model from "../model";

export interface IWorkoutRoutine {
    name: string,
    exercises: IExercise[]
}

export class WorkoutRoutine extends model<IWorkoutRoutine>('workout_routine'){
    
}