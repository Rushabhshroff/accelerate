import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonPage, IonText, IonTitle } from '@ionic/react'
import { barbell, bulbOutline, documentLockOutline, exitOutline, headsetOutline, moonOutline, personOutline, readerOutline, refresh, share, shareOutline } from 'ionicons/icons'
import React from 'react'
import { logo, onlyRulerOutline, plusText } from '../../icons'
import { Header } from '../core'
import { version } from '../../../package.json'
import { Auth } from '../../api'
import { Plugins } from '@capacitor/core'
export interface Settings {

}
export const Settings: React.FC<Settings> = (props) => {
    const ShareApp = () => {
        Plugins.Share.share({
            dialogTitle: "Share App",
            title: "Download Accelerate Fitness - Workout Traker,Planner & Weight Lifting Logs",
            text: "Download Accelerate App,\nGet Strong by logging your workout and tracking your progress with Accelerate - for Free\nDownload Link: https://play.google.com/store/apps/details?id=fitness.accelerate",
        })
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>App Settings</IonTitle>
            </Header>
            <IonContent>
                <IonItemGroup>
                    <IonItemDivider>Account</IonItemDivider>
                    <IonItem routerLink='/edit-profile' button detail lines='none'>
                        <IonIcon slot='start' icon={personOutline} />
                        <IonText>Profile</IonText>
                    </IonItem>
                    <IonItem routerLink='/subscription/manage' button detail lines='none'>
                        <IonIcon slot='start' icon={plusText} />
                        <IonText>Manage Subscription</IonText>
                    </IonItem>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>Preferences</IonItemDivider>
                    <IonItem routerLink='/settings/workout' button detail lines='none'>
                        <IonIcon slot='start' icon={barbell} />
                        <IonText>Workout</IonText>
                    </IonItem>
                    <IonItem routerLink='/settings/units' button detail lines='none'>
                        <IonIcon slot='start' icon={onlyRulerOutline} />
                        <IonText>Units</IonText>
                    </IonItem>
                    <IonItem routerLink='/settings/theme' button detail lines='none'>
                        <IonIcon slot='start' icon={moonOutline} />
                        <IonText>Theme</IonText>
                    </IonItem>
                    <IonItem routerLink='/export-data' button detail lines='none'>
                        <IonIcon slot='start' icon={exitOutline} />
                        <IonText>Export Data</IonText>
                    </IonItem>
                    <IonItem onClick={ShareApp} button lines='none'>
                        <IonIcon slot='start' icon={shareOutline} />
                        <IonText>Share App</IonText>
                    </IonItem>
                    {/*<IonItem button detail lines='none'>
                        <IonIcon slot='start' icon={refresh} />
                        <IonText color='danger'>Reset Data</IonText>
    </IonItem>*/}
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>Help</IonItemDivider>
                    <IonItem onClick={() => {
                        window.location.href = 'mailto:feedback@accelerate.fitness'
                    }} button detail lines='none'>
                        <IonIcon slot='start' icon={bulbOutline} />
                        <IonText>Feadback / Request</IonText>
                    </IonItem>
                    <IonItem onClick={() => {
                        window.location.href = 'mailto:support@accelerate.fitness'
                    }} button detail lines='none'>
                        <IonIcon slot='start' icon={headsetOutline} />
                        <IonText>Contact</IonText>
                    </IonItem>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>Legal</IonItemDivider>
                    <IonItem routerLink='/terms_and_conditions' button detail lines='none'>
                        <IonIcon slot='start' icon={readerOutline} />
                        <IonText>Terms & Conditions</IonText>
                    </IonItem>
                    <IonItem routerLink='/privacy_policy' button detail lines='none'>
                        <IonIcon slot='start' icon={documentLockOutline} />
                        <IonText>Privacy Policy</IonText>
                    </IonItem>
                </IonItemGroup>
                <section className='all-center'>
                    <IonButton onClick={() => Auth.SignOut()} style={{ width: '80%' }}>Logout</IonButton>
                    <IonText className='m-2'>Made with ❤ in India</IonText>
                    <IonText className='m-2'>{version}</IonText>
                </section>
            </IonContent>
        </IonPage >
    )
}
export * from './workout-preferences'