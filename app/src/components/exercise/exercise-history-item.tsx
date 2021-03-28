import { IonItem, IonText } from '@ionic/react'
import React from 'react'
import { Exercise, ExerciseInfo } from '../../database'
import { ExerciseListItem } from './exercise-list-item'
import { ExerciseSet } from './exercise-set'
import { ExerciseSetHead } from './exercise-set-head'


export interface ExerciseHistoryItem {
    exerciseInfo: ExerciseInfo,
    exercise: Exercise
}
export const ExerciseHistoryItem: React.FC<ExerciseHistoryItem> = (props) => {
    return (
        <div className='exercise-history-item'>
            <IonItem button lines='none'>
                <div>
                    <IonText className='block-text'>Workout Name</IonText>
                    <IonText className='block-text text-light small'>{new Date().toISOString()}</IonText>
                </div>
            </IonItem>
            <ExerciseListItem exercise={props.exerciseInfo} />
            <ExerciseSetHead ex={props.exercise} liveMode={false} />
            {props.exercise.sets.map((s) => {
                return (
                    <ExerciseSet key={s._id} exercise={props.exercise} set={s} disabled={true} liveMode={false} />
                )
            })}
        </div>
    )
}