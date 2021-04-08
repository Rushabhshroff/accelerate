import { IonCard, IonCol, IonItem, IonText } from '@ionic/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Exercise, Workout } from '../../database'
import { ExerciseValues } from '../../database/models/exercise-values'
import { WorkoutStatsHeader } from './workout-stats-header'

export interface WorkoutHistoryListItem {
    workout: Workout
}
export const WorkoutHistoryListItem: React.FC<WorkoutHistoryListItem> = (props) => {
    const [exercises, SetExercises] = useState<Exercise[]>([])
    const workout = props.workout
    useEffect(() => {
        workout.exercises().then((res) => {
            res = res.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
            SetExercises(res)
        })
    }, [props.workout])
    let summation = () => {
        let sum = Object.assign({}, ExerciseValues.default());
        exercises.forEach((ex) => {
            ExerciseValues.Add(sum, ex.sum());
        })
        return sum
    }
    let more = exercises.length - 5
    return (
        <IonCol size='12' sizeLg='4' sizeMd='6'>
            <IonCard routerLink={`/workout/${workout._id}`} button className='workout-history-list-item'>
                <IonItem lines='none'>
                    <div>
                        <IonText className='block-text'>{workout.name}</IonText>
                        <IonText className='block-text text-light small'>{moment(workout.startTimestamp).format("dddd DD/MM/yyyy hh:mm A")}</IonText>
                    </div>
                </IonItem>
                <WorkoutStatsHeader liveMode={false} workout={workout} summation={summation()} />
                {exercises.slice(0, 5).map((ex) => {
                    return (
                        <IonText key={ex._id} className='text-item'>
                            {ex.sets.length} x {ex.exerciseName}
                        </IonText>
                    )
                })}
                {more > 0 ? <IonText className='text-item text-center'>+ {more} more items</IonText> : null}
            </IonCard>
        </IonCol>
    )
}