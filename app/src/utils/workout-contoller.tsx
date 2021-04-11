import { Exercise, Workout } from "../database/models";
import { PowerManagement } from '@ionic-native/power-management'
import EventEmitter from "events";
export class WorkoutController {
    static events = new EventEmitter()
    static active?: Workout
    static exercises: Exercise[]
    static wakelockAcquired = false;
    static reset() {
        WorkoutController.active = undefined;
        WorkoutController.exercises = []
        if (WorkoutController.wakelockAcquired) {
            PowerManagement.release();
        }
        WorkoutController.events.emit('change')
    }
}