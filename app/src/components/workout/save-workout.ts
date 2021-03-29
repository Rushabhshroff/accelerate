import { Exercise, Workout } from "../../database";

export async function SaveWorkout(workout: Workout, exercises: Exercise[], asTemplate?: boolean) {
    if (asTemplate) {

    } else {
        let w = Workout.clone(workout) as Workout;
        let exs: Exercise[] = []
        for (let ex of exercises) {
            let e = new Exercise(Exercise.clone(ex));
            e.filterSets();
            if (e.sets.length > 0) {
                e.timestamp = w.startTimestamp
                e.workoutId = w._id
                await e.save()
                exs.push(e)
            }
        }
        exs = exs.filter((e) => e.sets.length > 0);
        if (exs.length > 0) {
            await w.save()
        } else {
            throw new Error("Please complete few exercises and sets to save the workout.")
        }
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