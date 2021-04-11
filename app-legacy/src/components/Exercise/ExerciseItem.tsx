import { IonButton, IonButtons, IonCol, IonIcon, IonInput, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonNav, IonPopover, IonRow, IonText } from '@ionic/react'
import React, { useEffect, useReducer, useState } from 'react'
import './ExerciseItem.scss'
import { checkmark, ellipsisVertical, lockClosed, trash } from 'ionicons/icons'
import { IWorkoutSet, WorkoutExercise } from '../../data/models/Workout'
import { IExercise, ExerciseMap, ExerciseData } from '../../data/models/Exercise'
import short from 'shortid'
import AlertBox from '../../modals/Alert'
import ExerciseSelectModal from '../../modals/ExercisesSelectModal'
import { buildQueries } from '@testing-library/react'
import PickerBox from '../Picker'
import { Invert, Unit } from '../../utils/Units'
import EventEmitter from 'events'
import { usePrev } from '../../utils/hooks'
import moment from 'moment'
import RestTimer from '../../utils/RestTimer'
import Time from '../../utils/Time'
interface ExerciseItemProps {
    exercise: WorkoutExercise,
    OnRequestRemove?: () => void
}

interface ContextProps {
    exercise: WorkoutExercise,
    SetExercise: (exercise: Partial<WorkoutExercise>) => void,
}

//@ts-ignore
const ExerciseItemContext = React.createContext<ContextProps>()

const ExerciseItem: React.FC<ExerciseItemProps> = (props) => {
    let og_exercise = props.exercise

    const ExerciseReducer = (state: WorkoutExercise, action: Partial<WorkoutExercise>) => {
        Object.assign(og_exercise, action)
        return new WorkoutExercise({
            ...state,
            ...action
        })
    }
    const [exercise, SetExercise] = useReducer(ExerciseReducer, og_exercise);
    const [prev, SetPrev] = useState<WorkoutExercise | undefined>(undefined)
    let exerciseInfo: IExercise = ExerciseData.map[exercise._id] as IExercise;
    let enables = ExerciseMap[exercise.category]
    useEffect(() => {
        if (exercise.sets.length <= 0) {
            SetExercise({ sets: [{ _id: short() }] })
        }
        exercise.recent().then((val) => SetPrev(val));
    }, [])
    useEffect(() => {
        if (exercise.sets.length <= 0) {
            if (props.OnRequestRemove) {
                props.OnRequestRemove()
            }
        }
    }, [exercise])
    const AddSet = () => {
        let sets = [...exercise.sets];
        sets.push({ _id: short() })
        SetExercise({ sets: sets });
    }
    const DeleteSet = (_id: string, warmup?: boolean) => {
        AlertBox.Show('Delete Set?', "Are you sure you want to delete this set?", [
            {
                text: 'cancel',
                type: 'cancel'
            }, {
                text: 'Yes, Delete',
                handler: () => {
                    let sets = warmup ? exercise.warmupset.filter((x, i) => x._id !== _id) : exercise.sets.filter((x, i) => x._id !== _id);
                    if (warmup) {
                        SetExercise({ warmupset: sets })
                    } else {
                        SetExercise({ sets: sets });
                    }
                }
            }
        ])
    }
    const GetPrevSetForIndex = (index: number) => {
        if (prev && index == 0) {
            if (index >= prev.sets.length) {
                return prev.sets[prev.sets.length - 1]
            } else {
                return prev.sets[index]
            }
        } else if (index > 0) {
            return exercise.sets[index - 1];
        } else {
            return undefined;
        }
    }
    const OnRemoveExecise = () => {
        AlertBox.Show('Remove Exercise?', "Are you sure you want to delete this exercise?", [
            {
                text: 'Cancel',
                type: 'cancel'
            }, {
                text: 'Yes, Delete',
                handler: () => {
                    if (props.OnRequestRemove) {
                        props.OnRequestRemove()
                    }
                }
            }
        ])
    }
    const OnAddNote = () => {
        let notes = exercise.note || []
        notes.push({ _id: short(), text: '' })
        SetExercise({ note: notes })
    }
    const DeleteNote = (id: string) => {
        AlertBox.Show('Delete Note?', "Are you sure you want to delete this note?", [
            {
                text: 'cancel',
                type: 'cancel'
            },
            {
                text: 'Yes, Delete',
                handler: () => {
                    let notes = exercise.note?.filter((x) => x._id !== id);
                    SetExercise({ note: notes })
                }
            }
        ])
    }
    const OnReplaceExercise = () => {
        if (exercise.sets.length > 0) {
            AlertBox.Show('Are you sure?', 'Replacing the exercise will also replace your sets.',
                [
                    {
                        text: 'Cancel',
                        type: 'Cancel'
                    },
                    {
                        text: 'Yes Replace',
                        handler: () => {
                            ExerciseSelectModal.ref?.show('single').then((res) => {
                                let ex = res[0];
                                SetExercise({
                                    exerciseName: ex.exerciseName,
                                    bodyPart: ex.bodyPart,
                                    category: ex.category,
                                    exerciseId: ex._id,
                                    sets: [{ _id: short() }]
                                })
                            })
                        }
                    }
                ]
            )
        }

    }
    return (
        <ExerciseItemContext.Provider value={{ exercise, SetExercise }}>
            <div className='exercise-item'>
                <IonItem lines='none'>
                    <IonText color='primary'>{exercise.exerciseName}</IonText>
                    <IonButtons slot='end'>
                        <Popover
                            enables={enables}
                            OnAddNote={OnAddNote}
                            OnRemoveExercise={OnRemoveExecise}
                            OnReplaceExercise={OnReplaceExercise}
                        />
                    </IonButtons>
                </IonItem>
                {exercise.note?.map((note, i) => {
                    return (
                        <ExerciseNote key={note._id} note={note} OnDelete={() => DeleteNote(note._id)} />
                    )
                })}
                <IonItem className='head' lines='none'>
                    <IonCol size='2'>Set</IonCol>
                    {Object.keys(enables).map((key) => {
                        if (key === 'weight') {
                            key = Unit(exercise.weightUnit, key)
                            if (exercise.category === 'assisted-body') {
                                key = '(- ' + key + ' )'
                            } else if (exercise.category === 'weighted-bodyweight') {
                                key = `(+ ${key})`
                            }
                        }
                        if (key === 'distance') {
                            key = Unit(exercise.distanceUnit || 'metric', key)
                        }
                        return (
                            <IonCol key={key}>{key}</IonCol>
                        )
                    })}
                    <IonCol size='2'></IonCol>
                </IonItem>
                {exercise.warmupset.map((set, i) => {
                    return (
                        <ExerciseSet recentSet={GetPrevSetForIndex(i)} onDelete={() => DeleteSet(set._id, set.warmup)} key={set._id} set={set} setNumber={i + 1} enables={enables} />
                    )
                })}
                {exercise.sets.map((set, i) => {
                    return (
                        <ExerciseSet recentSet={GetPrevSetForIndex(i)} onDelete={() => DeleteSet(set._id, set.warmup)} key={set._id} set={set} setNumber={i + 1} enables={enables} />
                    )
                })}
                <div className='centering-box'>
                    <IonButton onClick={AddSet} fill='clear'>
                        <IonText color='primary'>+ Add Set</IonText>
                    </IonButton>
                </div>
            </div>
        </ExerciseItemContext.Provider >
    )
}

