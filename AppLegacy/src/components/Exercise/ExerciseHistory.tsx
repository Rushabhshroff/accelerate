import { IonCard, IonCardSubtitle, IonCol, IonContent, IonItem, IonPage, IonRow, IonText } from '@ionic/react'
import React from 'react'
import { IExercise } from '../../data/models/Exercise'
import { WorkoutExercise } from '../../data/models/Workout'
import Header from '../Header'
import './ExerciseHistory.scss'
import moment from 'moment'
import NoDataSvg from '../../svg/NoData'
interface ExerciseHistoryProps {
    exercise: IExercise,
    history: WorkoutExercise[]
    OnBack?: () => void
}
const ExerciseHistory: React.FC<ExerciseHistoryProps> = (props) => {
    const exercise = props.exercise
    const history = props.history
    return (
        <IonPage>
            <Header backRoute='/exercise-list' titleStyle={{ fontSize: 16 }} title={exercise.exerciseName} onBack={props.OnBack} noborder backButton />
            <IonContent className='exercise-history'>
                {history.length <= 0 ? <div className='centering-box' style={{ width: '100%', height: '100%',flex:1 }}>
                    <NoDataSvg style={{ height: 200 }} />
                    <IonText style={{margin:20}}>No History</IonText>
                </div> :
                    <>
                        {history.map((item) => {
                            return (
                                <IonCard key={item._id} className='card'>
                                    <IonItem lines='full'>
                                        <IonCardSubtitle>{moment.utc(item.timestamp).format('dddd, do MMMM, YYYY, hh:mm A')}</IonCardSubtitle>
                                    </IonItem>
                                    <IonItem lines='none'>
                                        <IonText className='light-text'>Performed Sets</IonText>
                                    </IonItem>
                                    {item.sets.map((set, i) => {
                                        return (
                                            <IonRow key={set._id} >
                                                <IonCol size='1'>{i + 1}</IonCol>
                                                <IonCol size='11'>{item.WorkoutSetToText(set)}</IonCol>
                                            </IonRow>
                                        )
                                    })}
                                </IonCard>
                            )
                        })}
                    </>
                }
            </IonContent>
        </IonPage>
    )
}

export default ExerciseHistory