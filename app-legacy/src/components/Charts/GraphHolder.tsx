import { IonCard, IonItem, IonText } from '@ionic/react'
import React from 'react'
import './GraphHolder.scss'

interface GraphHolderProps {
    title: string
}
const GraphHolder: React.FC<GraphHolderProps> = (props) => {
    return (
        <IonCard className='card graph-holder'>
            <IonItem lines='full'>
                <IonText>{props.title}</IonText>
            </IonItem>
            {props.children}
        </IonCard>
    )
}

export default GraphHolder