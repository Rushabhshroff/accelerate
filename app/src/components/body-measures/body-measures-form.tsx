import { IonButton, IonButtons, IonContent, IonDatetime, IonIcon, IonInput, IonItem, IonItemGroup, IonPage, IonText, IonTitle } from '@ionic/react'
import { close } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Header } from '..'
import { BodyMeasure, BodyMeasures, BodyMeasureUnits, IBodyMeasure } from '../../database/models/body-measures'
import { useObjectReducer } from '../../hooks'
import { StringUtils, Unit } from '../../utils'

export interface BodyMeasuresForm {
    onDismiss?: (refresh?: boolean) => void,
    prev?: BodyMeasure
}
export const BodyMeasuresForm: React.FC<BodyMeasuresForm> = (props) => {
    const prev = props.prev
    const [measure, SetBodyMeasure] = useState<IBodyMeasure>({ date: new Date().toDateString(), data: {}, timestamp: Date.now() })
    const Units = BodyMeasureUnits()
    useEffect(() => {
        (async () => {
            let curr = await BodyMeasure.date(measure.date)
            if (curr) {
                SetBodyMeasure(curr)
            } else {
                //@ts-ignore
                delete measure._id; delete measure._rev;
                SetBodyMeasure({ ...measure })
            }
        })().catch(console.log)
    }, [measure.date])
    const Save = async () => {
        let ob = new BodyMeasure(measure);
        ob.timestamp = new Date(new Date(ob.date).toISOString()).getTime()
        for (let key in ob.data) {
            if (ob.data[key] === undefined) {
                delete ob.data[key]
            }
        }
        await ob.save();
        if (props.onDismiss) {
            props.onDismiss(true)
        }
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={() => props.onDismiss ? props.onDismiss() : {}}>
                        <IonIcon size='large' icon={close} />
                    </IonButton>
                </IonButtons>
                <IonTitle>Add Body Measures</IonTitle>
                <IonButtons slot='end'>
                    <IonButton disabled={measure.data == {}} onClick={Save}>
                        <IonText color='primary' >Save</IonText>
                    </IonButton>
                </IonButtons>
            </Header>
            <IonContent>
                <IonItemGroup>
                    <IonItem lines='full'>
                        <IonText>Date</IonText>
                        <IonDatetime onIonChange={(e) => {
                            if (e.detail.value) {
                                SetBodyMeasure({
                                    ...measure,
                                    date: new Date(e.detail.value).toDateString()
                                })
                            }
                        }} max={new Date().toISOString()} value={new Date(measure.date).toDateString()} slot='end' />
                    </IonItem>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItem lines='none'>Measurements</IonItem>
                    {Object.keys(BodyMeasures).map((key) => {
                        let unit = Units[key]
                        let value = measure.data[key]
                        let previous = prev ? prev.data[key] : undefined;
                        return (
                            <IonItem key={key}>
                                <IonText className='small'>{BodyMeasures[key]} ({Units[key]})</IonText>
                                <IonInput onIonChange={(e) => {
                                    let val = e.detail.value
                                    let num = val ? StringUtils.SanitizeToNumber(val) : undefined;
                                    SetBodyMeasure({
                                        ...measure,
                                        data: {
                                            ...measure.data,
                                            [key]: val ? Unit.parse(`${num}${unit}`) : undefined
                                        }
                                    })
                                }} value={value ? value.value : undefined} type='number' style={{ textAlign: 'end', maxWidth: '30%' }} slot='end' placeholder={previous ? previous.toString(1) : '-'} />
                                {value ? <IonText slot='end' className='small'>{value._unit}</IonText> : null}
                            </IonItem>
                        )
                    })}
                </IonItemGroup>
            </IonContent>
        </IonPage>
    )
}