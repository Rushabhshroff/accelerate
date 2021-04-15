import { IonItem, IonText, useIonAlert, useIonModal } from '@ionic/react'
import React from 'react'
import { useActiveWorkout } from '../../hooks/useActiveWorkout'
import { WorkoutController } from '../../utils'
import { DurationText } from '../core/duration-text'
import { EditWorkout } from './edit-workout'



export const PendingWorkout: React.FC = (props) => {
    let { workout, exercises } = useActiveWorkout()
    if (!workout) {
        return null
    }
    return (
        <IonItem routerLink='/workout/current' className='ion-no-padding border-top' lines='none' button detail>
            <section className='all-center page '>
                <IonText className='large'>{workout?.name}</IonText>
                <DurationText liveMode={true} workout={workout} />
            </section>
        </IonItem>
    )
}