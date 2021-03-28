import React from 'react'
import './styles.scss'
interface ExerciseThumbnail {
    exerciseName: string
    thumbUrl?: string
}
export const ExerciseThumbnail: React.FC<ExerciseThumbnail> = (props) => {
    if (props.thumbUrl) {
        return (
            <img slot='start' className='exercise-thumb' src={`/assets/workouts${props.thumbUrl.toLowerCase()}`} alt={props.exerciseName} />
        )
    } else {
        return (
            <div slot='start' className='circle'>{props.exerciseName[0].toUpperCase()}</div>
        )
    }
}