import { IonButton, IonIcon, useIonModal } from '@ionic/react'
import { timerOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { TimerController } from '../../utils/timer-controller'
import { Timer } from './Timer'
import './styles.scss'
interface TimerButtonProps {

}
export const TimerButton: React.FC<TimerButtonProps> = (props) => {
    const [Show, Hide] = useIonModal(() => <Timer onDismiss={Hide.bind(this)} />)

    return (
        <IonButton onClick={() => Show({ mode: 'ios', swipeToClose: true, cssClass: 'autosized-modal' })} className='timer-button ion-no-padding' fill='clear'>
            <IonIcon color='primary' icon={timerOutline} />
            <Progress />
        </IonButton>
    )
}

function Progress() {
    const [progress, SetProgress] = useState(TimerController.percent || 0)
    useEffect(() => {
        const OnFinished = () => {
            SetProgress(0)
        }
        const OnChange = () => {
            SetProgress(TimerController.percent)
        }
        TimerController.events.on('change', OnChange)
        TimerController.events.on('finished', OnFinished);
        return () => {
            TimerController.events.off('change', OnChange)
            TimerController.events.off('finished', OnFinished);
        }
    }, [])
    return (
        <div style={{ width: progress > 0 ? 50 - (progress / 2) : 0 }} className='progress'></div>
    )
}