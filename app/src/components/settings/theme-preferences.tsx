import { IonBackButton, IonButtons, IonContent, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonPage, IonRippleEffect, IonRow, IonSegment, IonSegmentButton, IonTitle, useIonAlert, useIonRouter } from '@ionic/react'
import { checkmark, lockClosed } from 'ionicons/icons'
import React from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import { useInAppPurchase } from '../../hooks/useInAppPurchase'
import { AppTheme, PrimaryColorOptions } from '../../utils/app-theme'
import { Header } from '../core'
import './styles.scss'

export interface ThemePreferences {

}
export const ThemePreferences: React.FC<ThemePreferences> = (props) => {
    const [settings, ApplySettings] = useAppSettings()
    const { fitnessPlus } = useInAppPurchase()
    const [Alert] = useIonAlert();
    const router = useIonRouter()
    const AlertOptions = (color: string) => {
        Alert({
            message: "This is a plus feature. Although you can experience this theme for 30 seconds.",
            buttons: [
                {
                    text: "Yes Try", handler: () => {
                        AppTheme.TryTheme(color)
                    }
                },
                {
                    text: "Purchase Plus", handler: () => {
                        router.push('/subscription')
                    }
                },
                { text: "Cancel", role: 'Cancel' }
            ]
        })
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Theme Preferences</IonTitle>
            </Header>
            <IonContent>
                <IonItemGroup>
                    <IonItemDivider>Theme Mode</IonItemDivider>
                    <IonItem lines='none'>
                        <IonSegment onIonChange={(e) => {
                            ApplySettings({
                                theme: {
                                    ...settings.theme,
                                    //@ts-ignore
                                    mode: e.detail.value
                                }
                            })
                        }} value={settings.theme.mode} mode='ios'>
                            <IonSegmentButton value='auto' >Auto</IonSegmentButton>
                            <IonSegmentButton value='light' >Light</IonSegmentButton>
                            <IonSegmentButton value='dark' >Dark</IonSegmentButton>
                        </IonSegment>
                    </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                    <IonItemDivider>Primary Color</IonItemDivider>
                    <IonRow>
                        {Object.keys(PrimaryColorOptions).map((key) => {
                            const current = settings.theme.primaryColor.toLowerCase() === key
                            const abs = current;
                            const premium = PrimaryColorOptions[key].premium
                            return (
                                <div key={key} className="pick-color-item">
                                    <div onClick={(e) => {
                                        if (!fitnessPlus && premium) {
                                            AlertOptions(key)
                                        } else {
                                            ApplySettings({
                                                theme: {
                                                    ...settings.theme,
                                                    primaryColor: key
                                                }
                                            })
                                        }
                                    }} style={{ backgroundColor: key }} className='circle ion-activatable ripple-parent'>
                                        {abs ? <div className='abs'>
                                            <IonIcon size='large' color='success' icon={checkmark} />
                                        </div> : null}
                                        {!fitnessPlus && premium ? <div className='abs'>
                                            <IonIcon size='small' icon={lockClosed} />
                                        </div> : null}
                                        <IonRippleEffect></IonRippleEffect>
                                    </div>
                                </div>
                            )
                        })}
                    </IonRow>
                </IonItemGroup>
            </IonContent>
        </IonPage>
    )
}