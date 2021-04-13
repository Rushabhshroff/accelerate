import { useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { EditWorkout } from '../../components'
import { Loader } from '../../components/core/Loader'
import { Exercise, Workout } from '../../database'

export interface WorkoutEditPage extends RouteComponentProps<{ id: string }> {

}
export const WorkoutEditPage: React.FC<WorkoutEditPage> = (props) => {
    const router = useIonRouter()
    const [workout, SetWorkout] = useState<undefined | Workout>(undefined)
    const [exercises, SetExercises] = useState<Exercise[]>([])
    useEffect(() => {
        FetchWorkoutDetails()
    }, [])
    const FetchWorkoutDetails = () => {
        return (async () => {
            let w = new Workout(await Workout.findById(props.match.params.id));
            let exs = await w.exercises()
            SetExercises(exs)
            SetWorkout(w)
        })().catch((err) => {
            router.goBack()
        })
    }
    if (!workout) {
        return (
            <Loader />
        )
    }
    return (
        <EditWorkout liveMode={false} workout={workout} exercises={exercises} />
    )
}