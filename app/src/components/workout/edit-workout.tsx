import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText, IonTitle, useIonAlert, useIonModal, useIonToast } from '@ionic/react'
import { chevronDown, create, createOutline, } from 'ionicons/icons'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Exercise, Workout } from '../../database/models'
import { ExerciseValues } from '../../database/models/exercise-values'
import { useArrayReduer, useObjectReducer } from '../../hooks'
import { Duration, WorkoutController } from '../../utils'
import { Header, TouchableOpcity, WorkoutSvg } from '../core'
import { ExerciseList } from '../exercise'
import { ExerciseItem } from '../exercise/exercise-item'
import { CreateSuperset } from './create-superset'
import { ExerciseReorder } from './exercise-reorder'
import { SaveWorkout, ValidateWorkout } from './save-workout'
import './styles.scss'
import { TimerButton } from '../core/timer-button'
export interface EditWorkout {
    liveMode?: boolean,
    onDismiss?: () => void,
    onDiscard?: () => void
    workout?: Workout,
    exercises?: Exercise[]
}

export const EditWorkout: React.FC<EditWorkout> = (props) => {
    const liveMode = props.liveMode
    const [ShowAlert] = useIonAlert()
    const [ShowToast] = useIonToast()
    const [workout, SetWorkout] = useObjectReducer(props.workout || new Workout({ name: "Workout", startTimestamp: Date.now() }))
    const [exercises, SetExercises] = useArrayReduer(props.exercises || [])
    const [summation, SetSummation] = useState<ExerciseValues>(ExerciseValues.default)
    const OnAddExercises = (exs: string[]) => {
        let add_exercises = exs.map((e) => {
            return Exercise.from(e, workout._id)
        })
        SetExercises([...exercises, ...add_exercises])
    }
    const RemoveExercise = (exId: string) => {
        SetExercises(exercises.filter(e => e._id !== exId))
    }
    const OnRequestReorder = () => {
        ShowReorderModal({ mode: 'ios', swipeToClose: true })
    }
    const OnRequestSuperset = () => {
        OpenSupersetModal({ mode: 'ios', swipeToClose: true })
    }
    const OnMutation = () => {
        RefreshSummation()
    }
    const RefreshSummation = () => {
        let sum = Object.assign({}, ExerciseValues.default());
        exercises.forEach((ex) => {
            ExerciseValues.Add(sum, ex.sum());
        })
        SetSummation(sum)
    }
    const Save = () => {
        const f = async () => {
            try {
                await SaveWorkout(workout, exercises);
                WorkoutController.reset()
                if (props.onDismiss) props.onDismiss()
            } catch (err) {
                ShowToast(err.message, 1000)
            }
        }
        let valid = ValidateWorkout(exercises);
        if (!valid) {
            ShowAlert('There are invalid sets. They will be discarded if you continue.', [
                { text: 'continue', handler: () => f() },
                { text: 'Fix it', role: 'cancel' }
            ])
        } else {
            f();
        }
    }
    const [OpenExerciseModal, CloseExerciseModal] = useIonModal(() => <ExerciseList onSelectionChange={OnAddExercises} selectionMode={true} selectionType='multiple' onDismiss={CloseExerciseModal} />)
    const [ShowReorderModal, CloseReorderModal] = useIonModal(() => <ExerciseReorder OnDismiss={CloseReorderModal} exercises={exercises} OnDone={(ex) => SetExercises([...ex])} />)
    const [OpenSupersetModal, CloseSupersetModal] = useIonModal(() => <CreateSuperset OnDismiss={CloseSupersetModal} exercises={exercises} OnDone={(ex) => SetExercises([...ex])} />)
    const [OpenEditWorkoutDetailsModal, CloseEditWorkoutDetailsModal] = useIonModal(() => <EditWorkoutDetails OnDismiss={CloseEditWorkoutDetailsModal} workout={workout} OnDone={(w) => SetWorkout(w)} />)
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={props.onDismiss}>
                        <IonIcon style={{ fontSize: 25 }} color='primary' icon={chevronDown} />
                    </IonButton>
                    {liveMode ? <TimerButton /> : null}
                </IonButtons>
                <TouchableOpcity>
                    <IonTitle className='block-text text-center' >{workout.name} </IonTitle>
                    <IonText className='block-text text-center text-light small'>{moment(workout.startTimestamp).format('MMM ddd DD yyy hh:mm A')}</IonText>
                </TouchableOpcity>
                <IonButtons slot='end'>
                    <IonButton onClick={() => OpenEditWorkoutDetailsModal({ mode: 'ios', swipeToClose: true, cssClass: 'autosized-modal', showBackdrop: true })}>
                        <IonIcon color='primary' icon={createOutline} />
                    </IonButton>
                    <IonButton onClick={Save}>
                        <IonText color='primary' >{props.liveMode ? "Finish" : "Save"}</IonText>
                    </IonButton>

                </IonButtons>

            </Header>
            {liveMode ? <IonItem lines='full'>
                <DurationText liveMode={liveMode} workout={workout} />
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
            </IonItem> : null}
            <IonContent>
                <EmptyListPlaceholder hide={exercises.length > 0} />
                {exercises.map((ex) => {
                    return (
                        <ExerciseItem OnMutate={OnMutation} OnRequestSuperset={OnRequestSuperset} OnRequestReorder={OnRequestReorder} liveMode={liveMode} key={ex._id} exercise={ex} OnRequestRemove={() => RemoveExercise(ex._id)} />
                    )
                })}
                <section>
                    <IonButton onClick={() => OpenExerciseModal({ mode: 'ios' })}>+ Add Exercise</IonButton>
                    {liveMode ? <IonButton onClick={props.onDiscard} fill='clear' color='danger'>Discard Workout</IonButton> : null}
                </section>
            </IonContent>
        </IonPage>
    )
}

