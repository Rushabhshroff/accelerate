import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonPage, IonText, IonTextarea, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { chevronDown, timerOutline, createOutline } from 'ionicons/icons'
import { getDaySlotFromTime } from '../../utils';
import ExerciseSelectModal from '../../modals/ExercisesSelectModal';
import useWorkout from '../../hooks/useWorkout';
import { Workout, WorkoutExercise } from '../../data/models/Workout';
import WorkoutManager from '../../utils/WorkoutManager';
import AlertBox from '../../modals/Alert';
import ExerciseItem from '../../components/Exercise/ExerciseItem';
import PopoverButton, { PopoverItem } from '../../components/PopoverButton';
import TimerButton from '../../components/TimerButton';
import ExerciseSvg from '../../svg/Exercise';
import Toast from '../../modals/Toast';
import Loader from '../../modals/Loader';
import ExerciseTimerText from '../../components/Exercise/ExerciseTimerText';
interface WorkoutPageProps {

}
const WorkoutPage: React.FC<WorkoutPageProps> = (props) => {
    const { workout, SetWorkout, exercises, SetExercises } = useWorkout();
    const router = useIonRouter()
    const Empty = () => {
        return (
            <div className='centering-box'>
                <ExerciseSvg style={{ width: '80%', height: 200 }} />
            </div>
        )
    }
    const PickExercises = () => {
        ExerciseSelectModal.ref?.show().then((list) => {
            if (!workout || !exercises) {
                return;
            }
            SetExercises({
                data: list.map<WorkoutExercise>((ex) => {
                    return new WorkoutExercise({
                        exerciseName: ex.exerciseName,
                        bodyPart: ex.bodyPart,
                        category: ex.category,
                        workoutId: workout?._id,
                        exerciseId: ex._id,
                        sets: [],
                        warmupset: [],
                        timestamp: Date.now()
                    })
                }), action: 'add'
            })
        })
    }
    const OnRemoveExecise = (id: string) => {
        let r = exercises?.filter((x) => x._id === id);
        SetExercises({ data: r, action: 'delete' })
    }
    const CancelWorkout = () => {
        AlertBox.Show('Discard Workout?', 'Are you sure you want to discard this workout? This cannot be undone.',
            [
                {
                    text: 'CANCEL',
                    type: 'cancel'
                }, {
                    text: 'DISCARD',
                    handler: () => {
                        WorkoutManager.cancel()
                        if (router.canGoBack()) {
                            router.goBack();
                        } else {
                            router.push('/main', 'root')
                        }
                    }
                }
            ]
        )
    }
    const Finish = () => {
        let savable = WorkoutManager.canSave()
        if (savable === true) {
            AlertBox.Show('Finish Workout?', 'All empty sets will be discarded when you finish this workout.Do you want to proceed?',
                [
                    {
                        type: 'cancel',
                        text: 'No'
                    },
                    {
                        text: 'Yes, Proceed',
                        handler: () => {
                            Loader.show();
                            WorkoutManager.finish().then(() => {
                                router.goBack();
                            }).catch((err) => {
                                Toast.Show(err.message, 1000)
                            }).finally(() => {
                                Loader.hide();
                            })
                        }
                    }
                ])
        } else {
            Toast.Show(savable, 1000);
        }
    }
    const getName = () => {
        return workout?.name || getDaySlotFromTime() + " Workout"
    }
    useEffect(() => {
        if (!workout) {
            router.goBack();
        }
        SetWorkout({ name: getName() })
        Workout.getAll().then(console.log)
    }, [])
    if (!workout) {
        return (
            null
        )
    }

    return (
        <IonPage>
            <IonHeader mode='md' className='ion-no-border'>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton icon={chevronDown} />
                    </IonButtons>
                    <IonButtons>
                        <TimerButton />
                    </IonButtons>

                    <IonButtons slot='end'>
                        <IonButton onClick={Finish} >
                            <IonText color='primary'>Finish</IonText>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonItem lines='none'>
                    <div>
                        <IonText>{getName()}</IonText>
                        <br />
                        <ExerciseTimerText style={{ fontSize: 12 }} />
                    </div>
                    <IonButtons style={{ marginLeft: 10 }}>
                        <PopoverButton icon={createOutline}>
                            <PopoverItem onClick={() => {
                                AlertBox.Show('Change Exercise Name', "Enter new name for the workout below", [
                                    {
                                        text: 'Cancel',
                                        type: 'cancel'
                                    }, {
                                        text: 'Update',
                                        handler: (data: any) => {
                                            if (data.name && data.name.length > 0) {
                                                SetWorkout({ name: data.name })
                                            }
                                        }
                                    }
                                ], [
                                    {
                                        name: 'name',
                                        type: 'text',
                                        placeholder: 'Enter name',
                                        value: getName(),
                                        label: 'Exercise Name'
                                    }
                                ])
                            }}>Edit Workout Name</PopoverItem>
                        </PopoverButton>
                    </IonButtons>
                </IonItem>
            </IonHeader>
            <IonContent>
                <div className='centering-box'>
                    <IonTextarea value={workout.note} onIonChange={e => SetWorkout({ note: e.detail.value || undefined })} style={{ padding: "0px 10px" }} placeholder='Workout Note' />
                    {exercises && exercises.length > 0
                        ?
                        <>
                            {exercises?.map((ex) => {
                                return (
                                    <ExerciseItem OnRequestRemove={() => OnRemoveExecise(ex._id)} key={ex._id} exercise={ex} />
                                )
                            })}
                        </> :
                        <Empty />
                    }
                    <IonButton onClick={PickExercises} fill='clear'>
                        <IonText color='primary'>+ Add Exercise</IonText>
                    </IonButton>
                    <IonButton onClick={CancelWorkout} color='dark' fill='outline'>
                        <IonText >Cancel Workout</IonText>
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default WorkoutPage;