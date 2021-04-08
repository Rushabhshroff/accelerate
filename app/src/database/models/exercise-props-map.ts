import { ChartType } from "../../components/exercise/exercise-charts-function"
export type ActiveExerciseProps = {
    weight?: true,
    reps?: true,
    time?: true,
    distance?: true
}
export const ExercisePropsMap: {
    [key: string]: ActiveExerciseProps
} = {
    'weight-reps':{
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
    'distance-duration': {
        distance: true,
        time: true
    },
    'duration': {
        time: true
    }
}

export const ExerciseGraphOptions: { [key: string]: ChartType[] } = {
    'weight-reps': ['max-reps', 'total-reps', '1RM', 'max-weight', 'total-weight', 'max-volume', 'total-volume'],
    'weighted-bodyweight': ['max-reps', 'total-reps', '1RM', 'max-weight', 'total-weight', 'max-volume', 'total-volume'],
    'assisted-body': ['max-reps', 'total-reps', '1RM', 'max-weight', 'total-weight', 'max-volume', 'total-volume'],
    'reps-only': ['max-reps', 'total-reps'],
    'duration-reps': ['max-time', 'total-time', 'max-distance', 'total-distance'],
    'duration': ['max-time', 'total-time'],
}