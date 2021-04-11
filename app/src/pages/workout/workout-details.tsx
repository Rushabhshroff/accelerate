import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonPage, IonText, IonToolbar, isPlatform, useIonAlert, useIonModal, useIonRouter } from '@ionic/react'
import { shareOutline, shareSocial } from 'ionicons/icons'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { EditWorkout, Header } from '../../components'
import { Loader } from '../../components/core/Loader'
import { PopoverButton, PopoverItem } from '../../components/core/Popover/popover-button'
import { ExerciseHistoryItem } from '../../components/exercise/exercise-history-item'
import { CreateRoutine, DeleteWorkout } from '../../components/workout/workout-functions'
import { WorkoutStatsHeader } from '../../components/workout/workout-stats-header'
import { Exercise, ExerciseData, ExerciseInfo, Workout } from '../../database'
import { ExerciseValues } from '../../database/models/exercise-values'

export interface WorkoutDetailsPage extends RouteComponentProps<{ id: string }> {

}
export const WorkoutDetailsPage: React.FC<WorkoutDetailsPage> = (props) => {
    const router = useIonRouter()
    const [Alert] = useIonAlert();
    const [workout, SetWorkout] = useState<undefined | Workout>(undefined)
    const [exercises, SetExercises] = useState<Exercise[]>([])
    const [OpenEditWorkout, DismissModal] = useIonModal(() => <EditWorkout templateMode={false} onDismiss={OnModalDismiss} liveMode={false} exercises={exercises} workout={workout} />)
    useEffect(() => {
        FetchWorkoutDetails()
    }, [])
    const FetchWorkoutDetails = () => {
        return (async () => {
            let w = new Workout(await Workout.findById(props.match.params.id));
            let exs = await w.exercises()
            SetExercises(exs)
            SetWorkout(w)
        })().catch((err) => {
            router.goBack()
        })
    }
    if (!workout) {
        return (
            <Loader />
        )
    }
    let summation = () => {
        let sum = Object.assign({}, ExerciseValues.default());
        exercises.forEach((ex) => {
            ExerciseValues.Add(sum, ex.sum());
        })
        return sum
    }
    const Delete = () => {
        Alert("Are you sure you want to delete this workout? This cannot be undone.", [
            { text: 'cancel', role: 'cancel' },
            {
                text: 'Yes, Delete', handler: async () => {
                    DeleteWorkout(workout, exercises)
                    router.goBack()
                }
            }
        ])
    }
    const CreateTemplate = () => {
        Alert({
            message: "Create Routine from this workout",
            inputs: [{ name: 'name', placeholder: "Routine Name" }],
            buttons: [{ text: 'Cancel', role: 'cancel' }, {
                text: 'Save', handler: (data) => {
                    CreateRoutine(data.name || workout.name, exercises)
                }
            }]
        })
    }

    const OnModalDismiss = () => {
        FetchWorkoutDetails();
        DismissModal()
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonItem lines='none'>
                    <div>
                        <IonText className='block-text'>{workout.name}</IonText>
                        <IonText className='block-text text-light small'>{moment(workout.startTimestamp).format("dddd DD/MM/yyyy hh:mm A")}</IonText>
                    </div>
                </IonItem>
                <IonButtons slot='end'>
                    <IonButton>
                        <IonIcon icon={isPlatform('ios') ? shareOutline : shareSocial} />
                    </IonButton>
                    <PopoverButton>
                        <PopoverItem onClick={() => OpenEditWorkout({ mode: 'ios', swipeToClose: true })} button >Edit</PopoverItem>
                        <PopoverItem onClick={() => CreateTemplate()} button >Save as Routine</PopoverItem>
                        <PopoverItem onClick={Delete} button >Delete</PopoverItem>
                    </PopoverButton>
                </IonButtons>
            </Header>
            <IonContent>
                <WorkoutStatsHeader summation={summation()} liveMode={false} workout={workout} />
                {exercises.map((ex) => {
                    let info = ExerciseData.find(ex.exerciseId)
                    return (
                        <ExerciseHistoryItem key={ex._id} nowWorkout={true} exercise={ex} exerciseInfo={info as ExerciseInfo} />
                    )
                })}
            </IonContent>
        </IonPage>
    )
}