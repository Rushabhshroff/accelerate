import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, isPlatform, useIonModal } from '@ionic/react'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { ExerciseList, Header } from '../../../components'
import SwipeableViews from 'react-swipeable-views';
import { add, barbell } from 'ionicons/icons';
import { WorkoutSegment, RoutinesSegment } from '.'

export const WorkoutTab: React.FC<RouteComponentProps> = (props) => {
    const [segment, SetSegment] = useState<'workout' | 'routine'>('workout')
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
                        <IonSegmentButton value="workout">
                            <IonLabel>Workout</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="routine">
                            <IonLabel>Routines</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </div>
            </Header>

            <IonContent>
                <SwipeableViews style={{ width: '100%', height: '100%' }} index={segment == 'workout' ? 0 : 1} onChangeIndex={(i) => SetSegment(i == 0 ? 'workout' : 'routine')}>
                    <WorkoutSegment {...props} />
                    <RoutinesSegment {...props} />
                </SwipeableViews>
            </IonContent>
        </IonPage>
    )
}