import { Exercise, Workout } from "../database/models";

export class WorkoutController {
    static active?: Workout
    static exercises: Exercise[]
    static reset() {
        WorkoutController.active = undefined;
        WorkoutController.exercises = []
    }
}