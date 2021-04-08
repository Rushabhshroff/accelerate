import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonInput, IonItem, IonPage, IonRouterLink, IonText } from '@ionic/react'
import React from 'react'
import { logo } from '../../icons'
import { Header } from '../core'
import './styles.scss'
interface ForgotPasswordPage {

}

export const ForgotPasswordPage: React.FC<ForgotPasswordPage> = (props) => {
    return (
        <IonPage className='auth'>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
            </Header>
            <IonContent>
                <section className='all-center page'>
                    <div style={{ flex: 1 }} />
                    <IonIcon style={{ fontSize: 150 }} color='primary' icon={logo} />
                    <IonItem lines='none' className='form-input'>
                        <IonInput placeholder='Email Address' type='email' />
                    </IonItem>
                    <IonButton type='submit'>
                        Reset Password
                </IonButton>
                    <div style={{ flex: 1 }} />
                    <IonText className='m-2 text-center'>By using this app you agree to our <IonRouterLink>Terms of Service</IonRouterLink> and <IonRouterLink>Privacy Policy</IonRouterLink></IonText>
                </section>
            </IonContent>
        </IonPage>
    )
}