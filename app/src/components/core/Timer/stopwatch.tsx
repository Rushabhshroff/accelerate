import { IonButton, IonCardContent, IonText } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import Duration from '../../../utils/duration'
import { StopwatchController } from '../../../utils/stopwatch-controller'
import { CircularProgress } from '../CirclularProgress'
import { Spinner } from '../CirclularProgress/spinner'
import './styles.scss'
export const Stopwatch: React.FC = (props) => {
    const [timeelpased, SetTimeElapsed] = useState(0)
    const [stopped, SetStopped] = useState(false);
    useEffect(() => {
        const OnFinished = () => {
            SetStopped(true);
        }
        const OnChange = () => {
            SetTimeElapsed(StopwatchController.timeElapsed)
        }
        StopwatchController.events.on('change', OnChange)
        StopwatchController.events.on('finished', OnFinished);
        return () => {
            StopwatchController.events.off('change', OnChange)
            StopwatchController.events.off('finished', OnFinished);
        }
    }, [])
    const running = StopwatchController.running
    const Reset = () => {
        SetTimeElapsed(0);
        SetStopped(false);
    }
    const OperationButton = () => {
        if (running) {
            return (
                <IonButton onClick={() => StopwatchController.Cancel()} color='danger' fill='solid'>Stop</IonButton>
            )
        }
        if (stopped) {
            return (
                <IonButton color='success' onClick={Reset} fill='solid'>Reset</IonButton>
            )
        } else {
            return (
                <IonButton onClick={() => StopwatchController.Start()} fill='solid'>Start</IonButton>
            )
        }
    }
    return (
        <IonCardContent className='content ion-no-padding'>
            <div style={{ flex: 1 }}></div>
            <Spinner animate={running} strokeWidth={5} size={200}>
                <IonText className='block-text text-bold xx-large'>{new Duration(timeelpased * 1000).toHHMMSS()}</IonText>
            </Spinner>
            <div className='all-center' style={{ flex: 1 }}>

            </div>
            <div className='row no-gutter mb-3'>
                <div className='col-4 no-gutter all-center'>
                </div>
                <div className='col-4 no-gutter all-center'>
                    <OperationButton />
                </div>
                <div className='col-4 no-gutter all-center'>

                </div>
            </div>
        </IonCardContent>
    )
}