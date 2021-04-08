import { IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonItemDivider, IonItemGroup, IonPage, IonText, IonTitle, useIonModal } from '@ionic/react'
import { add } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Header } from '../../components'
import { BodyMeasuresForm } from '../../components/body-measures'
import { Chart, ChartDuration, ChartSeries } from '../../components/charts'
import { BodyMeasure, BodyMeasures } from '../../database/models/body-measures'
import { Duration } from '../../utils'

export interface BodyMeasuresPage {

}
export const BodyMeasuresPage: React.FC<BodyMeasuresPage> = (props) => {
    const [ShowForm, HideForm] = useIonModal(() => <BodyMeasuresForm onDismiss={OnFormDismiss} />)
    const [measures, SetMeasures] = useState<BodyMeasure[]>([])
    const [duration, SetDuration] = useState<ChartDuration>('3m')
    const [chartSeries, SetChartSeries] = useState<ChartSeries>([])
    const [measureName, SetMeasureName] = useState<string>(Object.keys(BodyMeasures)[0])
    const OnFormDismiss = (refresh?: boolean) => {
        HideForm()
        if (refresh) {
            UpdateHistory()
        }
    }
    useEffect(() => {
        UpdateHistory()
    }, [])
    useEffect(() => {
        let start = Duration.toStartDate(duration);
        let data = measures.filter((d) => {
            return d.timestamp >= start && d.data[measureName] !== undefined
        });
        let series = data.length > 0 ? [{
            name: BodyMeasures[measureName],
            data: data.map((d) => {
                return { x: new Date(d.date).getTime() - new Date().getTimezoneOffset() * 60 * 1000, y: Math.round(d.data[measureName]?.current.value||0) }
            })
        }] : []
        SetChartSeries(series)
    }, [measures, measureName])
    const UpdateHistory = () => {
        BodyMeasure.getAll().then((res) => {
            let measures = res.docs.sort((a, b) => b.timestamp - a.timestamp).map((d) => new BodyMeasure(d))
            SetMeasures(measures)
        })
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Body Measures</IonTitle>
                <IonButtons slot='end'>
                    <IonButton onClick={() => ShowForm({ swipeToClose: true, mode: 'ios' })}>
                        <IonIcon size='large' icon={add} color='primary' />
                    </IonButton>
                </IonButtons>
            </Header>
            <IonContent>
                <Chart series={chartSeries} defaultDuration={duration} onDurationChange={SetDuration} />
                <div className='horizontal-scroll'>
                    {Object.keys(BodyMeasures).map((key) => {
                        let active = key === measureName
                        return (
                            <IonChip key={key} onClick={() => SetMeasureName(key)} className='x-small' color={active ? 'primary' : 'medium'} outline={!active}>{BodyMeasures[key]}</IonChip>
                        )
                    })}
                </div>
                <IonItem lines='none'>Body Measures History</IonItem>
                {measures.map((m) => {
                    return (
                        <IonItemGroup key={m._id}>
                            <IonItemDivider>{m.date}</IonItemDivider>
                            {Object.keys(m.data).map((d) => {
                                if (m.data[d] === undefined) {
                                    return null
                                }
                                let name = BodyMeasures[d]
                                return (
                                    <IonItem lines='none' key={d}>
                                        <IonText>{name}</IonText>
                                        <IonText slot='end'>{m.data[d]?.current.toString()}</IonText>
                                    </IonItem>
                                )
                            })}
                        </IonItemGroup>
                    )
                })}
            </IonContent>
        </IonPage>
    )
}