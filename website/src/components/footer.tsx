import { IonCol, IonRow } from '@ionic/react'
import React from 'react'
import { Link } from 'react-router-dom'
import './footer.scss'

interface FooterProps {

}
export const Footer: React.FC<FooterProps> = (props) => {
    return (
        <footer>
            <IonRow>
                <IonCol size='12' sizeMd='5'>

                </IonCol>
                <IonCol size='12' sizeMd='7'>
                    Copyright © {new Date().getFullYear()} Accelerate Fitness.
<a href='/legal/privacy_policy'> Privacy Policy</a>
                    <a href='/legal/terms_and_conditions'> Terms & Conditions</a>
                </IonCol>
            </IonRow>
        </footer>
    )
}
