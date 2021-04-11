import { IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonIcon, IonItem, IonPage, IonRow, IonText, IonToolbar } from '@ionic/react'
import { close } from 'ionicons/icons'
import React, { useState } from 'react'
import { plusText } from '../../icons'
import { Header } from '../core'
import './styles.scss'
import Compare from '../../database/subscription.json'
import { useInAppPurchase } from '../../hooks/useInAppPurchase'
import { InAppPurchase } from '../../utils/in-app-purchase'
export interface SubscriptionCompare {

}


export const SubscriptionCompare: React.FC<SubscriptionCompare> = (props) => {
    const [plan, SetPlan] = useState<'yr' | 'mo'>('yr')
    const { fitnessPlus, monthlyPlus, yearlyPlus } = useInAppPurchase()
    const Purchase = () => {
        let product = plan === 'mo' ? monthlyPlus : yearlyPlus
        if (product && !fitnessPlus) {
            InAppPurchase.Purchase(product)
        }
    }
    const areProductsAvailable = (monthlyPlus && monthlyPlus.state !== 'invalid') || (yearlyPlus && yearlyPlus.state !== 'invalid')
    return (
        <IonPage>
            <Header>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton icon={close} />
                    </IonButtons>
                </IonToolbar>
            </Header>
            <IonContent>
                <section className='page subscription-compare'>
                    <IonText style={{ fontSize: 38 }} className='text-center'>Accelerate <sup>
                        <IonIcon color='primary' style={{ fontSize: 34 }} icon={plusText} />
                    </sup></IonText>
                    <IonRow>
                        {monthlyPlus && monthlyPlus?.state !== 'invalid' ? <IonCol size='6'>
                            <IonCard onClick={() => SetPlan('mo')} button mode='ios' className={`price-card${plan == 'mo' ? ' select' : ''}`}>
                                <div className='all-center py-2'>
                                    <IonIcon size='large' icon={plusText} />
                                    <IonText color='primary' className='text-bold my-2 xx-large'>{monthlyPlus.price} <sub>/mo</sub></IonText>
                                    <IonText>Billed Monthly</IonText>
                                </div>
                            </IonCard>
                        </IonCol> : null}
                        {yearlyPlus && yearlyPlus.state !== 'invalid' ? <IonCol size='6'>
                            <IonCard onClick={() => SetPlan('yr')} button mode='ios' className={`price-card${plan == 'yr' ? ' select' : ''}`}>
                                <div className='all-center py-2'>
                                    <IonIcon size='large' icon={plusText} />
                                    <IonText color='primary' className='text-bold my-2 xx-large'>{yearlyPlus?.price} <sub>/yr</sub></IonText>
                                    <IonText>Billed Yearly</IonText>
                                </div>
                            </IonCard>
                        </IonCol> : null}
                    </IonRow>
                    {areProductsAvailable ? <IonButton onClick={Purchase} disabled={fitnessPlus || !monthlyPlus || !yearlyPlus} mode='ios'>{fitnessPlus ? "Already a member" : `Subscribe to ${plan == 'mo' ? 'Monthly' : 'Annual'} Plan`}</IonButton> : null}
                    <div className='table mt-3 p-2'>
                        <IonRow className='head'>
                            <IonCol size='6'>Feature</IonCol>
                            <IonCol size='3'>Free</IonCol>
                            <IonCol size='3'>Plus</IonCol>
                        </IonRow>
                        {Compare.map((f) => {
                            return (
                                <IonRow key={f.feature}>
                                    <IonCol size='6'>{f.feature}</IonCol>
                                    <IonCol size='3'>{f.free}</IonCol>
                                    <IonCol className='plus' size='3'>{f.plus}</IonCol>
                                </IonRow>
                            )
                        })}
                    </div>
                </section>
            </IonContent>

        </IonPage>
    )
}
