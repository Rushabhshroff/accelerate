import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonRouter } from '@ionic/react'
import { clipboard, informationCircle, reload, statsChart } from 'ionicons/icons';
import React, { useEffect, useState } from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import ExerciseCharts from '../../components/Exercise/ExerciseCharts';
import ExerciseHistory from '../../components/Exercise/ExerciseHistory';
import ExerciseInfo from '../../components/Exercise/ExerciseInfo';
import ExerciseRecords from '../../components/Exercise/ExerciseRecords';
import Loading from '../../components/Loading';
import {  ExerciseData, IExercise } from '../../data/models/Exercise';
import { WorkoutExercise } from '../../data/models/Workout';

interface ExerciseInfoTabsProps extends RouteComponentProps<{ id: string }> {

}

const ExerciseInfoTabs: React.FC<ExerciseInfoTabsProps> = (props) => {
    let id = props.match.params.id
    const [exercise, SetExercise] = useState<IExercise | undefined>(undefined);
    const [history, SetHistory] = useState<WorkoutExercise[]>([]);
    const router = useIonRouter()
    const noAbout = exercise?.mediaType == '' && (!exercise.instructions || exercise.instructions?.length <= 0)
    useEffect(() => {
        let id = props.match.params.id
        let ex = ExerciseData.map[id]
        if (ex) {
            WorkoutExercise.history(ex).then((exercises) => {
                SetHistory(exercises)
            }).finally(() => {
                SetExercise(ex)
            })

        } else {
            router.goBack()
        }
    }, [])
    if (!exercise) {
        return (
            <Loading />
        )
    }
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path='/exercise-info/:id/about' render={(props) => noAbout ? null : <ExerciseInfo {...props} exercise={exercise} />} />
                <Route exact path='/exercise-info/:id/history' render={(props) => <ExerciseHistory {...props} exercise={exercise} history={history} />} />
                <Route exact path='/exercise-info/:id/charts' render={(props) => <ExerciseCharts {...props} exercise={exercise} history={history}/>} />
                <Route exact path='/exercise-info/:id/records' render={(props) => <ExerciseRecords {...props} exercise={exercise} history={history} />} />
                <Route exact path='/exercise-info/:id'>
                    {noAbout ? <Redirect to={`/exercise-info/${id}/history`} /> : <Redirect to={`/exercise-info/${id}/about`} />}
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot='bottom'>
                {noAbout ? null : <IonTabButton tab='about' href={`/exercise-info/${id}/about`}>
                    <IonIcon icon={informationCircle} />
                    <IonLabel>About</IonLabel>
                </IonTabButton>}
                <IonTabButton tab='history' href={`/exercise-info/${id}/history`}>
                    <IonIcon icon={reload} />
                    <IonLabel>History</IonLabel>
                </IonTabButton>
                <IonTabButton tab='charts' href={`/exercise-info/${id}/charts`}>
                    <IonIcon icon={statsChart} />
                    <IonLabel>Charts</IonLabel>
                </IonTabButton>
                <IonTabButton tab='records' href={`/exercise-info/${id}/records`}>
                    <IonIcon icon={clipboard} />
                    <IonLabel>Records</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default ExerciseInfoTabs;