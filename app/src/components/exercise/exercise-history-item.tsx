import { IonItem, IonText } from '@ionic/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Exercise, ExerciseInfo, Workout } from '../../database'
import { ExerciseListItem } from './exercise-list-item'
import { ExerciseSet } from './exercise-set'
import { ExerciseSetHead } from './exercise-set-head'


export interface ExerciseHistoryItem {
    exerciseInfo: ExerciseInfo,
    exercise: Exercise,
    nowWorkout?: boolean
}
export const ExerciseHistoryItem: React.FC<ExerciseHistoryItem> = (props) => {
    const [workout, SetWorkout] = useState<Workout | undefined>(undefined)
    let setCount = 0
    useEffect(() => {
        if (!props.nowWorkout) {
            props.exercise.workout().then((w) => {
                SetWorkout(w)
            })
        }
    }, [])
    return (
        <div className='exercise-history-item'>
            {workout ? <IonItem detail button lines='none'>
                <div>
                    <IonText className='block-text'>{workout.name}</IonText>
                    <IonText className='block-text text-light small'>{moment(workout.startTimestamp).format("dddd DD/MM/yyyy hh:mm A")}</IonText>
                </div>
            </IonItem> : null}
            <ExerciseListItem exercise={props.exerciseInfo} />
            {props.exercise.note ? <IonItem lines='none'>
                <IonText>{props.exercise.note}</IonText>
            </IonItem> : null}
            <ExerciseSetHead ex={props.exercise} liveMode={false} />
            {props.exercise.sets.map((s) => {
                if (s.setType !== 'warmup') {
                    setCount += 1
                }
                return (
                    <ExerciseSet index={setCount} key={s._id} exercise={props.exercise} set={s} disabled={true} liveMode={false} />
                )
            })}
        </div>
    )
}