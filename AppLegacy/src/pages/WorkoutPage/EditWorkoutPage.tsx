import { IonButton, IonButtons, IonContent, IonItem, IonPage, IonText, IonTextarea, useIonRouter } from '@ionic/react'
import { createOutline } from 'ionicons/icons'
import React, { useEffect, useReducer, useState } from 'react'
import { act } from 'react-dom/test-utils'
import { RouteComponentProps } from 'react-router'
import AlertBox from '../../modals/Alert'
import ExerciseItem from '../../components/Exercise/ExerciseItem'
import Header from '../../components/Header'
import Loader from '../../modals/Loader'
import Loading from '../../components/Loading'
import PopoverButton, { PopoverItem } from '../../components/PopoverButton'
import Toast from '../../modals/Toast'
import { Workout, WorkoutExercise } from '../../data/models/Workout'
import ExerciseSelectModal from '../../modals/ExercisesSelectModal'
const Empty = () => {
    return (
        <div className='centering-box'>
            <img style={{ margin: '15px 0', width: '80%', height: 150 }} src='/assets/svg/workingout.svg' />
        </div>
    )
}
interface EditWorkoutPageProps extends RouteComponentProps<{ id: string }> {

}
const EditWorkoutPage: React.FC<EditWorkoutPageProps> = (props) => {
    const { workout, SetWorkout, exercises, SetExercises } = useWorkoutTemplate();
    const [removedExercises, SetRemovedExercises] = useState<WorkoutExercise[]>([])
    const router = useIonRouter()
    const PickExercises = () => {
        if (!workout) {
            return;
        }
        ExerciseSelectModal.ref?.show().then((list) => {
            SetExercises(exercises.concat(list.map((ex) => {
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
            })))
        })
    }
    const OnRemoveExecise = (ex: WorkoutExercise) => {
        let x = [...removedExercises, ex];
        SetRemovedExercises(x);
        let r = exercises?.filter((x) => x._id !== ex._id);
        SetExercises(r);
    }
    const getName = () => {
        return workout?.name || ''
    }
    const Save = async () => {
        if (!exercises || exercises?.length <= 0 || !exercises.some((e) => e.sets.some((s) => !WorkoutExercise.isSetEmpty(s)))) {
            AlertBox.Show("Delete Workout?", "There are no valid exercises or sets in this workout. Do you wish to proceed deleting the workout?", [
                { type: 'cancel', text: 'Cancel' },
                {
                    text: 'Yes, Delete', handler: async () => {
                        Loader.show()
                        for (let ex of exercises) {
                            await ex.delete()
                        }
                        await workout?.delete()
                        Loader.hide();
                        router.goBack()
                    }
                }
            ])
            return
        } else {
            try {
                Loader.show()
                for(let ex of removedExercises){
                    await ex.delete()
                }
                for (let ex of exercises) {
                    await ex.save()
                }
                await workout?.save()
                router.goBack()
            } catch (err) {
                Toast.Show(err.message)
            } finally {
                Loader.hide();
            }
        }
    }
    useEffect(() => {
        (async () => {
            let { id } = props.match.params
            let iworkout = await Workout.findById(id);
            let workout = new Workout(iworkout);
            await workout.exercises().then((res) => {
                SetExercises(res)
                SetWorkout(workout);
            })
        })().catch((err) => {
            router.goBack()
        })
    }, [])
    return (
        <IonPage>
            <Header backButton noborder title={getName()}>
                <IonButtons slot='end'>
                    <IonButton onClick={Save} color='primary'>
                        Save
                    </IonButton>
                </IonButtons>
            </Header>
            {workout ? <>
                <IonItem lines='none'>
                    <div>
                        <IonText>{getName()}</IonText>
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
                                ],
                                    [
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
                <IonContent>
                    <div className='centering-box'>
                        <IonTextarea value={workout.note} onIonChange={e => SetWorkout({ note: e.detail.value || undefined })} style={{ padding: "0px 10px" }} placeholder='Workout Note' />
                        {exercises && exercises.length > 0
                            ?
                            <>
                                {exercises?.map((ex) => {
                                    return (
                                        <ExerciseItem OnRequestRemove={() => OnRemoveExecise(ex)} key={ex._id} exercise={ex} />
                                    )
                                })}
                            </> :
                            <Empty />
                        }
                        <IonButton onClick={PickExercises} fill='clear'>
                            <IonText color='primary'>+ Add Exercise</IonText>
                        </IonButton>
                    </div>
                </IonContent>
            </> : <Loading />}
        </IonPage>
    )
}

export default EditWorkoutPage


export function useWorkoutTemplate() {
    const WorkoutReducer = (state: Workout | undefined, action: Partial<Workout> | undefined) => {
        if (action == undefined) {
            return undefined
        }
        if (state === undefined) {
            return new Workout(action as Workout)
        }
        return new Workout({
            ...state,
            ...action
        })
    }
    const ExerciseReducer = (state: WorkoutExercise[], action: WorkoutExercise[]) => {
        return action;
    }
    const [workout, SetWorkout] = useReducer(WorkoutReducer, undefined)
    const [exercises, SetExercises] = useReducer(ExerciseReducer, []);
    return { workout, SetWorkout, exercises, SetExercises }
}