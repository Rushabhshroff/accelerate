import { IonButton, IonCard, IonCardContent, IonCol, IonIcon, IonRow, IonSegment, IonSegmentButton, IonText } from '@ionic/react'
import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { CircularProgress } from '../CirclularProgress'
import { Timer as OTimer } from './timer'
import './styles.scss'
import { Header } from '../Header'
import { close } from 'ionicons/icons'
import { Stopwatch } from './stopwatch'
export * from './timer'
export interface Timer {
    onDismiss?: () => void,
    secs?:number
}
export const Timer: React.FC<Timer> = (props) => {
    const [screen, SetScreen] = useState<string>('timer')
    return (
        <IonCard className='timer '>
            <Header>
                <IonButton onClick={props.onDismiss} fill='clear'>
                    <IonIcon icon={close} />
                </IonButton>
            </Header>
            <IonSegment mode='md' onIonChange={(e) => SetScreen(e.detail.value || 'timer')} value={screen}>
                <IonSegmentButton value='timer' >Timer</IonSegmentButton>
                <IonSegmentButton value='stopwatch' >Stopwatch</IonSegmentButton>
            </IonSegment>
            <SwipeableViews style={{ height: '80%' }} index={screen == 'timer' ? 0 : 1} onChangeIndex={(i) => SetScreen(i == 0 ? 'timer' : 'stopwatch')}>
                <OTimer seconds={props.secs} />
                <Stopwatch />
            </SwipeableViews>
        </IonCard>
    )
}