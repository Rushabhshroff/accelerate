import { IonButton, IonButtons, IonCol, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, isPlatform, useIonRouter } from '@ionic/react'
import React, { useEffect, useReducer, useState } from 'react'
import Header from '../../components/Header'
import moment from 'moment'
import { barbell, shareOutline, shareSocial, timer, walk } from 'ionicons/icons'
import PopoverButton, { PopoverItem } from '../../components/PopoverButton'
import '../Main/Workout.scss'
import { Workout, WorkoutExercise } from '../../data/models/Workout'
import { Convert, Unit } from '../../utils/Units'
import { Settings } from '../Settings/hook'
import Loading from '../../components/Loading'
import { RouteComponentProps, useLocation } from 'react-router'
import Loader from '../../modals/Loader'
import AlertBox from '../../modals/Alert'
import WorkoutTemplate from '../../data/models/WorkoutTemplate'
import Toast from '../../modals/Toast'
import WorkoutManager from '../../utils/WorkoutManager'
interface WorkoutInfoPageProps extends RouteComponentProps<{ id: string }> {

}
const StatItem = (p: { icon: any, value?: string }) => {
    return (
        <IonCol className='history-item-stat' size='3'>
            <IonIcon icon={p.icon} />
            <IonLabel>{p.value}</IonLabel>
        </IonCol>
    )
}
const WorkoutInfoPage: React.FC<WorkoutInfoPageProps> = (props) => {
    const [workout, SetWorkout] = useState<Workout | undefined>(undefined)
    const [exercises, SetExercises] = useState<WorkoutExercise[]>([])
    const { pathname } = useLocation()
    const router = useIonRouter()
    const Total = () => {
        if (exercises.length <= 0) {
            return undefined;
        }
        let total = exercises.map((t) => {
            return t.total()
        }).reduce((a, b) => {
            a.distance.value += Convert(b.distance.unit, a.distance.unit, 'weight', b.distance.value)
            a.weight.value += Convert(b.weight.unit, a.weight.unit, 'distance', b.weight.value)
            return a;
        })
        total.distance.value = Convert(total.distance.unit, Settings.current.distanceUnit, 'distance', total.distance.value);
        total.weight.value = Convert(total.weight.unit, Settings.current.weightUnit, 'weight', total.weight.value);
        total.distance.unit = Settings.current.distanceUnit
        total.weight.unit = Settings.current.weightUnit
        return total
    }
    let total = Total()
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

    }, [pathname])
    const PerformAgain = () => {
        if (!workout) {
            return;
        }
        if (WorkoutManager.workout) {
            AlertBox.Show('Workout in Progress', "There is workout in progress. Do you want to cancel it?", [
                { type: 'cancel', text: 'Cancel' },
                {
                    text: 'Yes, Discard', handler: () => {
                        WorkoutManager.cancel();
                        WorkoutManager.startFrom(workout, exercises);
                        router.push('/workout-page', 'forward', 'replace');
                    }
                }
            ])
        } else {
            WorkoutManager.startFrom(workout, exercises);
            router.push('/workout-page', 'forward', 'replace');
        }
    }
    const Delete = () => {
        AlertBox.Show('Delete Workout?', 'Are you sure you want to delete this workout? This cannot be undone', [
            {
                type: 'cancel',
                text: 'Cancel'
            },
            {
                text: 'Yes, Delete',
                handler: async () => {
                    try {
                        Loader.show()
                        for (let ex of exercises) {
                            await ex.delete()
                        }
                        await workout?.delete()
                        router.goBack();
                    } catch (err) {
                        console.log(err)
                    } finally {
                        Loader.hide();
                    }
                }
            }
        ])
    }
    const CreateWorkoutTemplate = async () => {
        AlertBox.Show('Create Workout Template', 'Enter name for the workout template', [
            { text: 'cancel', type: 'cancel' },
            {
                text: 'Save', handler: async (data: any) => {
                    if (workout) {
                        try {
                            let template = await WorkoutTemplate.parseWorkout(workout);
                            template.name = data.name
                            await template.save();
                            workout.templateId = template._id;
                            await workout.save()
                            SetWorkout(new Workout(workout));
                            Toast.Show('Template created sucessfully!', 1000);
                        } catch (err) {
                            Toast.Show(err.message, 1000)
                        }
                    }
                }
            }
        ], [
            { name: 'name', value: workout?.name, type: 'text' }
        ])
    }
    return (
        <IonPage>
            <Header noborder backButton >
                <IonButtons slot='end'>
                    <IonButton>
                        <IonIcon icon={isPlatform('ios') ? shareOutline : shareSocial} />
                    </IonButton>
                    <PopoverButton>
                        <PopoverItem routerLink={`/workout/edit/${props.match.params.id}`}>Edit Workout</PopoverItem>
                        <PopoverItem onClick={CreateWorkoutTemplate}>Save as Workout Template</PopoverItem>
                        <PopoverItem onClick={Delete}>Delete Workout</PopoverItem>
                    </PopoverButton>
                </IonButtons>
            </Header>
            {workout ? <>
                <IonItem lines='none'>
                    <div>
                        <IonText style={{ fontSize: 25 }}>{workout.name}</IonText>
                        <br />
                        <IonText className='light-text'>{moment(workout.startTimestamp).format('dddd, do MMMM, YYYY, hh:mm A')}</IonText>
                    </div>
                </IonItem>
                <IonContent>
                    <IonRow className='light-text'>
                        <StatItem icon={timer} value={`${workout.timeString().replace(/0?0h|0?0m|0?0s/g, '')}`} />
                        <StatItem icon={barbell} value={`${total?.weight.value} ${Unit(total?.weight.unit, 'weight')}`} />
                        <StatItem icon={walk} value={`${total?.distance.value} ${Unit(total?.distance.unit, 'distance')}`} />
                    </IonRow>
                    <IonList>
                        {exercises.map((ex) => {
                            return (
                                <IonItem key={ex._id} lines='none'>
                                    <div style={{ width: '100%' }}>
                                        <IonText color='primary' style={{ fontWeight: 'bold' }}>{ex.exerciseName}</IonText>
                                        {ex.sets.map((s, i) => {
                                            return (
                                                <IonRow key={s._id}>
                                                    <IonCol size="1">{i + 1}</IonCol>
                                                    <IonCol size="11">{ex.WorkoutSetToText(s)}</IonCol>
                                                </IonRow>
                                            )
                                        })}
                                    </div>
                                </IonItem>
                            )
                        })}
                    </IonList>
                </IonContent>
                <div className='centering-box'>
                    <IonButton onClick={PerformAgain} style={{ width: '80%', margin: '10px 0' }} expand='full'>
                        <IonLabel>Perform Again</IonLabel>
                    </IonButton>
                </div>
            </>
                :
                <Loading />}
        </IonPage>
    )
}

export default WorkoutInfoPage;