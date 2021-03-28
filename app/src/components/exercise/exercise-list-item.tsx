import { IonCheckbox, IonItem, IonText } from '@ionic/react'
import React, { CSSProperties } from 'react'
import { BodyPart, BodyParts } from '../../database/models'
import { ExerciseInfo } from '../../database/models/exercise-data'
import { ExerciseThumbnail } from './exercise-thumbnail'
import './styles.scss'
export interface ExerciseListItem {
    exercise: ExerciseInfo,
    style?: CSSProperties,
    selectionMode?: boolean,
    onCheckboxValueChange?: (checked: boolean) => void,
    checked?: boolean
    onClick?: () => void,
    noDetail?: boolean
}
export const ExerciseListItem: React.FC<ExerciseListItem> = (props) => {
    const ex = props.exercise;
    return (
        <IonItem detail={props.noDetail ? false : true} mode='ios' onClick={props.selectionMode ? undefined : props.onClick} routerDirection='forward' routerLink={props.selectionMode ? undefined : `/exercise/${ex._id}`} button={!props.selectionMode} style={props.style} lines='none' className='exercise-list-item'>
            <ExerciseThumbnail exerciseName={ex.exerciseName} thumbUrl={ex.thumbnail} />
            <div className='ml-3'>
                <IonText className='block-text x-small'>{ex.exerciseName}</IonText>
                <IonText className='block-text text-light x-small'>{BodyParts[ex.bodyPart as BodyPart]}</IonText>
            </div>
            {props.selectionMode ?
                <IonCheckbox
                    checked={props.checked}
                    onIonChange={(e) => props.onCheckboxValueChange ? props.onCheckboxValueChange(e.detail.checked) : {}}
                    slot='end' />
                : null}
            {props.children}
        </IonItem>
    )
}