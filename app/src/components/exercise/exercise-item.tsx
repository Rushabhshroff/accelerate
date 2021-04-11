import { IonButton, IonButtons, IonCol, IonIcon, IonItem, IonRow, IonText, IonTextarea, useIonActionSheet, useIonModal, useIonPicker } from '@ionic/react'
import { add, checkmark, close, ellipsisHorizontal, ellipsisHorizontalCircleOutline, ellipsisVertical, gitCompareOutline, remove, repeatOutline, timerOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Exercise, IExercise, WorkoutSet } from '../../database/models'
import { ExerciseData } from '../../database/models/exercise-data'
import { ExercisePropsMap } from '../../database/models/exercise-props-map'
import { useObjectReducer } from '../../hooks'
import Duration from '../../utils/duration'
import { TouchableOpcity } from '../core'
import { ExerciseList } from './exercise-list'
import { ExerciseSet } from './exercise-set'
import { ExerciseSetHead } from './exercise-set-head'
import { ExerciseThumbnail } from './exercise-thumbnail'
import './styles.scss'
interface ExerciseItem {
    exercise: IExercise,
    OnRequestRemove?: () => void,
    liveMode?: boolean
    OnRequestReorder?: () => void,
    OnRequestSuperset?: () => void,
    OnMutate?: () => void
}
const TimerRange = Duration.range(0, 600, 5);
export const ExerciseItem: React.FC<ExerciseItem> = (props) => {
    const [Show] = useIonActionSheet();
    const [ShowExercisePicker, HideExercisePicker] = useIonModal(() => <ExerciseList
        selectionMode={true}
        selectionType='single'
        onSelectionChange={(e) => {
            if (e.length > 0) {
                let exInfo = ExerciseData.find(e[0])
                if (exInfo) {
                    let ex = Exercise.from(exInfo._id, exercise.workoutId);
                    SetExercise({
                        ...ex
                    })
                }
            }
        }}
        onDismiss={HideExercisePicker}
    />)
    const [ShowTimerPicker] = useIonPicker();
    const [exercise, SetExercise] = useObjectReducer(props.exercise)
    const [prevExercise, SetPrevExercise] = useState<Exercise | undefined>(undefined);
    const info = ExerciseData.find(exercise.exerciseId);
    const liveMode = props.liveMode || false
    useEffect(() => {
        SetExercise(props.exercise)
    }, [props.exercise.superset])
    const HandleOptions = () => {
        ShowExerciseOptionsHandler(Show.bind(this), exercise.restTime, exercise.superset !== undefined).then((res) => {
            switch (res) {
                case "remove":
                    if (props.OnRequestRemove) props.OnRequestRemove()
                    break;
                case 'reorder':
                    if (props.OnRequestReorder) props.OnRequestReorder()
                    break;
                case 'replace':
                    ShowExercisePicker({ mode: 'ios', swipeToClose: false })
                    break;
                case 'timer':
                    HandleRestTimePicker()
                    break;
                case 'superset':
                    if (exercise.superset) {
                        SetExercise({ superset: undefined })
                    } else {
                        if (props.OnRequestSuperset) props.OnRequestSuperset()
                    }
                    break;
            }
        })
    }
    const HandleRestTimePicker = () => {
        ShowTimerPicker({
            mode: 'ios',
            columns: [
                {
                    name: 'timer',
                    selectedIndex: TimerRange.findIndex((i) => i.milliseconds() === exercise.restTime),
                    options: TimerRange.map((r) => {
                        let ms = r.milliseconds()
                        return {
                            text: ms > 0 ? r.toHHMMSS() : 'OFF',
                            value: ms,
                            selected: ms === exercise.restTime
                        }
                    })
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Set Timer',
                    handler: (data) => {
                        SetExercise({ restTime: data.timer.value || undefined })
                    }
                }
            ]
        })
    }
    const AddSet = () => {
        let set = new WorkoutSet();
        SetExercise({
            sets: [...exercise.sets, set]
        })
    }
    const RemoveSet = (setId: string) => {
        SetExercise({
            sets: exercise.sets.filter(s => s._id !== setId)
        })
    }
    useEffect(() => {
        if (exercise.sets.length <= 0) {
            if (props.OnRequestRemove) props.OnRequestRemove()
        }
    }, [exercise.sets])
    useEffect(() => {
        if (props.OnMutate) props.OnMutate()
    }, [exercise])
    const OnSetMutated = () => {
        if (props.OnMutate) props.OnMutate()
        SetExercise({})
    }
    useEffect(() => {
        new Exercise(exercise).previous().then((res) => {

            SetPrevExercise(res)
        })
    }, [])
    var counts = {
        'warmup': 0,
        'normal': 0,
        'drop': 0,
        'failure': 0
    }
    return (
        <div className='exercise-item py-3'>
            <div className='px-3'>
                <IonItem className='ion-no-padding' lines='none'>
                    <ExerciseThumbnail thumbUrl={info?.thumbnail} exerciseName={exercise.exerciseName} />
                    <TouchableOpcity>
                        <IonText color='primary' className='block-text medium ml-2'>{exercise.exerciseName}</IonText>
                    </TouchableOpcity>
                    <IonButtons slot='end'>
                        <IonButton onClick={HandleOptions}>
                            <IonIcon size='large' icon={ellipsisVertical} />
                        </IonButton>
                    </IonButtons>
                </IonItem>
                {exercise.superset ? <div style={{ backgroundColor: exercise.superset }} className='badge badge-secondary'>Superset</div> : null}
                <textarea defaultValue={exercise.note} onChange={(e) => {
                    SetExercise({ note: e.currentTarget.value })
                }} placeholder='Enter Note Here...' />
            </div>
            <ExerciseSetHead liveMode={liveMode} ex={exercise} />
            {exercise.sets.map((set) => {
                counts[set.setType]++;
                return (
                    <ExerciseSet
                        prevExercise={prevExercise}
                        OnMutate={OnSetMutated}
                        liveMode={liveMode}
                        index={counts[set.setType]}
                        key={set._id} OnRequestRemove={() => RemoveSet(set._id)}
                        set={set}
                        exercise={exercise} />
                )
            })}
            <section>
                <IonButton onClick={AddSet} color='light'>+ Add Set</IonButton>
            </section>
        </div>
    )
}

function ShowExerciseOptionsHandler(Show: any, restTime?: number, superset?: boolean) {
    return new Promise<string | undefined>((resolve, reject) => {
        let action: string | undefined = undefined;
        Show({
            buttons: [
                { text: 'Recorder Exercises', handler: () => { action = 'reorder' }, icon: gitCompareOutline },
                { text: 'Replace Exercise', handler: () => { action = 'replace' }, icon: repeatOutline },
                { text: superset ? 'Remove Superset' : 'Add To Superset', handler: () => { action = 'superset' }, icon: !superset ? add : remove },
                { text: `Rest Timer (${restTime ? new Duration(restTime).toString() : 'OFF'})`, handler: () => { action = 'timer' }, icon: timerOutline },
                { text: 'Remove Exercise', role: 'destructive', handler: () => { action = 'remove' }, icon: close },

                { text: 'cancel', role: 'cancel' }
            ],
            onWillDismiss: () => resolve(action)
        })
    })
}

