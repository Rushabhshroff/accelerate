import React, { useEffect, useState } from 'react'
import { Exercise, ExerciseGraphOptions, ExerciseInfo } from '../../database'
import { CSS } from '../../utils'
import { ExerciseListItem } from './exercise-list-item'
import './styles.scss'
import { IonButton, IonButtons, IonChip, IonSelect, IonSelectOption, IonText, useIonPicker } from '@ionic/react';
import { ChartFunctionMap, ChartType } from './exercise-charts-function';
import { Chart, ChartDuration, ChartSeries } from '../charts';
export interface ExerciseChart {
    exercise: ExerciseInfo,
    history: Exercise[]
}
export const ExerciseChart: React.FC<ExerciseChart> = (props) => {
    const [duration, SetDuration] = useState<ChartDuration>('3m')
    const [chartType, SetChartType] = useState<ChartType>(ExerciseGraphOptions[props.exercise.category][0])
    const [series, SetSeries] = useState<ChartSeries>([])
    const HandleDurationChange = (val: ChartDuration) => {
        SetDuration(val)
    }
    useEffect(() => {
        let series = ChartFunctionMap[chartType](props.history, duration)
        SetSeries(series)
    }, [chartType, props.history, duration])
    return (
        <div style={{ paddingTop: 10 }}>
            <Chart
                title={series.length > 0 ? series[0].name : undefined}
                series={series}
                onDurationChange={HandleDurationChange}
                header={<ExerciseListItem noDetail exercise={props.exercise} >
                </ExerciseListItem>}
            />
            <div className='horizontal-scroll'>
                {ExerciseGraphOptions[props.exercise.category].map((e) => {
                    let selected = e === chartType
                    return (
                        <IonChip key={e} onClick={() => SetChartType(e)} color={selected ? 'primary' : 'medium'} outline >{e.replaceAll('-', ' ')}</IonChip>
                    )
                })}
            </div>
        </div>
    )
}


