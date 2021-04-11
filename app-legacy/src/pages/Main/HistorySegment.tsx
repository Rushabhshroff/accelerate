import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonIcon, IonItem, IonLabel, IonRow } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import HorizontalCalender from '../../components/HorizontalCalender'
import moment from 'moment'
import { barbell, timer, walk } from 'ionicons/icons'
import "./Workout.scss"

import { Workout, WorkoutExercise } from '../../data/models/Workout'
import { Settings } from '../Settings/hook'
import { Convert, Unit } from '../../utils/Units'
import WorkoutSvg from '../../svg/Workout'
import { useLocation } from 'react-router'




interface HistorySegmentProps {
    visible?: boolean
}
export default function HistorySegment(props: HistorySegmentProps) {
    const [selectedDate, SetSelectedDate] = useState(moment())
    const [workouts, SetWorkouts] = useState<Workout[]>([])

    const [loading, SetLoading] = useState(false);
    const { pathname } = useLocation()

    useEffect(() => {
        SetLoading(true);
        Workout.findForDate(selectedDate.toDate()).then((res) => {
            SetWorkouts(
                res.docs.map((d) => {
                    return new Workout(d)
                })
            )
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            SetLoading(false)
        })

    }, [selectedDate, props.visible, pathname])
    return (
        <>
            <HorizontalCalender hide={!props.visible} onSelectDate={SetSelectedDate} selectedDate={selectedDate} />
            <IonContent className={`${props.visible ? '' : ' hide'}`}>

                <>
                    {workouts.length <= 0 ?
                        <div style={{ height: '100%' }} className='centering-box'>
                            <WorkoutSvg style={{ width: '80%', height: 200, padding: 10 }} />
                            <IonLabel>No Workouts</IonLabel>
                        </div>
                        :
                        <>
                            {workouts.map((w) => {
                                return (
                                    <WorkoutHistoryItem key={w._id} workout={w} />
                                )
                            })}
                        </>}
                </>
            </IonContent>
        </>
    )
}

interface WorkoutHistoryItemProps {
    workout: Workout
}

const WorkoutHistoryItem: React.FC<WorkoutHistoryItemProps> = (props) => {
    let workout = props.workout
    const [exercises, SetExercises] = useState<WorkoutExercise[]>([])
    const { pathname } = useLocation()
    const StatItem = (p: { icon: any, value?: string }) => {
        return (
            <IonCol className='history-item-stat' size='3'>
                <IonIcon icon={p.icon} />
                <IonLabel>{p.value}</IonLabel>
            </IonCol>
        )
    }
    useEffect(() => {
        workout.exercises().then((ex) => {
            SetExercises(ex)
        })
    }, [pathname])
    const Total = () => {
        if (exercises.length <= 0) {
            return undefined;
        }
        let total = exercises.map((t) => {
            return t.total()
        }).reduce((a, b) => {
            a.distance.value += Convert(b.distance.unit, a.distance.unit, 'weight', b.distance.value)
            a.weight.value += Convert(b.weight.unit, a.weight.unit, 'distance', b.weight.value)
            return a;
        })
        total.distance.value = Convert(total.distance.unit, Settings.current.distanceUnit, 'distance', total.distance.value);
        total.weight.value = Convert(total.weight.unit, Settings.current.weightUnit, 'weight', total.weight.value);
        total.distance.unit = Settings.current.distanceUnit
        total.weight.unit = Settings.current.weightUnit
        return total
    }
    let total = Total()
    return (
        <IonCard routerDirection='forward' routerLink={`/workout/${workout._id}`} className='card '>
            <IonCardHeader style={{ padding: '16px 16px 0px 16px' }}>
                <IonCardTitle>{workout.name}</IonCardTitle>
                <IonRow>
                    <StatItem icon={timer} value={`${workout.timeString().replace(/0?0h|0?0m|0?0s/g, '')}`} />
                    <StatItem icon={barbell} value={`${total?.weight.value} ${Unit(total?.weight.unit, 'weight')}`} />
                    <StatItem icon={walk} value={`${total?.distance.value} ${Unit(total?.distance.unit, 'distance')}`} />
                </IonRow>
            </IonCardHeader>
            <IonCardContent className='col-table' style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
                <IonItem className='title' lines='full'>
                    <IonCol size='8'>
                        Exercise
                            </IonCol>
                    <IonCol size='4'>
                        Best Set
                            </IonCol>
                </IonItem>
                {exercises.map((ex) => {
                    return (
                        <IonItem key={ex._id} className='item' lines='none'>
                            <IonCol size='8'>
                                {ex.toText()}
                            </IonCol>
                            <IonCol size='4'>
                                {ex.bestSet()}
                            </IonCol>
                        </IonItem>
                    )
                })}
            </IonCardContent>
        </IonCard>
    )
}