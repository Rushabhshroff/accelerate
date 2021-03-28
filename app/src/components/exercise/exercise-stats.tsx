import { IonContent, IonItem, IonText } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { Exercise, ExerciseInfo, ExercisePropsMap } from '../../database'
import { ExerciseValues } from '../../database/models/exercise-values'
import { ExerciseChart } from './exercise-chart'

export interface ExerciseStats {
    exercise: ExerciseInfo
}
export const ExerciseStats: React.FC<ExerciseStats> = (props) => {
    const { exercise } = props
    const [history, SetHistory] = useState<Exercise[]>([])
    const enables = Object.assign({}, ExercisePropsMap[exercise.category], { volume: true })
    const total = () => {
        let summation = ExerciseValues.default()
        history.forEach((ex) => {
            ExerciseValues.Add(summation, ex.sum())
        })
        return summation
    }
    const max = () => {
        let max = ExerciseValues.default();
        history.forEach((ex) => {
            ExerciseValues.ResolveMax(max, ex.max())
        })
        return max;
    }
    useEffect(() => {
        exercise.getHistory().then((res) => {
            SetHistory(res)
        })
    }, [props.exercise])
    let Max = max()
    let Total = total()
    return (
        <IonContent>
            <ExerciseChart exercise={exercise} history={history} />
            <section>
                <IonText className='text-light'>Best Records</IonText>
            </section>
            {Object.keys(enables).map((key) => {
                return (
                    <IonItem lines='none'>
                        <IonText>Best {key}</IonText>
                        <IonText slot='end'>{Max[key] || '-'}</IonText>
                    </IonItem>
                )
            })}
            <section>
                <IonText className='text-light'>Total Records</IonText>
            </section>
            {Object.keys(enables).map((key) => {
                return (
                    <IonItem lines='none'>
                        <IonText>Total {key}</IonText>
                        <IonText slot='end'>{Total[key] || '-'}</IonText>
                    </IonItem>
                )
            })}
        </IonContent>
    )
}