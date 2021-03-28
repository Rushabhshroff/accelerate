import { IonButton, IonButtons, IonCol, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonRow, IonText, useIonPopover } from '@ionic/react'
import { checkmark, help, trashBin } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Exercise, WorkoutSet } from '../../database/models'
import { ExercisePropsMap } from '../../database/models/exercise-props-map'
import { useObjectReducer } from '../../hooks'
import { useRestTimer } from '../../hooks/useRestTimer'
import { StringUtils } from '../../utils'
import { TouchableOpcity } from '../core'
import './styles.scss'
export interface ExerciseSet {
    OnRequestRemove?: () => void,
    OnMutate?: () => void,
    set: WorkoutSet,
    exercise: Exercise
    index?: number,
    liveMode?: boolean,
    disabled?: boolean
}
export const ExerciseSet: React.FC<ExerciseSet> = (props) => {
    const ShowTimer = useRestTimer();
    const [set, UpdateSet] = useObjectReducer(props.set)
    const done = set.timestamp !== undefined ? 'done' : '';
    const inputs = Object.keys(ExercisePropsMap[props.exercise.category]);
    const [ShowSelectSetType, HideSelectSetType] = useIonPopover(<SetTypeOptions OnSelectOption={(op) => {
        UpdateSet({
            //@ts-ignore
            setType: op
        })
        HideSelectSetType()
    }} />);
    const liveMode = props.liveMode || false
    const SetDone = () => {
        UpdateSet({
            timestamp: Date.now()
        })
    }
    const getPlaceholder = (key: string) => {
        return defaultPlaceholders[key]
    }
    const disabled = props.disabled
    const HandleInputChange = (key: string, value?: string | null) => {
        let update: any = {}
        if (value) {
            let ip = key === 'time' ? StringUtils.SanitizeToDurationHHMMSS(value) : key === 'reps' ? StringUtils.SanitizeToWholeNumber(value) : StringUtils.SanitizeToNumber(value)
            update[key] = ip
        } else {
            update[key] = undefined
        }
        UpdateSet(update)
    }
    useEffect(() => {
        if (set.timestamp && props.exercise.restTime) {
            ShowTimer(props.exercise.restTime / 1000)
        }
        if (props.OnMutate) props.OnMutate()
    }, [set.timestamp])
    return (
        <IonItemSliding>
            <IonItem detail={false} button lines='none' className={`small row-center ion-no-padding exercise-set ${set.setType} ${done}`}>
                <IonCol size='2' className='table-item'>
                    <IonButton disabled={disabled} onClick={() => ShowSelectSetType()} color={setTypeToColor[set.setType]} mode='md' fill='clear'>
                        {set.setType == 'warmup' ? "W" : props.index}
                    </IonButton>
                </IonCol>
                <IonCol className='text-light table-item'>-</IonCol>
                {inputs.map((i) => {
                    return (
                        <IonCol key={i} size='2' className='table-item'>
                            <IonInput disabled={disabled} onIonChange={(e) => HandleInputChange(i, e.detail.value)} value={set[i]} type={inputTypeMap[i]} placeholder={getPlaceholder(i)} />
                        </IonCol>
                    )
                })}
                {liveMode && !disabled ? <IonCol size='2' className='table-item'>
                    <TouchableOpcity activeOpacity={1} onClick={SetDone} className='checkmark-box'>
                        <IonIcon icon={checkmark} />
                    </TouchableOpcity>
                </IonCol> : null}
            </IonItem>
            {!disabled ? <IonItemOptions side="end">
                <IonItemOption disabled={disabled} color='danger'>
                    <IonButton color='light' onMouseUp={props.OnRequestRemove} fill='clear'>
                        <IonIcon style={{ width: 70, textAlign: 'end' }} icon={trashBin} />
                    </IonButton>
                </IonItemOption>
            </IonItemOptions> : null}
        </IonItemSliding>
    )
}
const setTypeToColor: any = {
    'normal': 'dark',
    'drop': 'primary',
    'warmup': 'warning',
    'failure': 'danger'
}
const setTypes: { [key: string]: string } = {
    '1': 'Normal Set',
    'W': 'Warmup Set',
    'D': 'Drop Set',
    'F': 'Failure Set'
}
const setTypeMap: any = {
    '1': 'normal',
    'W': 'warmup',
    'D': 'drop',
    'F': 'failure'
}
const defaultPlaceholders: any = {
    'weight': '0',
    'time': 'mm:ss',
    'distance': '0',
    'reps': '0'
}
const inputTypeMap: any = {
    'weight': 'number',
    'time': 'tel',
    'distance': 'number',
    'reps': 'number'
}

interface SetTypeOptions {
    OnSelectOption: (key: string) => void
}
function SetTypeOptions(props: SetTypeOptions) {
    return (
        <>
            {Object.keys(setTypes).map((key, i) => {
                const type = setTypeMap[key]
                return (
                    <IonItem button key={i} lines='none' >
                        <IonText onClick={() => {
                            if (props.OnSelectOption) {
                                props.OnSelectOption(type)
                            }
                        }} slot='start' color={setTypeToColor[type]} >{key}</IonText>
                        <IonText onClick={() => {
                            if (props.OnSelectOption) {
                                props.OnSelectOption(type)
                            }
                        }}>{setTypes[key]}</IonText>
                        <IonButtons slot='end'>
                            <IonButton>
                                <IonIcon icon={help} />
                            </IonButton>
                        </IonButtons>
                    </IonItem>
                )
            })}
        </>
    )
}