import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText, IonTitle, useIonAlert, useIonModal, useIonToast } from '@ionic/react'
import { chevronDown, create, createOutline, } from 'ionicons/icons'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Exercise, IExercise, IWorkout, Workout } from '../../database/models'
import { ExerciseValues } from '../../database/models/exercise-values'
import { useArrayReduer, useObjectReducer } from '../../hooks'
import { Duration, WorkoutController } from '../../utils'
import { Header, TouchableOpcity, WorkoutSvg } from '../core'
import { ExerciseList } from '../exercise'
import { ExerciseItem } from '../exercise/exercise-item'
import { CreateSuperset } from './create-superset'
import { ExerciseReorder } from './exercise-reorder'
import { SaveWorkout, ValidateWorkout } from './workout-functions'
import { WorkoutStatsHeader } from './workout-stats-header'
import './styles.scss'
import { TimerButton } from '../core/timer-button'
import { useMobileAds } from '../../hooks/useMobileAds'
export interface EditWorkout {
    liveMode?: boolean,
    templateMode?: boolean,
    onDismiss?: () => void,
    onDiscard?: () => void
    workout?: IWorkout,
    exercises?: IExercise[]
}

export const EditWorkout: React.FC<EditWorkout> = (props) => {
    const liveMode = props.liveMode
    const templateMode = props.templateMode
    const [ShowAlert] = useIonAlert()
    const [ShowToast] = useIonToast()
    const [workout, SetWorkout] = useObjectReducer<IWorkout>(props.workout || new Workout({ name: "Workout", startTimestamp: Date.now() }))
    const [exercises, SetExercises] = useArrayReduer<IExercise>(props.exercises || [])
    const [summation, SetSummation] = useState<ExerciseValues>(ExerciseValues.default)
    const { ShowInterstitial } = useMobileAds()
    const OnAddExercises = (exs: string[]) => {
        let add_exercises = exs.map((e) => {
            if (workout._id) {
                return Exercise.from(e, workout._id)
            } else {
                return new Exercise()
            }
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
            ExerciseValues.Add(sum, new Exercise(ex).sum());
        })
        SetSummation(sum)
    }
    const Save = () => {
        const f = async () => {
            try {
                await SaveWorkout(new Workout(workout), exercises.map((e) => new Exercise(e)), liveMode, templateMode);
                WorkoutController.reset()
                if (props.onDismiss) props.onDismiss()
                ShowInterstitial()
            } catch (err) {
                ShowToast(err.message, 1000)
            }
        }
        let valid = ValidateWorkout(exercises.map((e) => new Exercise(e)));
        if (!valid && !templateMode) {
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
    const [OpenEditWorkoutDetailsModal, CloseEditWorkoutDetailsModal] = useIonModal(() => <EditWorkoutDetails OnDismiss={CloseEditWorkoutDetailsModal} workout={workout} OnDone={(w) => SetWorkout(w)} templateMode={templateMode} />)
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={props.onDismiss}>
                        <IonIcon style={{ fontSize: 25 }} color='primary' icon={chevronDown} />
                    </IonButton>
                    {liveMode ? <TimerButton /> : null}
                </IonButtons>
                <TouchableOpcity >
                    <IonTitle className='block-text text-center' >{workout.name} </IonTitle>
                    {!templateMode ? <IonText className='block-text text-center text-light small'>{moment(workout.startTimestamp).format('MMM ddd DD yyy hh:mm A')}</IonText> : null}
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
            {liveMode ? <WorkoutStatsHeader liveMode={liveMode} workout={workout} summation={summation} /> : null}
            <IonContent>
                <EmptyListPlaceholder hide={exercises.length > 0} />
                {exercises.map((ex) => {
                    return (
                        <ExerciseItem OnMutate={OnMutation} OnRequestSuperset={OnRequestSuperset} OnRequestReorder={OnRequestReorder} liveMode={liveMode} key={ex._id} exercise={ex} OnRequestRemove={() => RemoveExercise(ex._id || '')} />
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
    workout: IWorkout,
    OnDismiss?: () => void
    OnDone?: (workout: IWorkout) => void,
    templateMode?: boolean
}
function EditWorkoutDetails(props: EditWorkoutDetails) {
    const [workout, SetWorkout] = useState(props.workout);
    const templateMode = props.templateMode
    return (
        <IonCard className='edit-details-form'>
            <IonCardHeader>
                <IonText className='block-text xx-large'>Edit {templateMode ? "Routine" : "Workout"} Details</IonText>
            </IonCardHeader>
            <IonItem className='form-input' lines='none'>
                <IonInput onIonChange={(e) => {
                    let x = Object.assign({}, workout, { name: e.detail.value })
                    SetWorkout(x)
                }} value={workout.name} placeholder='Workout Name' />
            </IonItem>
            {!templateMode ? <IonItem className='form-input' lines='none'>
                <IonDatetime onIonChange={(e) => {
                    if (e.detail.value) {
                        let x = Object.assign({}, workout, { startTimestamp: new Date(e.detail.value).getTime() })
                        SetWorkout(x)
                    }
                }} value={new Date(workout.startTimestamp).toISOString()} displayFormat='YYYY-MM-DD HH:mm A' pickerFormat='YYYY-MM-DDTHH:mm' placeholder='Start Time' />
            </IonItem> : null}
            {!templateMode ? <IonItem className='form-input' lines='none'>
                <IonDatetime onIonChange={(e) => {
                    if (e.detail.value) {
                        let x = Object.assign({}, workout, { endTimestamp: new Date(e.detail.value).getTime() })
                        SetWorkout(x)
                    }
                }} value={workout.endTimestamp ? new Date(workout.endTimestamp).toISOString() : undefined} displayFormat='YYYY-MM-DD HH:mm A' pickerFormat='YYYY-MM-DDTHH:mm' placeholder='End Time' />
            </IonItem> : null}
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
