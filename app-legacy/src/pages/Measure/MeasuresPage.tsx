import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonDatetime, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonText } from '@ionic/react'
import { add } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import LineCharts from '../../components/Charts/LineChart'
import Header from '../../components/Header'
import { Log } from '../../data/models/Logs'
import { Settings } from '../Settings/hook'
import './MeasuresTab.scss'
interface MeasuresPageProps extends RouteComponentProps<{ id: string }> {

}
export const MeasuresPage: React.FC<MeasuresPageProps> = (props) => {
    const [showModal, SetShowModal] = useState(false);
    const [inputValue, SetInputValue] = useState('')
    const [date, SetDate] = useState(new Date())
    const [list, SetList] = useState<Log[]>([]);
    const [isEditMode, SetIsEditMode] = useState(false);
    const [item, SelectItem] = useState<Log | undefined>(undefined)
    let id = props.match.params.id
    let Handler = Log.static(id);
    let log = Handler.Log()
    const fetchList = () => {
        Handler.list().then((res) => {
            SetList(res.docs.map((s) => new Log(s)))
        })
    }

    const Add = async () => {
        let value = Number(inputValue);
        if (value) {
            await Handler.AddLog(Number(inputValue), date);
            fetchList()
            CloseModal();
        }
    }
    const Delete = async (log: Log) => {
        await log.delete()
        fetchList()
        CloseModal()
    }
    const CloseModal = () => {
        SetIsEditMode(false);
        SelectItem(undefined);
        SetShowModal(false)
    }
    const ShowModal = (editMode?: boolean, item?: Log) => {
        SelectItem(item);
        SetInputValue(String(item?.value))
        SetDate(new Date(item?.timestamp || date))
        SetIsEditMode(editMode || false);
        SetShowModal(true)
    }
    useEffect(() => {
        fetchList();
    }, [])

    return (
        <IonPage className='logs-page'>
            <Header title={id} backButton noborder>

            </Header>
            <IonContent>
                <LineCharts series={ToSeries(list, log?.name || '')} title={`${log?.name} (${log?.unit[Settings.current.sizeUnit]})`} />
                <IonItem lines='none'>
                    History
                    <IonButtons slot='end'>
                        <IonButton onClick={() => ShowModal()} slot='icon-only' >
                            <IonIcon icon={add} />
                        </IonButton>
                    </IonButtons>
                </IonItem>
                {list.map((item, key) => {
                    return (
                        <IonItem onClick={() => {
                            ShowModal(true, item)
                        }} button lines='none' key={item.timestamp}>
                            <IonText slot='start' className='date'>{new Date(item.timestamp).toDateString()}</IonText>
                            <IonText slot='end' className='value'>{item.value} {log?.unit[item.unit]}</IonText>
                        </IonItem>
                    )
                })}
            </IonContent>
            <IonModal cssClass='small-modal' isOpen={showModal} >
                <IonCard style={{ pointerEvents: 'normal' }}>
                    <IonItem lines='full'>
                        <IonText>{id}</IonText>
                        <IonDatetime max={new Date().toISOString()} onIonChange={(e) => SetDate(new Date(e.detail.value || date))} slot='end' value={date.toISOString()} />
                    </IonItem>
                    <IonCardContent>
                        <IonItem lines='none' className='ion-input'>
                            <IonInput value={inputValue} onIonChange={(e) => SetInputValue(e.detail.value || '')} type='number' />
                            <IonLabel slot='end'>{log?.unit[Settings.current.sizeUnit]}</IonLabel>
                        </IonItem>
                        <IonItem lines='none'>
                            {isEditMode ? <IonButtons slot='start'>
                                <IonButton color='danger' onClick={() => item ? Delete(item) : {}}>
                                    <IonText>Delete</IonText>
                                </IonButton>
                            </IonButtons> : null}
                            <IonButtons slot='end'>
                                <IonButton onClick={CloseModal}>
                                    <IonText>Cancel</IonText>
                                </IonButton>
                                <IonButton onClick={Add} color='primary'>
                                    <IonText>Add</IonText>
                                </IonButton>
                            </IonButtons>
                        </IonItem>
                    </IonCardContent>
                </IonCard>
            </IonModal>
        </IonPage>
    )
}

function ToSeries(data: Log[], name: string) {
    return [{
        name: name,
        data: data.map((s) => [s.timestamp, s.value])
    }]
}