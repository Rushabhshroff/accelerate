import { IonContent, IonIcon, IonItem, IonPage, IonText } from '@ionic/react'
import * as Icons from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import ProgressCircle from '../../components/ProgressCircle'
import './MeasuresTab.scss'
import { CoreLogs, Log, BodyPartLogs, LogTarget } from '../../data/models/Logs'
import { useLocation } from 'react-router'
export const MeasuresTab: React.FC = (props) => {
    return (
        <IonPage className='logs-tab'>
            <Header noborder title='Measures'>

            </Header>
            <IonContent>
                <IonText className='section-header'>Core</IonText>
                {CoreLogs.map((logItem) => {
                    return (
                        <MeasuresTabItem key={logItem.name} {...logItem} />
                    )
                })}
                <IonText className='section-header'>Body Parts</IonText>
                {BodyPartLogs.map((logItem) => {
                    return (
                        <MeasuresTabItem key={logItem.name} {...logItem} />
                    )
                })}
            </IonContent>
        </IonPage>
    )
}

interface LogsItemProps {
    name: string,
    icon?: string
}
const MeasuresTabItem: React.FC<LogsItemProps> = (props) => {
    const [current, SetCurrent] = useState<Log | undefined>(undefined);
    const [target, SetTarget] = useState<LogTarget | undefined>(undefined);
    const { pathname } = useLocation()
    let Handler = Log.static(props.name);
    let log = Handler.Log()
    useEffect(() => {
        Handler.current().then((res) => {
            SetCurrent(res);
        })
        Handler.target().then((res) => {
            SetTarget(res)
        })
    }, [pathname])
    return (
        <IonItem routerLink={`/measures/${props.name}`} button lines='none'>
            {/*props.icon ?<ProgressCircle percent={0} slot='start'>
                {
                    //@ts-ignore
                    <IonIcon color='primary' icon={Icons[props.icon]} />
                }
            </ProgressCircle> :*/ null}
            <div>
                <IonText className='title'>
                    {props.name}
                </IonText>
                {target ? <IonText className='current-value'>
                    Target: {target.value} {target.unit}
                </IonText> : null}
            </div>
            {current ? <IonText className='current-value' slot='end'>{current.value} ({log?.unit[current.unit]})</IonText> : null}
        </IonItem>
    )
}

