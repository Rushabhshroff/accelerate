import { IonButton, IonButtons, IonIcon, IonItem, IonText, useIonModal } from '@ionic/react'
import { addCircleOutline, chevronForward, folderOpen, folderOpenOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useLocation } from 'react-router'
import { EditWorkout, TouchableOpcity, WorkoutRoutineListItem } from '../../../components'
import { Workout } from '../../../database'
import { WorkoutRoutine } from '../../../database/models/workout-routine'
import './styles.scss'

export const RoutinesSegment: React.FC<RouteComponentProps> = (props) => {
    const {pathname} = useLocation()
    const [routines, SetRoutines] = useState<WorkoutRoutine[]>([])
    useEffect(() => {
        WorkoutRoutine.getAll().then((res) => {
            SetRoutines(res.docs.map((r) => new WorkoutRoutine(r)))
        })
    }, [pathname])
    return (
        <>
            <section>
                <IonButton>Browse Routines</IonButton>
            </section>
            <RoutinesFolder >
                {routines.map((r) => {
                    return (
                        <WorkoutRoutineListItem key={r._id} routine={r} />
                    )
                })}
            </RoutinesFolder>
        </>
    )
}

interface RoutinesFolderProps {

}
const RoutinesFolder: React.FC<RoutinesFolderProps> = (props) => {

    const [state, SetState] = useState<' ' | 'collapsed'>(' ')
    const Toggle = () => SetState(state === ' ' ? 'collapsed' : ' ')
    const [NewRoutine, Dismiss] = useIonModal(() => <EditWorkout exercises={[]} workout={new Workout({ name: 'Routine', startTimestamp: Date.now() })} templateMode={true} liveMode={false} onDismiss={Dismiss} />)

    return (
        <section className={`collapsible ${state}`}>
            <IonItem lines='none'>
                <TouchableOpcity onClick={Toggle} slot='start'>
                    <IonIcon className='arrow' size='small' color='primary' icon={chevronForward} />
                </TouchableOpcity>
                <IonText>Your Routines</IonText>
                <TouchableOpcity onClick={() => NewRoutine({ mode: 'ios', swipeToClose: true })} slot='end'>
                    <IonIcon size='large' color='primary' icon={addCircleOutline} />
                </TouchableOpcity>
            </IonItem>
            <div className='child'>
                {props.children}
            </div>
        </section>
    )
}