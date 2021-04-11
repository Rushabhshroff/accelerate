import EventEmitter from "events";
import { IWorkoutExercise, Workout, WorkoutExercise } from "../data/models/Workout";

export default class WorkoutManager {
    static events: EventEmitter = new EventEmitter()
    static workout: Workout | undefined = undefined
    static exercises: WorkoutExercise[] | undefined = undefined
    static startFrom(workout: Workout, exercises: IWorkoutExercise[]) {
        if (WorkoutManager.workout === undefined) {
            WorkoutManager.workout = new Workout();
            WorkoutManager.workout.name = workout.name;
            WorkoutManager.workout.note = workout.note;
            WorkoutManager.exercises = exercises.map((ex) => {
                //@ts-ignore
                delete ex._id
                //@ts-ignore
                delete ex._rev
                //@ts-ignore
                delete ex.timestamp
                for (let s of ex.sets) {
                    delete s.timestamp
                }
                return new WorkoutExercise(ex,true);
            })
            WorkoutManager.workout.startTimestamp = Date.now()
            WorkoutManager.events.emit('change', WorkoutManager.workout)
        }
        return WorkoutManager.workout;
    }
    static start() {
        if (WorkoutManager.workout === undefined) {
            WorkoutManager.workout = new Workout()
            WorkoutManager.exercises = []
            WorkoutManager.workout.startTimestamp = Date.now()
            WorkoutManager.events.emit('change', WorkoutManager.workout)
        }
        return WorkoutManager.workout
    }
    static async finish() {
        if (WorkoutManager.workout) {
            WorkoutManager.workout.endTimestamp = Date.now()
            await WorkoutManager.__save();
        }
        WorkoutManager.events.emit('change', WorkoutManager.workout)
        WorkoutManager.cancel();
    }
    static canSave() {
        if (!WorkoutManager.exercises || WorkoutManager.exercises?.length <= 0) {
            return "Please add some exercises & sets before finishing the workout."
        }
        if (!WorkoutManager.exercises.some((e) => e.sets.some((s) => !WorkoutExercise.isSetEmpty(s)))) {
            return "Please complete some sets before finishing the workout."
        }
        return true;
    }
    private static async __save() {
        if (WorkoutManager.workout && WorkoutManager.exercises) {
            await WorkoutManager.workout.save()
            for (let ex of WorkoutManager.exercises) {
                ex.filterOutEmptySets();
                ex.timestamp = WorkoutManager.workout.endTimestamp
                await ex.save()
            }
        }
    }
    static cancel() {
        WorkoutManager.workout = undefined;
        WorkoutManager.exercises = undefined;
        WorkoutManager.events.emit('change', WorkoutManager.workout)
    }
}