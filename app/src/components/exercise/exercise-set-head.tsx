import { IonCol, IonIcon, IonItem } from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import React from 'react'
import { Exercise, ExercisePropsMap } from '../../database'

export type ExerciseSetHead = {
    ex: Exercise,
    liveMode?: boolean
}
export function ExerciseSetHead(props: ExerciseSetHead) {
    let exProps = ExercisePropsMap[props.ex.category]
    const headers = Object.keys(exProps)
    const liveMode = props.liveMode || false
    const TitleMap: any = {
        'reps': 'reps',
        'time': 'time',
        'weight': props.ex.units.weight,
        'distance': props.ex.units.distance
    }

    return (
        <IonItem lines='none' className='text-transform-up small row-center ion-no-padding exercise-set-head'>
            <IonCol size='2' className='text-light table-item'>Set</IonCol>
            <IonCol className='text-light table-item'>Prev</IonCol>
            {headers.map((h) => {
                return (
                    <IonCol key={h} size='2' className='text-light table-item'>{TitleMap[h]}</IonCol>
                )
            })}
            {liveMode ? <IonCol size='2' className='text-light table-item'><IonIcon size="medium" className='text-light' icon={checkmark} /></IonCol> : null}
        </IonItem>
    )
}

