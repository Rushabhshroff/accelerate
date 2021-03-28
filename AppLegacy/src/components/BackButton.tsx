import { IonButton, IonIcon, useIonRouter } from '@ionic/react'
import React from 'react'
import { arrowBack } from 'ionicons/icons'

interface BackButtonProps {
    icon?: any,
    OnClick?: (e: { performDefault: () => void }) => void,
    backRoute?:string
}
const BackButton: React.FC<BackButtonProps> = (props) => {
    const router = useIonRouter()
    const OnClickDefault = () => {
        router.canGoBack() ? router.goBack() : router.push(props.backRoute || '/main', 'root', 'replace')
    }
    const e = {
        performDefault: OnClickDefault
    }
    return (
        <IonButton onClick={() => props.OnClick ? props.OnClick(e) : OnClickDefault()}>
            <IonIcon icon={props.icon || arrowBack} />
        </IonButton>
    )
}

export default BackButton