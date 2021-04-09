import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonInput, IonItem, IonPage, IonRouterLink, IonText, useIonAlert } from '@ionic/react'
import React, { useState } from 'react'
import { logo } from '../../icons'
import { Header } from '../core'
import './styles.scss'
import validator from 'validator'
import { Auth } from '../../api'
interface LoginPage {

}

export const LoginPage: React.FC<LoginPage> = (props) => {
    const [Alert, Dismiss] = useIonAlert()
    const [email, SetEmail] = useState<string>('')
    const [password, SetPassword] = useState<string>('')

    const Login = () => {
        if (!validator.isEmail(email)) {
            Alert({
                message: "Please enter a valid email address",
                buttons: [{ text: "Okay" }]
            })
            return;
        }
        if (validator.isEmpty(password)) {
            Alert({
                message: "Please enter a password",
                buttons: [{ text: "Okay" }]
            })
            return;
        }
        Auth.SignInWithEmailAndPassword(email, password).catch((err) => {
            Alert({
                message: err.error,
                buttons: [{ text: "Okay" }]
            })
        })
    }
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
                        <IonInput value={email} onIonChange={(e) => SetEmail(e.detail.value || '')} placeholder='Email Address' type='email' />
                    </IonItem>
                    <IonItem lines='none' className='form-input'>
                        <IonInput value={password} onIonChange={(e) => SetPassword(e.detail.value || '')} placeholder='Password' type='password' />
                    </IonItem>
                    <IonRouterLink routerLink='/forgot-password' className='text-right form-text m-2'>Forgot password?</IonRouterLink>
                    <IonButton onClick={Login} disabled={!validator.isEmail(email) || validator.isEmpty(password)} type='submit'>
                        Login
                </IonButton>
                    <IonText className='m-2'>Don't have an account? <IonRouterLink routerDirection='none' routerLink='/register'>Sign Up</IonRouterLink></IonText>
                    <div style={{ flex: 1 }} />
                    <IonText className='m-2 text-center'>By using this app you agree to our <IonRouterLink>Terms of Service</IonRouterLink> and <IonRouterLink>Privacy Policy</IonRouterLink></IonText>
                </section>
            </IonContent>
        </IonPage>
    )
}