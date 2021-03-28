import { IonButton, IonButtons, IonItem, IonText, useIonRouter } from '@ionic/react'
import React from 'react'
import useWorkout from '../hooks/useWorkout'
import ExerciseTimerText from './Exercise/ExerciseTimerText';

export default function WorkoutInProgressBar() {
    const { workout, SetWorkout } = useWorkout();
    if (!workout) {
        return null
    }
    return (
        <IonItem  routerLink='/workout-page' routerDirection='forward' color='primary' button lines='none'>
            <IonText>Workout in progress </IonText>
            <ExerciseTimerText style={{ marginLeft: 10 }} />
            <IonButtons slot='end'>
                <IonButton>
                    <IonText>Resume</IonText>
                </IonButton>
            </IonButtons>
        </IonItem>
    )
}