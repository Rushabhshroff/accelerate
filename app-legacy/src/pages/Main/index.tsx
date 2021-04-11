import { IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonPage,  IonSegment, IonSegmentButton } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../../components/Header'

import {  barbellOutline,  settings} from 'ionicons/icons'
import "./Workout.scss"
import WorkoutInProgressBar from '../../components/WorkoutInProgressBar'

import WorkoutSegment from './WorkoutSegment'
import HistorySegment from './HistorySegment'
interface WorkoutProps {

}

const WorkoutTab: React.FC<WorkoutProps> = (props) => {

    const [segment, SetSegment] = useState('workout')
    return (
        <IonPage>
            <Header noborder title='Workout' >
                <IonButtons slot='end'>
                    <IonButton routerLink='/exercise-list'>
                        <IonIcon style={{ fontSize: 20 }} icon={barbellOutline} />
                    </IonButton>
                    <IonButton routerLink='/settings'>
                        <IonIcon style={{ fontSize: 20 }} icon={settings} />
                    </IonButton>
                </IonButtons>
            </Header>
            <div style={{ padding: '5px 15px' }}>
                <IonSegment mode='ios' value={segment} onIonChange={(e) => SetSegment(e.detail.value || 'workout')}>
                    <IonSegmentButton value='workout'>
                        <IonLabel>Workout</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value='history'>
                        <IonLabel>History</IonLabel>
                    </IonSegmentButton>
                </IonSegment>
            </div>

            <WorkoutSegment visible={segment === 'workout'} />
            <HistorySegment visible={segment === 'history'} />
            <WorkoutInProgressBar />
        </IonPage>
    )
}





export default WorkoutTab

