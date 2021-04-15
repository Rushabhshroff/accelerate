import { Exercise, Workout } from "../../database";
import { IWorkoutRoutine, WorkoutRoutine } from "../../database/models/workout-routine";

export async function SaveWorkout(workout: Workout, exercises: Exercise[], liveMode?: boolean, asTemplate?: boolean) {
    if (asTemplate) {
        CreateRoutine(workout.name, exercises, workout._id, workout._rev)
    } else {
        exercises = exercises.filter((e) => e.validateSets())
        if (exercises.length > 0) {
            for (let e of exercises) {
                e.timestamp = workout.startTimestamp
                e.sets.forEach((s) => {
                    if (!s.timestamp) {
                        s.timestamp = e.timestamp
                    }
                })
                await e.save()
            }
        } else {
            throw new Error("Please one or more Add Exercises & Sets.")
        }
        if (liveMode) {
            workout.endTimestamp = Date.now()
        }
        await workout.save()
    }
}

export function ValidateWorkout(exercises: Exercise[]) {
    for (let ex of exercises) {
        if (!ex.validateSets()) {
            return false
        }
    }
    return true;
}

export async function DeleteWorkout(workout: Workout, exercises: Exercise[]) {
    for (let ex of exercises) {
        await ex.delete()
    }
    await workout.delete()
}

export async function CreateRoutine(name: string, exercises: Exercise[], _id?: string, _rev?: string) {
    let exs = exercises.map((ex: any) => {
        delete ex._id
        delete ex._rev
        delete ex._deleted
        delete ex.timestamp
        return ex
    })
    let ob = { name: name, exercises: exs, _id, _rev } as any
    let routine = new WorkoutRoutine(ob)
    console.log(routine);
    await routine.save()
}

export function RoutineToWorkout(routine?: IWorkoutRoutine, withId?: boolean) {
    let workout = new Workout({ name: routine?.name || 'Workout', startTimestamp: Date.now() })
    let exercises = routine?.exercises.map((ex) => {
        return new Exercise({
            ...ex,
            workoutId: workout._id
        })
    })
    console.log(routine);
    if (withId && routine) {
        if (routine._id) {
            workout._id = routine._id
            if (routine._rev) {
                workout._rev = routine._rev
            }
        }
    }
    return {
        workout: workout,
        exercises: exercises || []
    }
}