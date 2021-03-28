import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonPage, IonReorder, IonReorderGroup, IonTitle } from '@ionic/react'
import { checkmark, close } from 'ionicons/icons'
import React, { useState } from 'react'
import { Exercise } from '../../database/models'
import { ExerciseData, ExerciseInfo } from '../../database/models/exercise-data'
import { Header } from '../core'
import { ExerciseListItem } from '../exercise/exercise-list-item'

export interface ExerciseReorder {
    exercises: Exercise[],
    OnDismiss?: () => void
    OnDone?: (exercses: Exercise[]) => void
}
export const ExerciseReorder: React.FC<ExerciseReorder> = (props) => {
    const [exercises, SetExercises] = useState(props.exercises)
    const exerciseInfo = exercises.map(e => ExerciseData.find(e.exerciseId) as ExerciseInfo)
    const OnDone = () => {
        if (props.OnDone) {
            props.OnDone(exercises)
        }
        if (props.OnDismiss) {
            props.OnDismiss()
        }
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={props.OnDismiss}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
                <IonTitle>Reorder Exercises</IonTitle>
            </Header>
            <IonContent>
                <IonReorderGroup disabled={false} onIonItemReorder={(e) => {
                    let reordered = e.detail.complete(exercises)
                    SetExercises(reordered)
                }}>
                    {exerciseInfo.map((ex) => {
                        return (
                            <ExerciseListItem exercise={ex} >
                                <IonReorder slot='end' />
                            </ExerciseListItem>
                        )
                    })}
                </IonReorderGroup>
                <IonFab slot='fixed' vertical='bottom' horizontal='end'>
                    <IonFabButton onClick={OnDone}>
                        <IonIcon icon={checkmark} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
}