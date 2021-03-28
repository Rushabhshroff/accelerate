import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import { IExercise } from '../../data/models/Exercise'
import { WorkoutExercise } from '../../data/models/Workout'
import GraphHolder from '../Charts/GraphHolder'
import LineCharts from '../Charts/LineChart'
import Header from '../Header'

interface ExerciseChartsProps {
    exercise: IExercise,
    history: WorkoutExercise[]
    OnBack?: () => void
}
const ExerciseCharts: React.FC<ExerciseChartsProps> = (props) => {
    const exercise = props.exercise
    const history = props.history
    const graphs = WorkoutExercise.graphs(exercise, history)
    return (
        <IonPage>
            <Header backRoute='/exercise-list' titleStyle={{ fontSize: 16 }} title={exercise.exerciseName} onBack={props.OnBack} noborder backButton />
            <IonContent>
                {Object.keys(graphs).map((key) => {
                    return (
                        <LineCharts key={key} series={graphs[key].series} title={graphs[key].title} />
                    )
                })}
            </IonContent>
        </IonPage>
    )
}

export default ExerciseCharts