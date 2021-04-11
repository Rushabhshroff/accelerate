import { IonBackButton, IonButtons, IonCol, IonContent, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonPage, IonRouterLink, IonRow, IonText, IonTitle } from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import React from 'react'
import { useInAppPurchase } from '../../hooks/useInAppPurchase'
import { InAppPurchase } from '../../utils/in-app-purchase'
import { Header } from '../core'

export interface ManageSubscriptionPage {

}
export const ManageSubscriptionPage: React.FC<ManageSubscriptionPage> = (props) => {
    const { fitnessPlus, yearlyPlus, monthlyPlus } = useInAppPurchase()
    const Purchase = (plan: "mo" | "yr") => {
        let product = plan == 'mo' ? monthlyPlus : yearlyPlus;
        if (product && !fitnessPlus) {
            InAppPurchase.Purchase(product);
        }
    }
    const areProductsAvailable = (monthlyPlus && monthlyPlus.state !== 'invalid') || (yearlyPlus && yearlyPlus.state !== 'invalid')
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Manage Subscriptions</IonTitle>
            </Header>
            <IonContent>
                <section>
                    <IonItemGroup>
                        <IonItemDivider>Subscriptions</IonItemDivider>
                        <IonItem onClick={() => Purchase("mo")} disabled={fitnessPlus || !areProductsAvailable} button className='form-input my-3' lines='none'>
                            <IonText>PLUS Monthly <span className='text-light'>(no ads)</span></IonText>
                            {monthlyPlus && monthlyPlus.owned ? <IonIcon slot='end' icon={checkmark} color='success' /> : <IonText slot='end'>{monthlyPlus?.price} <sub>/mo</sub> </IonText>}
                        </IonItem>
                        <IonItem onClick={() => Purchase("yr")} disabled={fitnessPlus || !areProductsAvailable} button className='form-input my-3' lines='none'>
                            <IonText>PLUS Yearly <span className='text-light'>(no ads)</span></IonText>
                            {yearlyPlus && yearlyPlus.owned ? <IonIcon slot='end' icon={checkmark} color='success' /> : <IonText slot='end'>{yearlyPlus?.price} <sub>/mo</sub> </IonText>}
                        </IonItem>
                        <IonItem disabled button className='form-input my-3' lines='none'>
                            <IonText>Free <span className='text-light'>(contains ads)</span> </IonText>
                            {!fitnessPlus ? <IonIcon slot='end' icon={checkmark} color='success' /> : <IonText slot='end'>FREE</IonText>}
                        </IonItem>
                    </IonItemGroup>
                </section>
                <div className='all-center'>
                    <IonRouterLink routerLink='/subscription'>More Information</IonRouterLink>
                </div>
                <div className='all-center '>
                    <IonText className='block-text text-light x-small my-3'>Cancel your Subscription at any time</IonText>
                    <IonText className='block-text text-light x-small text-center'>Subscriptions renew automatically unless you unsubscribe 24hr before the end of current period. You can cancel anytime through Google Play Store Settings. </IonText>
                </div>
                <div className='all-center my-3'>
                    <IonRow style={{ width: '70%' }}>
                        <IonCol>
                            <IonRouterLink className='x-small'>Privacy Policy</IonRouterLink>
                        </IonCol>
                        <IonCol>
                            <IonRouterLink className='x-small'>Terms & Conditions</IonRouterLink>
                        </IonCol>
                    </IonRow>
                </div>
                <div className='all-center my-3'>
                    <IonText>Having Trouble?</IonText>
                    <a className='small' href='mailto:support@accelerate.fitness'>Contact Us : support@accelerate.fitness</a>
                </div>
            </IonContent>
        </IonPage>
    )
}