import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonPage, IonText, useIonAlert, useIonModal } from '@ionic/react'
import { add } from 'ionicons/icons'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { EditWorkout, HorizontalCalender } from '../../../components'
import { WorkoutHistoryList } from '../../../components/workout/workout-history-list'
import { Exercise, IWorkout, Workout } from '../../../database/models'
import { AppSettings, WorkoutController } from '../../../utils'
import { PowerManagement } from '@ionic-native/power-management'
import './styles.scss'
import { useStartWorkout } from '../../../hooks/useStartWorkout'

export const WorkoutSegment: React.FC<RouteComponentProps> = (props) => {
    const [date, SetDate] = useState(moment())
    return (
        <IonContent style={{ height: '100%' }}>
            <HorizontalCalender onSelectDate={SetDate} />
            <WorkoutHistoryList date={date.toDate()} />
            <IonFab className={date.isAfter(moment()) ? 'fab-hide' : ''} slot='fixed' vertical='bottom' horizontal='end'>
                <IonFabButton routerLink={`/workout/create?date=${date.toDate().getTime()}`}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </IonContent>
    )
}
