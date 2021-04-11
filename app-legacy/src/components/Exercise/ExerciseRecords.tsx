import { IonContent, IonItem, IonPage, IonText } from '@ionic/react'
import React from 'react'
import { IExercise } from '../../data/models/Exercise'
import { WorkoutExercise } from '../../data/models/Workout'
import Header from '../Header'
import moment from 'moment'
import { Unit } from '../../utils/Units'
import NoDataSvg from '../../svg/NoData'
interface ExerciseRecordsProps {
    exercise: IExercise
    history: WorkoutExercise[]
    OnBack?: () => void
}
const ExerciseRecords: React.FC<ExerciseRecordsProps> = (props) => {
    const exercise = props.exercise
    const records = WorkoutExercise.records(exercise, props.history)
    const noData = records.maximums.length <= 0 && records.total.length <= 0
    return (
        <IonPage>
            <Header backRoute='/exercise-list' titleStyle={{ fontSize: 16 }} title={exercise.exerciseName} onBack={props.OnBack} noborder backButton />
            <IonContent>
                {noData ? <div className='centering-box' style={{ width: '100%', height: '100%', flex: 1 }}>
                    <NoDataSvg style={{ height: 200 }} />
                    <IonText style={{ margin: 20 }}>No Records</IonText>
                </div> : <>
                        {records.maximums.length > 0 ?
                            <>
                                <IonItem >
                                    <IonText className='light-text'>Personal Records</IonText>
                                </IonItem>
                                {records.maximums.map((r, i) => {
                                    if (!r) {
                                        return null;
                                    }
                                    return (
                                        <IonItem key={i} lines='none'>
                                            <div>
                                                <IonText>{r.text}</IonText>
                                                <br />
                                                <IonText className='light-text'>{moment.utc(r.timestamp).format('dddd, do MMMM, YYYY, hh:mm A')}</IonText>
                                            </div>
                                            <IonText slot='end'>{r.value} {r.unit ? Unit(r.unit, r.type as 'weight' | 'distance') : ''}</IonText>
                                        </IonItem>
                                    )
                                })}
                            </>
                            : null}
                        {records.total.length > 0 ?
                            <>
                                <IonItem >
                                    <IonText className='light-text'>Lifetime stats</IonText>
                                </IonItem>
                                {records.total.map((r, i) => {
                                    if (!r) {
                                        return null;
                                    }
                                    return (
                                        <IonItem key={i} lines='none'>
                                            <div>
                                                <IonText>{r.text}</IonText>
                                            </div>
                                            <IonText slot='end'>{r.value} {r.unit ? Unit(r.unit, r.type as 'weight' | 'distance') : ''}</IonText>
                                        </IonItem>
                                    )
                                })}
                            </>
                            : null}
                    </>}
            </IonContent>
        </IonPage>
    )
}

export default ExerciseRecords