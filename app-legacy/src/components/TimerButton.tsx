import { IonButton, IonIcon } from '@ionic/react'
import { timerOutline } from 'ionicons/icons'
import React from 'react'
import RestTimerModal, { useRestTimer } from '../pages/RestTimer'
import './TimerButton.scss'
interface TimerButtonProps {

}

const TimerButton: React.FC<TimerButtonProps> = (props) => {
    const { timer, timeleft } = useRestTimer()
    return (
        <IonButton onClick={() => {
            RestTimerModal.Show()
        }} className={`timer-button${timer.running ? ' active' : ''}`}>
            <IonIcon style={{ zIndex: 1 }} icon={timerOutline} />
            <div style={{ width: timer.percentRemaining() }} className='fill' />
        </IonButton>
    )
}

export default TimerButton;