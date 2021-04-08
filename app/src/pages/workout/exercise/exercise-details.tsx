import { IonButton, IonButtons, IonContent, IonIcon, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import SwipeableViews from 'react-swipeable-views'
import { ExerciseStats, ExerciseHistory, ExerciseInfo, Header } from '../../../components'
import { ExerciseData } from '../../../database/models/exercise-data'

export interface ExerciseDetailsPage extends RouteComponentProps<{ id: string }> {

}

export const ExerciseDetailsPage: React.FC<ExerciseDetailsPage> = (props) => {
    const router = useIonRouter();
    const { id } = props.match.params
    let exerciseInfo = ExerciseData.find(id)
    const info = exerciseInfo && exerciseInfo.instructions?.length > 0 || exerciseInfo?.mediaType !== ''
    const [tabindex, SetTabindex] = useState(0);
    var Views: any[] = []
    var Tabs: string[] = []
    if (!exerciseInfo) {
        router.goBack()
        return null;
    }
    if (exerciseInfo) {
        Views = [<ExerciseStats key='stats' exercise={exerciseInfo} />,
        <ExerciseHistory key='history' exercise={exerciseInfo} />]
        Tabs = [
            'Statestics',
            'History'
        ]
        if (info) {
            Views.unshift(<ExerciseInfo key='info' exercise={exerciseInfo} />)
            Tabs.unshift('Info')
        }
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
                <IonSegment onIonChange={e => SetTabindex(Number(e.detail.value))} value={tabindex.toString()} >
                    {Tabs.map((text, index) => {
                        return (
                            <IonSegmentButton key={index} value={index.toString()}>{text}</IonSegmentButton>
                        )
                    })}
                </IonSegment>
            </Header>

            <SwipeableViews style={{ height: '100%', width: '100%' }} index={tabindex} onChangeIndex={i => SetTabindex(i)} >
                {Views}
            </SwipeableViews>
        </IonPage>
    )
}