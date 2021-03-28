import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import ProgressCircle from '../components/ProgressCircle'
import Timer from '../utils/RestTimer'
import './RestTimer.scss'
import moment from 'moment'
import PickerBox from '../components/Picker'
import { arrowBack } from 'ionicons/icons'
interface RestTimerProps {

}
export function useRestTimer() {
    const [timeleft, SetTimeLeft] = useState(0);
    useEffect(() => {
        const OnChange = () => {
            SetTimeLeft(Timer.timeleft)
        }
        Timer.events.on('change', OnChange);
        return () => {
            Timer.events.off('change', OnChange);
        }
    }, [])
    return { timer: Timer, timeleft }
}
const RestTimer: React.FC<RestTimerProps> = (props) => {
    const { timer, timeleft } = useRestTimer()
    const Add = () => {
        timer.Add(30000);
    }
    const Subtract = () => {
        timer.Subtract(30000);
    }
    const getCustomOptions = () => {
        let arr = []
        for (let i = 1; i <= 120; i++) {
            let val = (i) * 5 * 1000
            arr.push({
                value: val,
                text: moment.utc(val).format('mm:ss')
            })
        }
        return arr
    }
    const ShowCustomTimerPicker = () => {
        PickerBox.Show({
            buttons: [
                {
                    type: 'cancel',
                    text: 'Cancel'
                }, {
                    text: "Start",
                    handler: (data: any) => {
                        timer.StartCustom(data.time.value)
                    }
                }
            ],
            columns: [
                {
                    name: 'time',
                    selectedIndex: 0,
                    options: getCustomOptions()
                }
            ]
        })
    }
    return (
        <>
            <IonHeader className='ion-no-border'>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonButton onClick={() => {
                            RestTimerModal.Hide()
                        }}>
                            <IonIcon icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Rest Timer</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className='flex-container'>
                    <div>

                    </div>
                    <div className='flex-1 centering-box'>
                        <ProgressCircle radius={window.innerWidth / 2 - 50} borderWidth={5} percent={timer.percentRemaining() || 100} >
                            <div className='centering-box'>
                                {timer.running ? <>
                                    <IonText>{moment.utc(timeleft).format('mm:ss')}</IonText>
                                    <IonText className='light-text'>{moment.utc(timer.difference()).format('mm:ss')}</IonText>
                                </> :
                                    <>
                                        {Timer.Timers.slice(0, 4).map((t) => {
                                            return (
                                                <IonButton key={t} onClick={() => timer.Start(t)} fill='outline'>
                                                    {moment.utc(t).format('mm:ss')}
                                                </IonButton>
                                            )
                                        })}
                                    </>
                                }
                            </div>
                        </ProgressCircle>
                    </div>
                    <div className='centering-box'>
                        {timer.running ?
                            <>
                                <IonButtons>
                                    <IonButton onClick={Add} color='primary'>
                                        + 30 sec
                                    </IonButton>
                                    <IonButton onClick={Subtract} color='primary'>
                                        - 30 sec
                                    </IonButton>
                                    <IonButton onClick={timer.End} style={{ padding: '0 15px' }} expand='full' color='primary' fill='solid'>
                                        Skip
                                    </IonButton>
                                </IonButtons>
                            </>
                            : <>
                                <IonButton onClick={ShowCustomTimerPicker}>Select Custom Time</IonButton>
                            </>}

                    </div>
                </div>
            </IonContent>
        </>
    )
}

export default class RestTimerModal extends React.Component {
    static ref: RestTimerModal | null
    static Show() {
        RestTimerModal.ref?.show()
    }
    static Hide() {
        RestTimerModal.ref?.hide()
    }
    state = {
        show: false
    }
    show() {
        this.setState({ show: true })
    }
    hide() {
        this.setState({ show: false })
    }
    render() {
        return (
            <IonModal isOpen={this.state.show}>
                <RestTimer />
            </IonModal>
        )
    }
};