import { IonButton, IonButtons, IonContent, IonItem, IonPage, IonText, IonTextarea, useIonRouter } from '@ionic/react'
import { createOutline } from 'ionicons/icons'
import React, { useEffect, useReducer, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import AlertBox from '../../modals/Alert'
import ExerciseItem from '../../components/Exercise/ExerciseItem'
import Header from '../../components/Header'
import PopoverButton, { PopoverItem } from '../../components/PopoverButton'
import Toast from '../../modals/Toast'
import { WorkoutExercise } from '../../data/models/Workout'
import WorkoutTemplate from '../../data/models/WorkoutTemplate'
import ExerciseSelectModal from '../../modals/ExercisesSelectModal'
const Empty = () => {
    return (
        <div className='centering-box'>
            <img style={{ margin: '15px 0', width: '80%', height: 150 }} src='/assets/svg/workingout.svg' />
        </div>
    )
}
interface WorkoutTemplatePageProps extends RouteComponentProps<{ id?: string }> {

}
const WorkoutTemplatePage: React.FC<WorkoutTemplatePageProps> = (props) => {
    const { workout, SetWorkout, exercises, SetExercises } = useWorkoutTemplate();
    const router = useIonRouter()
    const PickExercises = () => {
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
    const OnRemoveExecise = (id: string) => {
        let r = exercises?.filter((x) => x._id !== id);
        SetExercises(r);
    }
    const getName = () => {
        return workout.name || ''
    }
    useEffect(() => {
        let { id } = props.match.params;
        (async () => {
            if (id) {
                let template = await WorkoutTemplate.findById(id)
                SetWorkout(template);
                SetExercises(template.exercises.map((ex) => new WorkoutExercise(ex, true)))
            }
        })().catch((err) => {
            router.goBack()
        })

    }, [])
    const Save = async () => {
        if (exercises.length > 0) {
            console.log(exercises);
            workout.exercises = exercises;
            SetWorkout({ exercises: exercises })
            await workout.save()
            Toast.Show('Template Saved!', 1000)
            router.goBack()
        } else {
            Toast.Show('Please add some exercises before saving!', 1000)
        }
    }
    return (
        <IonPage>
            <Header backButton noborder title={getName()}>
                <IonButtons slot='end'>
                    <IonButton onClick={Save} color='primary'>
                        Save
                    </IonButton>
                </IonButtons>
            </Header>
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
                                    <ExerciseItem OnRequestRemove={() => OnRemoveExecise(ex._id)} key={ex._id} exercise={ex} />
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
        </IonPage>
    )
}

export default WorkoutTemplatePage


export function useWorkoutTemplate() {
    const WorkoutTemplateReducer = (state: WorkoutTemplate, action: Partial<WorkoutTemplate>) => {
        return new WorkoutTemplate({
            ...state,
            ...action
        })
    }
    const ExerciseReducer = (state: WorkoutExercise[], action: WorkoutExercise[]) => {
        return action;
    }
    const [workout, SetWorkout] = useReducer(WorkoutTemplateReducer, new WorkoutTemplate({
        name: "Workout Template",
        exercises: []
    }))
    const [exercises, SetExercises] = useReducer(ExerciseReducer, []);
    return { workout, SetWorkout, exercises, SetExercises }
}