import { useEffect, useReducer, useState } from "react";
import { Workout, WorkoutExercise } from "../data/models/Workout";
import WorkoutManager from "../utils/WorkoutManager";

function WorkoutReducer(state: Workout | undefined, action: Partial<Workout> | undefined) {
    if (!action || !WorkoutManager.workout) {
        return undefined;
    }
    Object.assign(WorkoutManager.workout, action);
    return {
        ...state,
        ...action
    } as Workout
}

function ExerciseReducer(state: WorkoutExercise[] | undefined, action: { data: WorkoutExercise[] | undefined, action: 'add' | 'delete' }) {

    if (!action.data) {
        return undefined;
    } else {
        let x: WorkoutExercise[] | undefined = [];
        if (action.action === 'add') {
            x = state?.concat(action.data)
        } else {
            x = state?.filter((k) => !action.data?.some((d) => d._id === k._id));
        }
        WorkoutManager.exercises = x;
        return x;
    }
}
export default function useWorkout() {
    const [workout, SetWorkout] = useReducer(WorkoutReducer, WorkoutManager.workout)
    const [exercises, SetExercises] = useReducer(ExerciseReducer, WorkoutManager.exercises)
    useEffect(() => {
        const OnChange = (workout?: Workout) => {
            SetWorkout(workout);
        }
        WorkoutManager.events.on('change', OnChange)
        return () => {
            WorkoutManager.events.off('change', OnChange);
        }
    }, [])
    return { workout, SetWorkout, exercises, SetExercises }
}