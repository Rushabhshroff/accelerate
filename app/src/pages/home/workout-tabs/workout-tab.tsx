import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, isPlatform, useIonModal } from '@ionic/react'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { ExerciseList, Header } from '../../../components'
import SwipeableViews from 'react-swipeable-views';
import { add, barbell } from 'ionicons/icons';
import { WorkoutSegment, RoutinesSegment } from '.'
import { PendingWorkout } from '../../../components/workout/pending-workout';

export const WorkoutTab: React.FC<RouteComponentProps> = (props) => {
    const [segment, SetSegment] = useState<'workout' | 'routine'>('routine')
    const [ShowExerciseList, HideExerciseList] = useIonModal(() => <ExerciseList onDismiss={HideExerciseList} />)
    return (
        <IonPage>
            <Header>
                <IonToolbar>
                    <IonTitle>Workouts</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton routerLink='/exercises' routerDirection='forward'>
                            <IonIcon icon={barbell} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <div style={{ padding: isPlatform('ios') ? '5px 15px' : '' }}>
                    <IonSegment onIonChange={e => SetSegment(e.detail.value as 'workout' | 'routine' || 'workout')} value={segment}>
                        <IonSegmentButton value="routine">
                            <IonLabel>Routines</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="workout">
                            <IonLabel>History</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
            </Header>

            <SwipeableViews style={{ width: '100%', height: '100%' }} index={segment == 'workout' ? 1 : 0} onChangeIndex={(i) => SetSegment(i == 0 ? 'routine' : 'workout')}>
                <RoutinesSegment {...props} />
                <WorkoutSegment {...props} />
            </SwipeableViews>
            <div style={{ marginBottom: 0 }}>
                <PendingWorkout />
            </div>
        </IonPage>
    )
}