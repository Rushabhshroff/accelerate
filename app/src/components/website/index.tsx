import { IonButton, IonButtons, IonHeader, IonIcon, IonPage, useIonRouter } from '@ionic/react'
import { arrowBack } from 'ionicons/icons'
import React from 'react'

interface Website {
    url?: string
}
export const Website: React.FC<Website> = (props) => {
    const router = useIonRouter()
    const url = `https://accelerate.fitness/${props.url?props.url:''}`
    return (
        <IonPage>
            <div style={{ position: 'fixed', top: 0 }}>
                <IonButton onClick={() => router.goBack()} fill='clear'>
                    <IonIcon icon={arrowBack} />
                </IonButton>
            </div>
            <iframe style={{ height: '100%' }} src={url} frameBorder={0}></iframe>
        </IonPage>
    )
}