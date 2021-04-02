import { IonCol, IonItem, IonText } from '@ionic/react'
import React from 'react'
import { Workout } from '../../database'
import { ExerciseValues } from '../../database/models/exercise-values'
import { DurationText } from '../core/duration-text'

export interface WorkoutStatsHeader {
    workout: Workout,
    liveMode?: boolean,
    summation: ExerciseValues
}
export const WorkoutStatsHeader: React.FC<WorkoutStatsHeader> = (props) => {
    let { workout, liveMode, summation } = props
    return (
        <IonItem lines='full'>
            <IonCol className='text-center'>
                <IonText className='block-text text-light small'>Duration</IonText>
                <DurationText liveMode={liveMode} workout={workout} />
            </IonCol>
            <IonCol className='text-center'>
                <IonText className='block-text text-light small'>Volume</IonText>
                <IonText className='block-text small'>{summation.volume} Kg</IonText>
            </IonCol>
            <IonCol className='text-center'>
                <IonText className='block-text text-light small'>Distance</IonText>
                <IonText className='block-text small'>{summation.distance} Km</IonText>
            </IonCol>
            <IonCol className='text-center'>
                <IonText className='block-text text-light small'>Sets</IonText>
                <IonText className='block-text small'>{summation.sets}</IonText>
            </IonCol>
        </IonItem>
    )
}