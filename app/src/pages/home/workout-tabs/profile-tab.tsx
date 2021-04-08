import { IonAvatar, IonButton, IonButtons, IonContent, IonIcon, IonItem, IonPage, IonText } from '@ionic/react'
import { barbellOutline, calculatorOutline, settingsOutline, statsChartOutline, syncCircleOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import { Header } from '../../../components'
import { version } from '../../../../package.json'
import { plusText, rulerOutline } from '../../../icons'
import { Chart, ChartSeries } from '../../../components/charts'
import { Workout } from '../../../database'
import { Duration } from '../../../utils'
export const ProfileTab: React.FC<RouteComponentProps> = (props) => {
    return (
        <IonPage>
            <Header>
                <IonButtons slot='end'>
                    <IonButton routerLink='/settings'>
                        <IonIcon size='large' icon={settingsOutline} />
                    </IonButton>
                </IonButtons>
                <IonButtons slot='start'>
                    <IonButton color='primary'>Edit Profile</IonButton>
                </IonButtons>
            </Header>
            <IonContent>
                <section className='all-center'>
                    <IonAvatar style={{ width: 150, height: 150 }}>
                        <img src="/assets/placeholder/male.jpg" alt="" />
                    </IonAvatar>
                </section>
                <WorkoutProgressCharts />
                <IonItem lines='none'>
                    <IonText >Accelerate</IonText>
                    <IonIcon color='primary' size='large' className='mx-1' icon={plusText} />
                    <IonButton routerLink='/subscription' mode='ios' slot='end'>
                        Unlock
                    </IonButton>
                </IonItem>
                <IonItem routerLink='/exercises' button lines='none' detail>
                    <IonIcon slot='start' icon={barbellOutline} />
                    <IonText>Exercises</IonText>
                </IonItem>
                <IonItem routerLink='/body-measures' button lines='none' detail>
                    <IonIcon slot='start' icon={rulerOutline} />
                    <IonText>Body Measures</IonText>
                </IonItem>
                <IonItem button lines='none' detail>
                    <IonIcon slot='start' icon={statsChartOutline} />
                    <IonText>Statestics</IonText>
                </IonItem>
                {/*<IonItem button lines='none' detail>
                    <IonIcon slot='start' icon={calculatorOutline} />
                    <IonText>Calculators</IonText>
                </IonItem>
                <IonItem button lines='none' detail>
                    <IonIcon slot='start' icon={syncCircleOutline} />
                    <IonText>Convertors</IonText>
    </IonItem>*/}
                <section className='all-center'>
                    <IonButton style={{ width: '80%' }}>Logout</IonButton>
                    <IonText className='m-2'>Made with ❤ in India</IonText>
                    <IonText className='m-2'>{version}</IonText>
                </section>
            </IonContent>
        </IonPage>
    )
}

function WorkoutProgressCharts() {
    const [workouts, SetWorkout] = useState<Workout[]>([])
    const [series, SetSeries] = useState<ChartSeries>([])
    const {pathname} = useLocation()
    useEffect(() => {
        Workout.getAll().then((w) => {
            let ws = w.docs.map((d) => new Workout(d))
            SetWorkout(ws);
        })
    }, [pathname])
    useEffect(() => {
        let data = workouts.map((w) => {
            let hours = Number(new Duration((w.endTimestamp || w.startTimestamp) - w.startTimestamp).hours().toFixed(2))
            console.log(hours);
            return { x: w.startTimestamp, y: hours }
        }).filter((s) => s.y > 0).sort((a, b) => a.x - b.x);
        data = ClubHours(data);
        let series = data.length > 0 ? [{
            name: "Hours",
            data: data
        }] : []
        SetSeries(series)
    }, [workouts])
    return (
        <section>
            <Chart type='bar' series={series} />
        </section>
    )
}

function ClubHours(data: { x: number, y: number }[]) {
    let ret: { x: number, y: number }[] = [];
    data.forEach((d) => {
        if (ret.length == 0) {
            ret.push(d)
        } else {
            let peek = ret[ret.length - 1]
            if (new Date(peek.x).toDateString() === new Date(d.x).toDateString()) {
                peek.x = d.x;
                peek.y += d.y
            }else{
                ret.push(d)
            }
        }
    })
    return ret
}