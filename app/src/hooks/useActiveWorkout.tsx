import { useEffect, useState } from "react";
import { IWorkout } from "../database";
import { WorkoutController } from "../utils";

export function useActiveWorkout() {
    const [workout, SetWorkout] = useState(WorkoutController.active)
    const [exercises,SetExercises] = useState(WorkoutController.exercises)
    useEffect(() => {
        const OnChange = () => {
            SetWorkout(WorkoutController.active)
            SetExercises(WorkoutController.exercises)
        }
        WorkoutController.events.on('change', OnChange);
        return () => {
            WorkoutController.events.off('change', OnChange);
        }
    }, [])
    return {workout,exercises};
}