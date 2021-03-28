import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import SwipeableViews from 'react-swipeable-views'
import { ExerciseStats, ExerciseHistory, ExerciseInfo, Header } from '../../components'
import { ExerciseData } from '../../database/models/exercise-data'

export interface ExerciseDetailsPage extends RouteComponentProps<{ id: string }> {

}
const map: { [key: number]: string } = {
    0: 'info',
    1: 'stats',
    2: 'history',
}
const indexMap: { [key: string]: number } = {
    'info': 0,
    'stats': 1,
    'history': 2
}
export const ExerciseDetailsPage: React.FC<ExerciseDetailsPage> = (props) => {
    const router = useIonRouter();
    const { id } = props.match.params
    const screen = new URL(window.location.href).searchParams.get('screen')
    let exerciseInfo = ExerciseData.find(id)
    const [tabindex, SetTabindex] = useState(indexMap[screen || ''] || 0);
    if (!exerciseInfo) {
        router.goBack()
        return null;
    }
    return (
        <IonPage >
            <Header>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonButton onClick={() => router.goBack()}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{exerciseInfo.exerciseName}</IonTitle>
                </IonToolbar>
                <IonSegment onIonChange={e => SetTabindex(indexMap[e.detail.value as string])} value={map[tabindex]} >
                    <IonSegmentButton value='info'>Info</IonSegmentButton>
                    <IonSegmentButton value='stats'>Statestics</IonSegmentButton>
                    <IonSegmentButton value='history'>History</IonSegmentButton>
                </IonSegment>
            </Header>

            <SwipeableViews style={{ height: '100%', width: '100%' }} index={tabindex} onChangeIndex={i => SetTabindex(i)} >
                <ExerciseInfo exercise={exerciseInfo} />
                <ExerciseStats exercise={exerciseInfo} />
                <ExerciseHistory exercise={exerciseInfo} />
            </SwipeableViews>
        </IonPage>
    )
}