import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonInput, IonItem, IonPage, IonSelect, IonSelectOption, IonTitle, useIonLoading, useIonRouter } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React, { useRef } from 'react'
import { BodyParts, ExerciseCategories, ExerciseData, ExerciseEquipments } from '../../database'
import { useObjectReducer } from '../../hooks'
import { useInAppPurchase } from '../../hooks/useInAppPurchase'
import { useMobileAds } from '../../hooks/useMobileAds'
import { Header } from '../core'

export interface CreateExercise {
    onDismiss?: () => void
}

export const CreateExercise: React.FC<CreateExercise> = (props) => {
    const router = useIonRouter()
    const { fitnessPlus } = useInAppPurchase()
    const {ShowInterstitial} = useMobileAds()
    const [form, SetForm] = useObjectReducer<any>({
        exerciseName: undefined,
        bodypart: undefined,
        equipment: undefined,
        category: undefined
    })
    const OnSubmit = async () => {
        const customExCount = ExerciseData.dataset.filter((e) => e.custom === true).length
        if (customExCount >= 10 && !fitnessPlus && !props.onDismiss) {
            router.push('/subscription')
        } else {
            await ExerciseData.Create(form)
            Dismiss()
            ShowInterstitial()
        }
    }
    const CanSave = () => {
        for (let k in form) {
            //@ts-ignore
            if (form[k] == undefined) {
                return false
            }
        }
        return true
    }
    const Dismiss = () => {
        if (props.onDismiss) {
            props.onDismiss()
        } else {
            router.goBack()
        }
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={Dismiss}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonTitle>Create Exercise</IonTitle>
            </Header>
            <IonContent>
                <section>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <IonItem lines='none' className='form-input my-2'>
                            <IonInput onIonChange={(e) => SetForm({ exerciseName: e.detail.value })} placeholder='Exercise Name' />
                        </IonItem>
                        <IonItem lines='none' className='form-input'>
                            <IonSelect onIonChange={(e) => SetForm({ category: e.detail.value })} style={{ width: '100%' }} placeholder='Select Exercise Type'>
                                {Object.keys(ExerciseCategories).map((k) => {
                                    return (
                                        <IonSelectOption key={k} value={k} >{ExerciseCategories[k]}</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                        <IonItem lines='none' className='form-input my-2'>
                            <IonSelect onIonChange={(e) => SetForm({ bodypart: e.detail.value })} style={{ width: '100%' }} placeholder='Select Body Muscle'>
                                {Object.keys(BodyParts).map((k) => {
                                    return (
                                        <IonSelectOption key={k} value={k} >{BodyParts[k]}</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                        <IonItem lines='none' className='form-input my-2'>
                            <IonSelect onIonChange={(e) => SetForm({ equipment: e.detail.value })} style={{ width: '100%' }} placeholder='Select Equipment'>
                                {Object.keys(ExerciseEquipments).map((k) => {
                                    return (
                                        <IonSelectOption key={k} value={k} >{ExerciseEquipments[k]}</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                        <IonButton onClick={OnSubmit} disabled={!CanSave()} expand='full'>Create Exercise</IonButton>
                    </form>
                </section>
            </IonContent>
        </IonPage>
    )
}