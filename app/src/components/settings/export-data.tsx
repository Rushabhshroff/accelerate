import { IonBackButton, IonButton, IonButtons, IonContent, IonItem, IonItemDivider, IonItemGroup, IonPage, IonText, IonTitle, useIonToast } from '@ionic/react'
import React from 'react'
import { DataExporter } from '../../utils/export-data'
import { Header } from '../core'

export interface ExportData {

}

export const ExportData: React.FC<ExportData> = (props) => {
    const [Toast] = useIonToast()
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Export Data</IonTitle>
            </Header>
            <IonContent>
                <IonItemGroup>
                    <IonItemDivider>Workout Data</IonItemDivider>
                    <IonItem lines='none'>
                        <div>
                            <IonText className='block-text small text-light'>Export your entire workout history to a CSV File.</IonText>
                            <IonText className='block-text small text-light'>Data Exported in CSV format cannot be reimported back into accelerate.</IonText>

                        </div>
                    </IonItem>
                    <section>
                        <IonButton onClick={() => {
                            DataExporter.ExportCSV()
                        }} expand='full'>Export CSV </IonButton>
                    </section>
                </IonItemGroup>
            </IonContent>
        </IonPage>
    )
}