interface ExerciseNotesProps {
    note: { _id: string, text: string }
    OnDelete: () => void
}
function ExerciseNote(props: ExerciseNotesProps) {
    let note_og = props.note
    const NoteReducer = (state: { _id: string, text: string }, action: string) => {
        note_og.text = action;
        return {
            _id: state._id,
            text: action
        }
    }
    const [note, SetNote] = useReducer(NoteReducer, note_og);
    return (
        <IonItemSliding>
            <IonItem lines='none'>
                <IonLabel></IonLabel>
                <IonInput style={{ paddingLeft: '5 !important' }} value={note.text} onIonChange={(e) => { SetNote(e.detail.value || '') }} placeholder='Enter note' />
            </IonItem>
            <IonItemOptions side="end">
                <IonItemOption onClick={props.OnDelete} ><IonIcon icon={trash} /></IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    )
}

interface ExerciseSetProps {
    set: IWorkoutSet,
    enables: any,
    setNumber: number,
    recentSet?: IWorkoutSet,
    onDelete?: () => void
}

function ExerciseSet(props: ExerciseSetProps) {
    let og_set = props.set;
    let recentSet = props.recentSet
    var mounted = false;
    const { exercise } = React.useContext(ExerciseItemContext);
    const [btnClass, SetBtnClass] = useState('');
    const SetReducer = (state: IWorkoutSet, action: Partial<IWorkoutSet>) => {
        Object.assign(og_set, action)
        return {
            ...state,
            ...action
        } as IWorkoutSet
    }
    let [set, SetValue] = useReducer(SetReducer, og_set);
    let done = set.timestamp !== undefined;
    const onInputChange = (key: string, value?: string) => {
        let ob: any = {}
        if (key === 'time') {
            ob[key] = value?.replace(/[:\*#\+-.;N\/()]|^0/g,'').padStart(3,"0").formatToTime()
        } else {
            ob[key] = Number(value) || undefined
        }
        if (value === undefined && set.timestamp) {
            ob['timestamp'] = undefined;
        }
        SetValue(ob);
    }
    const SetDone = () => {
        let flag = false
        for (let k in props.enables) {
            //@ts-ignore
            if (set[k] !== undefined) {
                flag = true;
                continue;
            }
            //@ts-ignore
            if (set[k] === undefined && recentSet && recentSet[k]) {
                let ob: any = {}
                //@ts-ignore
                ob[k] = recentSet[k]
                SetValue(ob);
                flag = true;
            }
        }
        if (flag) {
            SetValue({ timestamp: Date.now() })
            if (set.warmup && exercise.warmUpRestTimer) {
                RestTimer.Start(exercise.warmUpRestTimer);
            } else if (exercise.restTime) {
                RestTimer.Start(exercise.restTime)
            }
        } else {
            Shake()
        }
    }
    const Shake = () => {
        SetBtnClass('shake')
        setTimeout(() => {
            if (mounted) {
                SetBtnClass('')
            }
        }, 3000)
    }
    useEffect(() => {
        mounted = true;
        return () => {
            mounted = false
        }
    }, [])
    const prev = usePrev(exercise);
    useEffect(() => {
        if (exercise.weightUnit !== prev?.weightUnit && props.enables.weight) {
            if (set.weight && prev?.weightUnit) {
                SetValue({
                    weight: Invert(prev?.weightUnit, 'weight', set.weight)
                })
            }
        }
        if (exercise.distanceUnit !== prev?.distanceUnit && props.enables.distance) {
            if (set.distance && prev?.distanceUnit) {
                SetValue({
                    distance: Invert(prev.distanceUnit, 'distance', set.distance)
                })
            }
        }
    }, [exercise])
    return (
        <IonItemSliding>
            <IonItem className={`set-item${done ? ' done' : ''}`} lines='none'>
                <IonCol size='2'>{props.set.warmup ? "W" : props.setNumber}</IonCol>
                {
                    Object.keys(props.enables).map((key) => {
                        return (
                            <IonCol key={key}>
                                <IonInput placeholder={
                                    //@ts-ignore
                                    recentSet && recentSet[key] || ''
                                } value={
                                    //@ts-ignore 
                                    set[key]
                                } onIonChange={(e) => onInputChange(key, e.detail.value || '')} type={key === 'time' ? 'tel' : 'number'} />
                            </IonCol>
                        )
                    })
                }
                <IonCol size='2'>
                    <IonButton className={btnClass} onClick={SetDone} fill='clear'>
                        <IonIcon icon={checkmark} />
                    </IonButton>
                </IonCol>
            </IonItem>
            <IonItemOptions side="end">
                <IonItemOption onClick={props.onDelete} ><IonIcon icon={trash} /></IonItemOption>
            </IonItemOptions>
        </IonItemSliding>
    )
}

interface PopoverProps {
    OnAddNote: () => void,
    OnReplaceExercise: () => void,
    OnRemoveExercise: () => void,
    enables: any
}
function Popover(props: PopoverProps) {
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    const enables = props.enables
    const { exercise, SetExercise } = React.useContext(ExerciseItemContext);
    const warmupset = exercise.category === 'barbell' || exercise.category === 'dumbbell';
    const close = (action: 'note' | 'superset' | 'replace' | 'remove' | 'timer' | 'warmup' | '') => {
        setShowPopover({ showPopover: false, event: undefined })
        switch (action) {
            case 'note':
                props.OnAddNote()
                break;
            case 'replace':
                props.OnReplaceExercise()
                break;
            case 'remove':
                props.OnRemoveExercise()
                break;
            case 'timer':
                HandlerResetTimer()
                break;
            case 'warmup':
                AddWarmUpSet()
                break;
            default:
                break;
        }
    }
    const getTimerOptions = (title: string) => {
        let arr = [{
            text: title,
            value: -1
        }]
        for (let i = 0; i <= 120; i++) {
            let val = (i) * 5 * 1000
            arr.push({
                value: val,
                text: i === 0 ? 'Off' : moment.utc(val).format('mm:ss')
            })
        }
        return arr
    }
    const AddWarmUpSet = () => {
        let sets = [...exercise.warmupset];
        sets.push({ _id: short(), warmup: true })
        SetExercise({ warmupset: sets });
    }
    const getSelectedTimerIndex = (type: 'warmup' | 'main') => {
        let options = getTimerOptions('');
        if (type === 'main') {
            return options.findIndex((i) => i.value === exercise.restTime) || 1
        }
        if (type === 'warmup') {
            return options.findIndex((i) => i.value === exercise.warmUpRestTimer) || 1
        }
        return 1
    }
    const getSelectedTimerValue = (type: 'warmup' | 'main') => {
        let options = getTimerOptions('');
        if (type === 'main') {
            let val = options.find((i) => i.value === exercise.restTime)
            return val;
        }
        if (type === 'warmup') {
            let val = options.find((i) => i.value === exercise.warmUpRestTimer)
            return val
        }
    }
    const HandlerResetTimer = () => {
        const columns = [
            {
                name: 'main',
                selectedIndex: getSelectedTimerIndex('main'),
                options: getTimerOptions('Workout Timer')
            }
        ]
        if (warmupset) {
            columns.push({
                name: 'warmup',
                selectedIndex: getSelectedTimerIndex('warmup'),
                options: getTimerOptions('Warmup Timer')
            })
        }
        PickerBox.Show({
            buttons: [{ text: 'cancel', type: 'cancel' }, {
                text: 'Done', handler: (data: any) => {
                    let { main, warmup } = data;
                    if (main.value < 0) {
                        main.value = 0
                    }
                    if (warmup?.value < 0) {
                        warmup.value = 0
                    }
                    SetExercise({
                        warmUpRestTimer: warmup?.value,
                        restTime: main.value
                    })
                }
            }],
            columns: columns
        })
    }
    const HandleWeightUnitPicker = () => {
        PickerBox.Show({
            buttons: [
                {
                    text: 'cancel',
                    type: 'cancel'
                }, {
                    text: 'Done',
                    handler: (data: any) => {
                        SetExercise({ weightUnit: data.unit.value })
                        close('');
                    }
                }
            ],
            columns: [
                {
                    name: 'unit',
                    selectedIndex: exercise.weightUnit === 'metric' ? 0 : 1,
                    options: [
                        {
                            text: 'Kg',
                            value: 'metric'
                        }, {
                            text: 'Lb',
                            value: 'imperial'
                        }
                    ]
                }
            ]
        })
    }
    const HandleDistanceUnitPicker = () => {
        PickerBox.Show({
            buttons: [
                {
                    text: 'cancel',
                    type: 'cancel'
                }, {
                    text: 'Done',
                    handler: (data: any) => {
                        SetExercise({ distanceUnit: data.unit.value })
                        close('');
                    }
                }
            ],
            columns: [
                {
                    name: 'unit',
                    selectedIndex: exercise.distanceUnit === 'metric' ? 0 : 1,
                    options: [
                        {
                            text: 'Km',
                            value: 'metric'
                        }, {
                            text: 'Mile',
                            value: 'imperial'
                        }
                    ]
                }
            ]
        })
    }

    return (
        <>
            <IonPopover
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
            >
                <IonItem onClick={() => { close('note'); }} lines='full' button>Add Note</IonItem>
                {warmupset ? <IonItem lines='none' onClick={() => { close('warmup'); }} button>Add Warm-up Set</IonItem> : null}
                <IonItem lines='none' onClick={() => { close('replace'); }} button>Replace Exercise</IonItem>
                <IonItem onClick={() => { close('remove'); }} button lines='full'>Remove exercise</IonItem>
                <IonItem lines='full' onClick={() => { close('timer'); }} button>
                    Auto Rest Timer
                        <IonText color='medium' slot='end'>{getSelectedTimerValue('main')?.text || 'Off'}</IonText>
                </IonItem>
                {Object.keys(enables).map((key) => {
                    if (key === 'weight') {
                        return (
                            <IonItem key={key} onClick={HandleWeightUnitPicker} button  >
                                Weight Unit
                                <IonText slot='end'>{Unit(exercise.weightUnit, key)}</IonText>
                            </IonItem>
                        )
                    }
                    if (key === 'distance') {
                        return (
                            <IonItem key={key} onClick={HandleDistanceUnitPicker} button  >
                                Distance Unit
                                <IonText slot='end'>{Unit(exercise.distanceUnit, key)}</IonText>
                            </IonItem>
                        )
                    }
                })}
            </IonPopover>
            <IonButton onClick={
                (e: any) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e })
                }}>
                <IonIcon color='primary' icon={ellipsisVertical} />
            </IonButton>
        </>
    )
}
export default ExerciseItem