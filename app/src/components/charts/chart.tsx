import { IonIcon, IonItem, IonSegment, IonSegmentButton, IonText, useIonRouter } from '@ionic/react'
import { ApexOptions } from 'apexcharts';
import { barChart, lockClosed } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import ApexChart from 'react-apexcharts';
import { useLocation } from 'react-router';
import { useInAppPurchase } from '../../hooks/useInAppPurchase';
import { CSS } from '../../utils';
import './styles.scss'
export type ChartDuration = '3m' | '6m' | '1y' | 'L'
export type ChartSeries = {
    name: string,
    data: any[]
}[]
export type ChartType = "line" | "area" | "bar" | "histogram" | "pie" | "donut" | "rangeBar" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "radar" | "polarArea"
export interface Chart {
    header?: React.ReactNode,
    defaultDuration?: ChartDuration,
    onDurationChange?: (duration: ChartDuration) => void
    series?: ChartSeries,
    type?: ChartType,
    title?: string
}

export const Chart: React.FC<Chart> = (props) => {
    const options = {
        chart: {
            toolbar: {
                show: false
            }
        },
        theme: {
            monochrome: {
                enabled: true,
                color: CSS.variable('--ion-color-primary')
            },
        },
        yaxis: {
            show: true,
        },
        xaxis: {
            type: 'datetime'
        }
    }
    const router = useIonRouter()
    const { pathname } = useLocation()
    const [duration, SetDuration] = useState<ChartDuration>(props.defaultDuration || '3m');
    const [pname, UpdatePName] = useState(pathname);
    const { fitnessPlus } = useInAppPurchase()
    useEffect(() => {
        if (duration === '3m') {
            if (props.onDurationChange) {
                props.onDurationChange(duration)
            }
        } else {
            if (!fitnessPlus) {
                SetDuration('3m')
                if (window.location.pathname !== '/subscription') {
                    router.push('/subscription', 'forward')
                }
            } else {
                if (props.onDurationChange) {
                    props.onDurationChange(duration)
                }
            }
        }
    }, [duration])
    useEffect(() => {
        UpdatePName(pathname)
    }, [pathname])
    return (
        <div className='chart-container'>
            {props.header}
            <div className='segment-container'>
                <IonSegment onIonChange={(e) => { SetDuration(e.detail.value as ChartDuration) }} value={duration} mode='ios'>
                    <IonSegmentButton value='3m'>
                        <IonText>3M</IonText>
                    </IonSegmentButton>
                    <IonSegmentButton value='6m'>
                        <IonText> <IonIcon hidden={fitnessPlus} icon={lockClosed} style={{ fontSize: 10 }} /> 6M</IonText>
                    </IonSegmentButton>
                    <IonSegmentButton value='1y'>
                        <IonText><IonIcon hidden={fitnessPlus} icon={lockClosed} style={{ fontSize: 10 }} />1Y</IonText>
                    </IonSegmentButton>
                    <IonSegmentButton value='L'>
                        <IonText><IonIcon hidden={fitnessPlus} style={{ fontSize: 10 }} icon={lockClosed} /> Lifetime</IonText>
                    </IonSegmentButton>
                </IonSegment>
            </div>
            {props.title ? <IonItem lines='none'>
                <IonText >{props.title}</IonText>
            </IonItem> : null}
            <div className='chart-holder'>
                {props.series && props.series.length > 0 ?
                    <ApexChart type={props.type || 'area'} series={props.series || []} options={options} /> :
                    <div className='no-data-container'>
                        <IonIcon size='large' icon={barChart} color='primary' />
                        <IonText className='large' >No Data</IonText>
                    </div>
                }
            </div>
        </div>
    )
}