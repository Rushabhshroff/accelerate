import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonText, useIonModal, useIonRouter } from '@ionic/react'
import { addCircleOutline, chevronForward, folderOpen, folderOpenOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import { EditWorkout, TouchableOpcity, WorkoutRoutineListItem } from '../../../components'
import { Workout } from '../../../database'
import { WorkoutRoutine } from '../../../database/models/workout-routine'
import { useInAppPurchase } from '../../../hooks/useInAppPurchase'
import { useStartWorkout } from '../../../hooks/useStartWorkout'
import './styles.scss'

export const RoutinesSegment: React.FC<RouteComponentProps> = (props) => {
    const { pathname } = useLocation()
    const router = useIonRouter()
    const [routines, SetRoutines] = useState<WorkoutRoutine[]>([])
    const { fitnessPlus } = useInAppPurchase()
    const StartWorkout = useStartWorkout()
    useEffect(() => {
        Refresh()
    }, [pathname])
    const Refresh = () => {
        WorkoutRoutine.getAll().then((res) => {
            SetRoutines(res.docs.map((r) => new WorkoutRoutine(r)))
        })
    }
    const OnAddRoutine = () => {
        if (routines.length >= 5 && !fitnessPlus) {
            router.push('/subscription')
        } else {

        }
    }
    return (
        <IonContent>
            <section>
                <IonButton  onClick={StartWorkout}>Start Empty Workout</IonButton>
            </section>
            <RoutinesFolder title='Your Routines' onAdd={OnAddRoutine} >
                {routines.map((r) => {
                    return (
                        <WorkoutRoutineListItem key={r._id} routine={r} />
                    )
                })}
            </RoutinesFolder>
        </IonContent>
    )
}

interface RoutinesFolderProps {
    onAdd?: () => void,
    title?: string
}
const RoutinesFolder: React.FC<RoutinesFolderProps> = (props) => {

    const [state, SetState] = useState<' ' | 'collapsed'>(' ')
    const Toggle = () => SetState(state === ' ' ? 'collapsed' : ' ')


    return (
        <section className={`collapsible ${state}`}>
            <IonItem lines='none'>
                <IonButton fill='clear' onClick={Toggle} slot='start'>
                    <IonIcon className='arrow' size='small' color='primary' icon={chevronForward} />
                </IonButton>
                <IonText>{props.title}</IonText>
                {props.onAdd ? <IonButton routerLink='/routine/create' style={{height:50}} fill='clear' onClick={props.onAdd} slot='end'>
                    <IonIcon size='large' color='primary' icon={addCircleOutline} />
                </IonButton> : null}
            </IonItem>
            <div className='child'>
                {props.children}
            </div>
        </section >
    )
}