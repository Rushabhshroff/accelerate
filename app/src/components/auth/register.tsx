import { IonBackButton, IonButton, IonButtons, IonContent, IonIcon, IonInput, IonItem, IonPage, IonRouterLink, IonText, useIonAlert, useIonLoading } from '@ionic/react'
import React, { useState } from 'react'
import { logo } from '../../icons'
import { Header } from '../core'
import validator from 'validator'
import './styles.scss'
import { Auth } from '../../api'
interface RegisterPage {

}

export const RegisterPage: React.FC<RegisterPage> = (props) => {
    const [Alert] = useIonAlert()
    const [ShowLoader,HideLoader] = useIonLoading()
    const [email,SetEmail] = useState<string>('')
    const [password,SetPassword] = useState<string>('')

    const Register = ()=>{
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
        ShowLoader()
        Auth.CreateUserWithEmailAndPassword(email, password).catch((err) => {
            HideLoader()
            Alert({
                message: err.error || err.message,
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
                    <IonButton disabled={!validator.isEmail(email) || validator.isEmpty(password)} onClick={Register} type='submit'>
                        Register
                </IonButton>
                    <IonText className='m-2'>Already have an account? <IonRouterLink routerDirection='forward' routerLink='/login'>Login</IonRouterLink></IonText>
                    <div style={{ flex: 1 }} />
                    <IonText className='m-2 text-center'>By using this app you agree to our <IonRouterLink routerLink='/terms_and_conditions'>Terms of Service</IonRouterLink> and <IonRouterLink routerLink='/privacy_policy'>Privacy Policy</IonRouterLink></IonText>
                </section>
            </IonContent>
        </IonPage>
    )
}