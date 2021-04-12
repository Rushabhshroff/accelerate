import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonPage, IonText, IonThumbnail, IonToolbar, isPlatform, useIonAlert, useIonModal, useIonRouter, useIonViewDidEnter } from '@ionic/react'
import { shareOutline, shareSocial } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { EditWorkout, ExerciseThumbnail, Header } from '../../components'
import { Loader } from '../../components/core/Loader'
import { PopoverButton, PopoverItem } from '../../components/core/Popover/popover-button'
import { RoutineToWorkout } from '../../components/workout/workout-functions'
import { ExerciseData } from '../../database'
import { WorkoutRoutine } from '../../database/models/workout-routine'
import { useEditRoutine } from '../../hooks/useEditRoutine'
import { useStartRoutine } from '../../hooks/useStartRoutine'

export interface WorkoutRoutinePage extends RouteComponentProps<{ id: string }> {

}
export const WorkoutRoutinesPage: React.FC<WorkoutRoutinePage> = (props) => {
    const router = useIonRouter()
    const [routine, SetRoutine] = useState<WorkoutRoutine | undefined>(undefined);
    const StartRoutine = useStartRoutine(routine)
    const EditRoutine = useEditRoutine(routine, () => {
        Refresh()
    });
    const [Alert] = useIonAlert()
    useEffect(() => {
        Refresh()
    }, [])
    const Refresh = () => {
        (async () => {
            let id = props.match.params.id
            let routine = await WorkoutRoutine.findById(id).then((res) => {
                return new WorkoutRoutine(res)
            })
            SetRoutine(routine)
        })().catch((err) => {
            router.goBack()
        })
    }
    if (!routine) {
        return <Loader />
    }
    const Delete = () => {
        Alert("Delete this routine? This action cannot be undone.", [
            { text: 'cancel', role: 'cancel' },
            {
                text: 'Yes, Delete', handler: async () => {
                    await routine.delete()
                    router.goBack()
                }
            }
        ])
    }
    const Duplicate = () => {
        Alert({
            header: "Duplicate",
            message: "Duplicate this Routine",
            inputs: [{ placeholder: "Routine Name", name: 'name' }],
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Save', handler: async (data) => {
                        let r = new WorkoutRoutine({ name: data.name || routine.name, exercises: routine.exercises })
                        await r.save();
                    }
                }
            ]
        })
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonItem lines='none'>
                    <div>
                        <IonText className='block-text'>{routine.name}</IonText>
                    </div>
                </IonItem>
                <IonButtons slot='end'>
                    {/*<IonButton>
                        <IonIcon icon={isPlatform('ios') ? shareOutline : shareSocial} />
                    </IonButton>*/}
                    <PopoverButton>
                        <PopoverItem onClick={EditRoutine} button >Edit</PopoverItem>
                        <PopoverItem onClick={Duplicate} button >Duplicate</PopoverItem>
                        <PopoverItem onClick={Delete} button >Delete</PopoverItem>
                    </PopoverButton>
                </IonButtons>
            </Header>
            <IonContent>
                {routine.exercises.map((ex, i) => {
                    let info = ExerciseData.find(ex.exerciseId);
                    return (
                        <IonItem routerLink={`/exercise/${ex.exerciseId}`} button key={i}>
                            <ExerciseThumbnail exerciseName={ex.exerciseName} thumbUrl={info?.thumbnail} />
                            <IonText className='x-small'>{ex.sets.length} x {ex.exerciseName}</IonText>
                        </IonItem>
                    )
                })}
            </IonContent>
            <section className='border-top'>
                <IonButton onClick={StartRoutine} fill='outline'>
                    Start Workout
                </IonButton>
            </section>
        </IonPage>
    )
}