import { IonBackButton, IonButtons, IonContent, IonItem, IonItemDivider, IonPage, IonSegment, IonSegmentButton, IonTitle } from '@ionic/react'
import React from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'
import { Header } from '../core'


export interface UnitsPreferences {

}

export const UnitsPreferences: React.FC<UnitsPreferences> = (props) => {
    const [appsettings, ApplySettings] = useAppSettings()
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Unit Preferences</IonTitle>
            </Header>
            <IonContent>
                <IonItemDivider>Weight</IonItemDivider>
                <IonItem lines='none'>
                    <IonSegment onIonChange={(e) => {
                        ApplySettings({
                            units: {
                                ...appsettings.units,
                                //@ts-ignore
                                weight: e.detail.value || appsettings.units.weight
                            }
                        })
                    }} value={appsettings.units.weight} mode='ios'>
                        <IonSegmentButton value='kg'>KG</IonSegmentButton>
                        <IonSegmentButton value='lbs'>LBS</IonSegmentButton>
                    </IonSegment>
                </IonItem>
                <IonItemDivider>Distance</IonItemDivider>
                <IonItem lines='none'>
                    <IonSegment onIonChange={(e) => {
                        ApplySettings({
                            units: {
                                ...appsettings.units,
                                //@ts-ignore
                                distance: e.detail.value || appsettings.units.distance
                            }
                        })
                    }} value={appsettings.units.distance} mode='ios'>
                        <IonSegmentButton value='km'>KM</IonSegmentButton>
                        <IonSegmentButton value='mi'>Mile</IonSegmentButton>
                    </IonSegment>
                </IonItem>
                <IonItemDivider>Measurements</IonItemDivider>
                <IonItem lines='none'>
                    <IonSegment onIonChange={(e) => {
                        ApplySettings({
                            units: {
                                ...appsettings.units,
                                //@ts-ignore
                                size: e.detail.value || appsettings.units.size
                            }
                        })
                    }} value={appsettings.units.size} mode='ios'>
                        <IonSegmentButton value='cm'>CM</IonSegmentButton>
                        <IonSegmentButton value='in'>INCH</IonSegmentButton>
                    </IonSegment>
                </IonItem>
            </IonContent>
        </IonPage>
    )
}