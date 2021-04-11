import { IonText } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { Settings } from '../../pages/Settings/hook'
import WorkoutManager from '../../utils/WorkoutManager'
import moment from 'moment'
import Time from '../../utils/Time'
const ExerciseTimerText: React.FC<any> = (props) => {
    const [time, SetTime] = useState(WorkoutManager.workout ? Date.now() - WorkoutManager.workout.startTimestamp : 0)
    useEffect(() => {
        let interval = setInterval(() => {
            if (WorkoutManager.workout) {
                SetTime(Date.now() - WorkoutManager.workout.startTimestamp)
            }
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    return (
        <IonText {...props}>{(time / 1000).toHHMMSS()}</IonText>
    )
}

export default ExerciseTimerText