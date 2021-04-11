import { IonContent, IonImg, IonList, IonListHeader, IonPage, IonText } from '@ionic/react'
import React from 'react'
import { IExercise } from '../../data/models/Exercise'
import Header from '../Header'
import './ExerciseInfo.scss'
interface ExerciseInfoProps {
    exercise: IExercise,
    onBack?:()=>void
}

const ExerciseInfo: React.FC<ExerciseInfoProps> = (props) => {
    let exercise = props.exercise
    const getMedia = () => {
        if (exercise.mediaType === "") {
            return undefined;
        }
        if (exercise.mediaType === 'image') {
            return `/assets/workouts${exercise.imageUrl?.toLocaleLowerCase()}`
        }
        if (exercise.mediaType === 'video') {
            return `/assets/workouts${exercise.videoUrl?.toLocaleLowerCase()}`
        }
    }
    const media = getMedia()
    const instructions = exercise.instructions && exercise.instructions.length > 0
    return (
        <IonPage>
            <Header backRoute='/exercise-list' onBack={props.onBack} titleStyle={{ fontSize: 16 }} title={exercise.exerciseName} noborder backButton />
            <IonContent>
                {media ? <img src={getMedia()} className='exerciseinfo-head-image' /> : null}
                {instructions ? <IonList style={{ padding: 16 }}>
                    <IonListHeader style={{ fontSize: 20, textDecoration: 'underline' }}>Instructions</IonListHeader>
                    {exercise.instructions?.map((t, i) => {
                        return (
                            <IonText key={i}>{i + 1}. {t} <br /> <br /></IonText>
                        )
                    })}
                </IonList> : null}
            </IonContent>
        </IonPage>
    )
}

export default ExerciseInfo