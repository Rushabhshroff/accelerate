import { useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { EditWorkout } from '../../../components'
import { Loader } from '../../../components/core/Loader'
import { RoutineToWorkout } from '../../../components/workout/workout-functions'
import { Exercise, Workout } from '../../../database'
import { WorkoutRoutine } from '../../../database/models/workout-routine'

export interface RoutineEditPage extends RouteComponentProps<{ id: string }> {

}
export const RoutineEditPage: React.FC<RoutineEditPage> = (props) => {
    const router = useIonRouter()
    const [workout, SetWorkout] = useState<undefined | Workout>(undefined)
    const [exercises, SetExercises] = useState<Exercise[]>([])
    useEffect(() => {
        FetchWorkoutDetails()
    }, [])
    const FetchWorkoutDetails = () => {
        return (async () => {
            let r = await WorkoutRoutine.findById(props.match.params.id)
            const {exercises,workout} = RoutineToWorkout(r,true)
            SetExercises(exercises)
            SetWorkout(workout)
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
        <EditWorkout liveMode={false} workout={workout} exercises={exercises}  templateMode={true}/>
    )
}