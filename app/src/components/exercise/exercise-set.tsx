import { IonButton, IonButtons, IonCol, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonRow, IonText, useIonPopover } from '@ionic/react'
import { checkmark, help, key, trashBin } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Exercise, IExercise, WorkoutSet } from '../../database/models'
import { ExercisePropsMap } from '../../database/models/exercise-props-map'
import { useObjectReducer } from '../../hooks'
import { useRestTimer } from '../../hooks/useRestTimer'
import { AppSettings, Duration, StringUtils, Unit } from '../../utils'
import { TouchableOpcity } from '../core'
import './styles.scss'
export interface ExerciseSet {
    OnRequestRemove?: () => void,
    OnMutate?: () => void,
    set: WorkoutSet,
    exercise: IExercise,
    prevExercise?: Exercise
    index: number,
    liveMode?: boolean,
    disabled?: boolean
}
export const ExerciseSet: React.FC<ExerciseSet> = (props) => {
    const ShowTimer = useRestTimer();
    const exercise = props.exercise
    const prevEx = props.prevExercise
    const [set, UpdateSet] = useObjectReducer(props.set)
    const inputs = ExercisePropsMap[props.exercise.category];
    const [ShowSelectSetType, HideSelectSetType] = useIonPopover(<SetTypeOptions OnSelectOption={(op) => {
        UpdateSet({
            //@ts-ignore
            setType: op
        })
        HideSelectSetType()
    }} />);
    const liveMode = props.liveMode || false
    const getPreviousSet = () => {
        if (prevEx && prevEx.sets.filter((s) => s.setType === set.setType).length >= props.index) {
            return { isPrev: true, set: prevEx.sets.filter((s) => s.setType === set.setType)[props.index - 1] }
        } else if (props.index > 1 && exercise.sets.filter((s) => s.setType === set.setType).length >= props.index) {
            return { isPrev: false, set: exercise.sets.filter((s) => s.setType === set.setType)[props.index - 2] }
        } else {
            return undefined
        }
    }
    const prevSet = liveMode ? getPreviousSet() : undefined;
    const disabled = props.disabled
    const done = set.timestamp !== undefined && liveMode ? 'done' : '';
    const HandleInputChange = (key: string, value: string) => {
        let update: any = {}
        let unit = exercise.units[key] || AppSettings.current.units[key]
        switch (key) {
            case 'time':
                update.time = value ? StringUtils.SanitizeToDurationHHMMSS(value) : undefined
                break;
            case 'distance':
                update.distance = value ? Unit.parse(value + unit) : undefined
                break;
            case 'weight':
                update.weight = value ? Unit.parse(value + unit) : undefined
                break;
            case 'reps':
                update.reps = value ? Unit.parse(value) : undefined
                break
        }
        UpdateSet(update);
    }
    const SetSameAsPrev = () => {
        if (prevSet && prevSet.set) {
            let enables = ExercisePropsMap[exercise.category]
            let updates: any = {}
            for (let key in enables) {
                if (prevSet) {
                    updates[key] = prevSet.set[key]
                }
            }
            UpdateSet(updates)
        }
    }
    useEffect(() => {
        if (set.timestamp && props.exercise.restTime) {
            ShowTimer(props.exercise.restTime / 1000)
        }
        if (props.OnMutate) props.OnMutate()
    }, [set.timestamp])
    useEffect(() => {
        if (props.OnMutate) props.OnMutate()
    }, [set.setType, set.weight, set.distance, set.time, set.reps])
    const SetDone = () => {
        let enables = ExercisePropsMap[exercise.category]
        let updates: any = {}
        for (let key in enables) {
            if (set[key] == undefined && prevSet) {
                updates[key] = prevSet.set[key]
            }
        }
        UpdateSet({
            timestamp: Date.now(),
            ...updates
        })
    }
    return (
        <IonItemSliding>
            <IonItem detail={false} button={false} lines='none' className={`small row-center ion-no-padding exercise-set ${set.setType} ${done}`}>
                <IonCol size='2' className='table-item'>
                    <IonButton disabled={disabled} onClick={() => ShowSelectSetType()} color={setTypeToColor[set.setType]} mode='md' fill='clear'>
                        {set.setType != 'normal' ? `${set.setType[0].toUpperCase()}-${props.index}` : props.index}
                    </IonButton>
                </IonCol>
                {liveMode ? <IonCol onClick={SetSameAsPrev} className='text-light table-item'>{prevSet && prevSet.isPrev ? prevSet.set.toString(exercise.category) : '-'}</IonCol> : null}
                {inputs.distance ?
                    <IonCol size={liveMode ? '2' : '4'} className='table-item'>
                        <IonInput disabled={disabled} onIonChange={(e) => HandleInputChange('distance', e.detail.value || '')} value={set.distance?.asOrCurrent(exercise.units['distance']).value.toFixed(1)} type={inputTypeMap.distance} placeholder={prevSet?.set.distance?.value?.toString() || defaultPlaceholders.distance} />
                    </IonCol>
                    : null}
                {inputs.weight ?
                    <IonCol size={liveMode ? '2' : '4'} className='table-item'>
                        <IonInput disabled={disabled} onIonChange={(e) => HandleInputChange('weight', e.detail.value || '')} value={set.weight?.asOrCurrent(exercise.units['weight']).value} type={inputTypeMap.weight} placeholder={prevSet?.set.weight?.value?.toString() || defaultPlaceholders.weight} />
                    </IonCol>
                    : null}
                {inputs.reps ?
                    <IonCol size={liveMode ? '2' : '4'} className='table-item'>
                        <IonInput disabled={disabled} onIonChange={(e) => HandleInputChange('reps', e.detail.value || '')} value={set.reps?.toString(0)} type={inputTypeMap.reps} placeholder={prevSet?.set.reps?.value?.toString() || defaultPlaceholders.reps} />
                    </IonCol>
                    : null}
                {inputs.time ?
                    <IonCol size={liveMode ? '2' : '4'} className='table-item'>
                        <IonInput disabled={disabled} onIonChange={(e) => HandleInputChange('time', e.detail.value || '')} value={set.time} type={inputTypeMap.time} placeholder={prevSet?.set.time || defaultPlaceholders.time} />
                    </IonCol>
                    : null}
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
const defaultPlaceholders = {
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