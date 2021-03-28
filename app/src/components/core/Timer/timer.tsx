import { IonButton, IonCardContent, IonText } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { AppSettings } from '../../../utils'
import Duration from '../../../utils/duration'
import { TimerController } from '../../../utils/timer-controller'
import { CircularProgress } from '../CirclularProgress'

export interface Timer {
    seconds?: number
}

export const Timer: React.FC<Timer> = (props) => {
    const [progress, SetProgress] = useState(TimerController.percent || 0)
    const [remaining, SetRemaining] = useState(TimerController.timeRemaining || props.seconds || AppSettings.current.timerSeconds)
    const running = TimerController.running
    useEffect(() => {
        const OnFinished = () => {
            SetProgress(0)
            SetRemaining(props.seconds || AppSettings.current.timerSeconds);
        }
        const OnChange = () => {
            SetProgress(TimerController.percent)
            SetRemaining(TimerController.timeRemaining);
        }
        TimerController.events.on('change', OnChange)
        TimerController.events.on('finished', OnFinished);
        if (props.seconds) {
            HandleStartButton();
        }
        return () => {
            TimerController.events.off('change', OnChange)
            TimerController.events.off('finished', OnFinished);
        }
    }, [])
    const HandleStartButton = () => {
        if (TimerController.running) {
            TimerController.Cancel()
        } else {
            TimerController.Start(remaining)
        }
    }
    const Add = () => {
        if (running) {
            TimerController.Add(AppSettings.current.timerRaiseInterval)
        } else {
            SetRemaining(remaining + AppSettings.current.timerRaiseInterval);
        }
    }
    const Subtract = () => {
        if (running) {
            TimerController.Subtract(AppSettings.current.timerRaiseInterval)
        } else {
            let diff = remaining - AppSettings.current.timerRaiseInterval
            SetRemaining(diff > 0 ? diff : AppSettings.current.timerSeconds);
        }
    }
    return (
        <IonCardContent className='content ion-no-padding'>
            <div style={{ flex: 1 }}></div>
            <CircularProgress svgStyles={{ transform: 'RotateY(180deg)' }} strokeWidth={5} percentage={100 - progress} size={200} >
                <IonText className='block-text text-bold xx-large'>{new Duration(remaining * 1000).toHHMMSS()}</IonText>
            </CircularProgress>
            <div className='all-center' style={{ flex: 1 }}>

            </div>
            <div className='row no-gutter mb-3'>
                <div className='col-4 no-gutter all-center'>
                    <IonButton onClick={Subtract} fill='clear'>- {AppSettings.current.timerRaiseInterval} sec</IonButton>
                </div>
                <div className='col-4 no-gutter all-center'>
                    <IonButton color={running ? "danger" : "primary"} onClick={HandleStartButton} fill='solid'>{running ? "Stop" : "Start"}</IonButton>
                </div>
                <div className='col-4 no-gutter all-center'>
                    <IonButton onClick={Add} fill='clear'>+ {AppSettings.current.timerRaiseInterval} sec</IonButton>
                </div>
            </div>
        </IonCardContent>
    )
}