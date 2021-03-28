import { IonButton, IonButtons, IonIcon, IonItem, IonText } from '@ionic/react'
import { addCircleOutline, chevronForward, folderOpen, folderOpenOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { TouchableOpcity } from '../../../components'
import './styles.scss'

export const RoutinesSegment: React.FC<RouteComponentProps> = (props) => {
    return (
        <>
            <section>
                <IonButton>Browse Routines</IonButton>
            </section>
            <RoutinesFolder >
               
            </RoutinesFolder>
        </>
    )
}

interface RoutinesFolderProps {

}
const RoutinesFolder: React.FC<RoutinesFolderProps> = (props) => {
    const [state, SetState] = useState<' ' | 'collapsed'>(' ')
    const Toggle = () => SetState(state === ' ' ? 'collapsed' : ' ')
    return (
        <section className={`collapsible ${state}`}>
            <IonItem lines='none'>
                <TouchableOpcity onClick={Toggle} slot='start'>
                    <IonIcon className='arrow' size='small' color='primary' icon={chevronForward} />
                </TouchableOpcity>
                <IonText>Your Routines</IonText>
                <TouchableOpcity slot='end'>
                    <IonIcon size='large' color='primary' icon={addCircleOutline} />
                </TouchableOpcity>
            </IonItem>
            <div className='child'>
                {props.children}
            </div>
        </section>
    )
}