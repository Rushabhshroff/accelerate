import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonPage, IonText, useIonAlert, useIonModal } from '@ionic/react'
import { add } from 'ionicons/icons'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { EditWorkout, HorizontalCalender } from '../../../components'
import { WorkoutHistoryList } from '../../../components/workout/workout-history-list'
import { Exercise, IWorkout, Workout } from '../../../database/models'
import { AppSettings, WorkoutController } from '../../../utils'
import {PowerManagement} from '@ionic-native/power-management'
import './styles.scss'

export const WorkoutSegment: React.FC<RouteComponentProps> = (props) => {
    const [date, SetDate] = useState(moment())
    const [Alert] = useIonAlert()
    const [workout, SetWorkout] = useState<IWorkout | undefined>(WorkoutController.active)
    const [exercises, SetExercises] = useState<Exercise[]>(WorkoutController.exercises)
    const [OpenWorkout, CloseWorkout] = useIonModal(() => <EditWorkout liveMode={WorkoutController.active?._id === workout?._id} exercises={exercises} workout={workout} onDismiss={CloseWorkout} onDiscard={OnDiscard} />);
    useEffect(() => {
        if (workout) {
            OpenWorkout({ mode: 'ios', swipeToClose: true })
        }
    }, [workout])
    const HandleWorkoutPress = () => {
        if (date.isBefore(moment())) {
            if (date.isSame(moment(), 'date')) {
                if (WorkoutController.active) {
                    Alert("If you start a new workout, your old workout will be discarded and permanently deleted.", [
                        { text: 'Resume Workout', handler: () => ResumeWorkout() },
                        { text: 'Start a new workout', handler: () => StartNewWorkout() },
                        { text: 'cancel', role: 'cancel' }
                    ])
                } else {
                    StartNewWorkout()
                }
            } else {
                StartNewWorkout()
            }
        }
    }
    const ResumeWorkout = () => {
        if (workout?._id === WorkoutController.active?._id) {
            OpenWorkout({ mode: 'ios', swipeToClose: true })
        } else {
            SetWorkout(WorkoutController.active)
            SetExercises(WorkoutController.exercises);
        }
    }
    const StartNewWorkout = () => {
        let workout = new Workout({
            name: "Workout",
            startTimestamp: date.toDate().getTime(),
        })
        let exercises: Exercise[] = [];
        if (date.isSame(moment(), 'date')) {
            workout.startTimestamp = moment().toDate().getTime()
            WorkoutController.active = workout;
            WorkoutController.exercises = exercises;
            if(AppSettings.current.screenAwake){
                PowerManagement.acquire()
                WorkoutController.wakelockAcquired = true;
            }
            WorkoutController.events.emit('change')
        }
        SetWorkout(workout);
        SetExercises(exercises);
    }
    const OnDiscard = () => {
        Alert('Discard Workout? This cannot be undone', [
            {
                text: 'Discard', handler: () => {
                    WorkoutController.reset();
                    CloseWorkout()
                }
            },
            { text: 'Cancel', role: 'cancel' }
        ])
    }
    return (
        <>
            <HorizontalCalender onSelectDate={SetDate} />
            <WorkoutHistoryList date={date.toDate()} />
            <IonFab className={date.isAfter(moment()) ? 'fab-hide' : ''} slot='fixed' vertical='bottom' horizontal='end'>
                <IonFabButton onClick={HandleWorkoutPress}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </>
    )
}
