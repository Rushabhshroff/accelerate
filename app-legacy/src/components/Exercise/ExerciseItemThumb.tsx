import { IonAvatar, IonText } from '@ionic/react'
import React from 'react'
import { IExercise } from '../../data/models/Exercise'


interface ExerciseItemThumbnailProps {
    exercise: IExercise
}
const ExerciseItemThumbnail: React.FC<ExerciseItemThumbnailProps> = (props) => {
    let exercise = props.exercise
    return (
        <IonAvatar style={{ "--border-radius": "0%" }} slot='start'>
            {exercise.thumbnail ? <img src={`/assets/workouts${exercise.thumbnail.toLocaleLowerCase()}`} /> :
                <div
                    className='centering-box'
                    style={{
                        backgroundColor: 'var(--ion-color-light)',
                        borderRadius: '50%',
                        height: '100%'
                    }}>
                    <IonText>{exercise.exerciseName[0].toUpperCase()}</IonText>
                </div>
            }
        </IonAvatar>
    )
}

export default ExerciseItemThumbnail;