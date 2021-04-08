import { IonBackButton, IonButton, IonButtons, IonCard, IonCol, IonContent, IonIcon, IonItem, IonPage, IonRow, IonText, IonToolbar } from '@ionic/react'
import { close } from 'ionicons/icons'
import React, { useState } from 'react'
import { plusText } from '../../icons'
import { Header } from '../core'
import './styles.scss'
import Compare from '../../database/subscription.json'
export interface SubscriptionCompare {

}


export const SubscriptionCompare: React.FC<SubscriptionCompare> = (props) => {
    const [plan, SetPlan] = useState<'yr' | 'mo'>('yr')
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
                        <IonCol size='6'>
                            <IonCard onClick={() => SetPlan('mo')} button mode='ios' className={`price-card${plan == 'mo' ? ' select' : ''}`}>
                                <div className='all-center py-2'>
                                    <IonIcon size='large' icon={plusText} />
                                    <IonText color='primary' className='text-bold my-2 xx-large'>₹30 <sub>/mo</sub></IonText>
                                    <IonText>Billed Monthly</IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                        <IonCol size='6'>
                            <IonCard onClick={() => SetPlan('yr')} button mode='ios' className={`price-card${plan == 'yr' ? ' select' : ''}`}>
                                <div className='all-center py-2'>
                                    <IonIcon size='large' icon={plusText} />
                                    <IonText color='primary' className='text-bold my-2 xx-large'>₹299 <sub>/yr</sub></IonText>
                                    <IonText>Billed Yearly</IonText>
                                    <IonText color='primary'>( 17% Off )</IonText>
                                </div>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                    <IonButton mode='ios'>Subscribe to {plan == 'mo' ? 'Monthly' : 'Annual'} Plan</IonButton>
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
