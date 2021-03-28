import React, { useEffect, useState } from 'react'
import { Exercise, ExerciseGraphOptions, ExerciseInfo } from '../../database'
import { CSS } from '../../utils'
import { ExerciseListItem } from './exercise-list-item'
import Chart from "react-apexcharts";
import './styles.scss'
import { IonButton, IonButtons, IonChip, IonSelect, IonSelectOption, IonText, useIonPicker } from '@ionic/react';
import { ChartDuration, ChartFunctionMap, ChartType } from './exercise-charts-function';
export interface ExerciseChart {
    exercise: ExerciseInfo,
    history: Exercise[]
}
export const ExerciseChart: React.FC<ExerciseChart> = (props) => {
    const [duration, SetDuration] = useState<ChartDuration>('3m')
    const [chartType, SetChartType] = useState<ChartType>(ExerciseGraphOptions[props.exercise.category][0])
    const [series, SetSeries] = useState<any[][]>([])
    const HandleDurationChange = (val: ChartDuration) => {
        SetDuration(val)
    }
    useEffect(() => {
        let series = ChartFunctionMap[chartType](props.history, duration)
        SetSeries(series)
    }, [chartType])
    return (
        <div>
            <ExerciseListItem noDetail exercise={props.exercise} >
                <IonSelect onIonChange={(e) => HandleDurationChange(e.detail.value as ChartDuration)} style={{ fontSize: 12 }} className='text-block' value={duration} slot='end'>
                    <IonSelectOption value='3m'>3 Months</IonSelectOption>
                    <IonSelectOption value='6m'>6 Months</IonSelectOption>
                    <IonSelectOption disabled value='1y'>1 Year (Premium Only)</IonSelectOption>
                    <IonSelectOption disabled value='L'>Lifetime (Premium Only)</IonSelectOption>
                </IonSelect>
            </ExerciseListItem>
            <div className='chart-holder'>
                <Chart
                    options={options}
                    series={series}
                    width="100%"
                    height={200}
                />
            </div>
            <div className='horizontal-scroll'>
                {ExerciseGraphOptions[props.exercise.category].map((e) => {
                    let selected = e === chartType
                    return (
                        <IonChip onClick={() => SetChartType(e)} color={selected ? 'primary' : 'medium'} outline >{e.replaceAll('-', ' ')}</IonChip>
                    )
                })}
            </div>
        </div>
    )
}

const options = {
    chart: {
        toolbar: {
            show: false
        }
    },
    theme: {
        monochrome: {
            enabled: true,
            color: CSS.variable('--ion-color-primary')
        },
    },
    noData: {
        text: "No Data",
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
            fontSize: '14px',
        }
    },
    markers: {
        size: 5
    },
    yaxis: {
        show: true,
    },
    xaxis: {
        type: 'datetime'
    }
}
