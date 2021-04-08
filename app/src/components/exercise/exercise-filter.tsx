import { IonButton, IonButtons, IonChip, IonContent, IonIcon, IonPage, IonRow, IonText, IonTitle } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React, { useState } from 'react'
import { BodyParts, ExerciseEquipments } from '../../database'
import { Header } from '../core'

export interface ExerciseFilter {
    bodyparts: string[],
    equipments: string[]
    onDismiss: (res: { bodyparts: string[], equipments: string[] }) => void,
}

export const ExerciseFilter: React.FC<ExerciseFilter> = (props) => {
    const [bodyparts, SetBodyparts] = useState<string[]>(props.bodyparts)
    const [equipments, SetEquipments] = useState<string[]>(props.equipments)
    const OnClick = (key: string, type: 'bodypart' | 'equipment') => {
        if (type === 'bodypart') {
            if (bodyparts.includes(key)) {
                SetBodyparts(bodyparts.filter((k) => k !== key))
            } else {
                SetBodyparts([...bodyparts, key])
            }
        }
        if (type === 'equipment') {
            if (equipments.includes(key)) {
                SetEquipments(equipments.filter((k) => k !== key))
            } else {
                SetEquipments([...equipments, key])
            }
        }
    }
    const OnDismiss = () => {
        props.onDismiss({ equipments, bodyparts })
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={OnDismiss} slot='icons-only'>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonTitle>Apply Filters</IonTitle>
            </Header>
            <IonContent>
                <section>
                    <IonText>Bodyparts</IonText>
                    <IonRow style={{ flexWrap: 'wrap' }}>
                        {Object.keys(BodyParts).map((key) => {
                            return (
                                <IonChip key={key} onClick={() => OnClick(key, 'bodypart')} color={bodyparts.includes(key) ? 'primary' : 'dark'} outline={!bodyparts.includes(key)} >{BodyParts[key]}</IonChip>
                            )
                        })}
                    </IonRow>
                </section>
                <section>
                    <IonText>Equipments</IonText>
                    <IonRow style={{ flexWrap: 'wrap' }}>
                        {Object.keys(ExerciseEquipments).map((key) => {
                            return (
                                <IonChip key={key} onClick={() => OnClick(key, 'equipment')} color={equipments.includes(key) ? 'primary' : 'dark'} outline={!equipments.includes(key)}>{ExerciseEquipments[key]}</IonChip>
                            )
                        })}
                    </IonRow>
                </section>
            </IonContent>
        </IonPage>
    )
}