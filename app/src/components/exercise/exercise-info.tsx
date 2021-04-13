import { IonContent, IonText } from '@ionic/react'
import React from 'react'
import { ExerciseInfo as EXInfo } from '../../database'

export interface ExerciseInfo {
    exercise: EXInfo
}
export const ExerciseInfo: React.FC<ExerciseInfo> = (props) => {
    const { exercise } = props;
    const getMedia = () => {
        if (exercise.videoUrl) {
            return exercise.videoUrl
        }
        if (exercise.imageUrl) {
            return exercise.imageUrl
        }
        return undefined
    }
    const media = getMedia()
    return (
        <IonContent>
            {media ? <img src={`/assets/workouts${media.toLowerCase()}`} alt="" /> : null}
            <div className='p-3'>
                <IonText>Instructions</IonText>
                <ol style={{ padding: "5px 25px" }}>
                    {exercise.instructions.map((is, i) => {
                        return (
                            <li key={i}>{is}</li>
                        )
                    })}
                </ol>
            </div>
        </IonContent>
    )
}