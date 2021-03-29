import { IonContent, IonText } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { Exercise, ExerciseInfo } from '../../database'
import { NoDataSvg } from '../core'
import { ExerciseHistoryItem } from './exercise-history-item'

export interface ExerciseHistory {
    exercise: ExerciseInfo
}
export const ExerciseHistory: React.FC<ExerciseHistory> = (props) => {
    const { exercise } = props
    const [history, SetHistory] = useState<Exercise[]>([])
    useEffect(() => {
        exercise.getHistory().then((res) => {
            res = res.sort((a,b)=>(b.timestamp||0) - (a.timestamp||0))
            console.log(res)
            SetHistory(res)
        })
    }, [props.exercise])
    return (
        <IonContent >
            {history.length == 0 ? <div className='page all-center'>
                <NoDataSvg style={{height:200}} />
                <IonText className='m-3'>No History</IonText>
            </div> : null}
            {history.map((ex) => {
                return (
                    <ExerciseHistoryItem key={ex._id} exercise={ex} exerciseInfo={exercise} />
                )
            })}
        </IonContent>
    )
}