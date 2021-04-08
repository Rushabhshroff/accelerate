import { IonCol, IonItem, IonText } from '@ionic/react'
import React from 'react'
import { IWorkout, Workout } from '../../database'
import { ExerciseValues } from '../../database/models/exercise-values'
import { AppSettings } from '../../utils'
import { DurationText } from '../core/duration-text'

export interface WorkoutStatsHeader {
    workout: IWorkout,
    liveMode?: boolean,
    summation: ExerciseValues
}
export const WorkoutStatsHeader: React.FC<WorkoutStatsHeader> = (props) => {
    let { workout, liveMode, summation } = props
    let units  = AppSettings.current.units
    return (
        <IonItem lines='full'>
            <IonCol className='text-center'>
                <IonText className='block-text text-light x-small'>Duration</IonText>
                <DurationText liveMode={liveMode} workout={workout} />
            </IonCol>
            <IonCol className='text-center'>
                <IonText className='block-text text-light x-small'>Volume</IonText>
                <IonText className='block-text x-small'>{summation.volume} {units.weight}</IonText>
            </IonCol>
            <IonCol className='text-center'>
                <IonText className='block-text text-light x-small'>Distance</IonText>
                <IonText className='block-text x-small'>{summation.distance} {units.distance}</IonText>
            </IonCol>
            <IonCol className='text-center'>
                <IonText className='block-text text-light x-small'>Sets</IonText>
                <IonText className='block-text x-small'>{summation.sets}</IonText>
            </IonCol>
        </IonItem>
    )
}