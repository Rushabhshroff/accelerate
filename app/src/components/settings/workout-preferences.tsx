import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonIcon, IonItem, IonPage, IonSelect, IonSelectOption, IonText, IonTitle } from '@ionic/react'
import { musicalNoteOutline, volumeHighOutline } from 'ionicons/icons'
import React, { useEffect } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import { AppSettings, Sound, Sounds } from '../../utils'
import { Header } from '../core'


export interface WorkoutPreferences {

}
var mounted = false;
export const WorkoutPreferences: React.FC<WorkoutPreferences> = (props) => {
    const [appsettings, ApplySettings] = useAppSettings()
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Workout Preferences</IonTitle>
            </Header>
            <IonContent>
                <IonItem lines='none'>
                    <div>
                        <IonText className='block-text' >Keep Awake During Workout</IonText>
                        <IonText className='block-text text-light x-small' >Enable this if you don't want your phone to sleep while you're in a workout.</IonText>
                    </div>
                    <IonCheckbox onIonChange={(e) => ApplySettings({ screenAwake: e.detail.checked })} checked={appsettings.screenAwake} slot='end' />
                </IonItem>
                <IonItem lines='none'>
                    <div>
                        <IonText>Sound Effects</IonText>
                        <IonText className='block-text text-light x-small' >Disabling this dosen't affect timer sound.</IonText>
                    </div>
                    <IonCheckbox onIonChange={(e) => ApplySettings({ soundEffects: e.detail.checked })} checked={appsettings.soundEffects} slot='end' />
                </IonItem>
                <IonItem lines='none'>
                    <div>
                        <IonText>Timer Sound</IonText>

                    </div>
                    <IonSelect interface='popover' value={appsettings.restFinishSound} onIonChange={(e) => ApplySettings({ restFinishSound: e.detail.value })} slot='end' placeholder='Select Sound'>
                        {Object.keys(Sounds).map((key) => {
                            return (
                                <IonSelectOption onChange={(e) => {
                                    console.log(e)
                                }} key={key} value={key} style={{ textTransform: 'capitalize' }}>{key.replaceAll('_', ' ')}</IonSelectOption>
                            )
                        })}
                    </IonSelect>
                    <IonButtons slot='end'>
                        <IonButton onClick={() => Sound.play(appsettings.restFinishSound)}>
                            <IonIcon icon={volumeHighOutline} />
                        </IonButton>
                    </IonButtons>
                </IonItem>
                <IonItem lines='none'>
                    <IonText>Vibrate on Timer Finish</IonText>
                    <IonCheckbox onIonChange={(e) => ApplySettings({ vibrateOnRestFinish: e.detail.checked })} checked={appsettings.vibrateOnRestFinish} slot='end' />
                </IonItem>
            </IonContent>
        </IonPage>
    )
}