function EmptyListPlaceholder(props: any) {
    if (props.hide) {
        return null
    }
    return (
        <div className='all-center pt-5 pb-2'>
            <WorkoutSvg style={{ maxWidth: 200 }} />
            <IonText className='text-block'>Get Started</IonText>
            <IonText className='text-block text-light small'>Add an exercise to start workout</IonText>
        </div>
    )
}

interface EditWorkoutDetails {
    workout: Workout,
    OnDismiss?: () => void
    OnDone?: (workout: Workout) => void
}
function EditWorkoutDetails(props: EditWorkoutDetails) {
    const [workout, SetWorkout] = useState(props.workout);

    return (
        <IonCard className='edit-details-form'>
            <IonCardHeader>
                <IonText className='block-text xx-large'>Edit Workout Details</IonText>
            </IonCardHeader>
            <IonItem className='form-input' lines='none'>
                <IonInput onIonChange={(e) => {
                    let x = Object.assign({}, workout, { name: e.detail.value })
                    SetWorkout(x)
                }} value={workout.name} placeholder='Workout Name' />
            </IonItem>
            <IonItem className='form-input' lines='none'>
                <IonDatetime onIonChange={(e) => {
                    if (e.detail.value) {
                        let x = Object.assign({}, workout, { startTimestamp: new Date(e.detail.value).getTime() })
                        SetWorkout(x)
                    }
                }} value={new Date(workout.startTimestamp).toISOString()} displayFormat='YYYY-MM-DD HH:mm A' pickerFormat='YYYY-MM-DDTHH:mm' placeholder='Start Time' />
            </IonItem>
            <IonItem className='form-input' lines='none'>
                <IonDatetime onIonChange={(e) => {
                    if (e.detail.value) {
                        let x = Object.assign({}, workout, { endTimestamp: new Date(e.detail.value).getTime() })
                        SetWorkout(x)
                    }
                }} value={workout.endTimestamp ? new Date(workout.endTimestamp).toISOString() : undefined} displayFormat='YYYY-MM-DD HH:mm A' pickerFormat='YYYY-MM-DDTHH:mm' placeholder='End Time' />
            </IonItem>
            <IonButton onClick={() => {
                if (!workout.name) {
                    return;
                }
                if (props.OnDone) {
                    props.OnDone(workout)
                }
                if (props.OnDismiss) {
                    props.OnDismiss()
                }
            }} expand='full'>
                Save
            </IonButton>
        </IonCard>
    )
}

interface DurationText {
    workout: Workout
    liveMode?: boolean
}
function DurationText(props: DurationText) {
    const { liveMode, workout } = props
    const { startTimestamp, endTimestamp } = workout
    const [duration, SetDuration] = useState(new Duration(liveMode ? Date.now() - startTimestamp : 0))
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = undefined
        if (endTimestamp) {
            SetDuration(new Duration(Math.abs(startTimestamp - endTimestamp)))
        } else {
            if (liveMode) {
                interval = setInterval(() => {
                    let dur = new Duration(Date.now() - startTimestamp)
                    SetDuration(dur);
                }, 1000)
            } else {
                SetDuration(new Duration())
            }
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [workout])
    return (
        <IonCol className='text-center'>
            <IonText className='block-text text-light small'>Duration</IonText>
            <IonText className='block-text small'>{duration.toString()}</IonText>
        </IonCol>
    )
}