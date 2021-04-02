import { IonList, IonRow } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { Workout } from '../../database'
import { ExerciseSvg, WorkoutSvg } from '../core'
import { Loader } from '../core/Loader'
import { WorkoutHistoryListItem } from './workout-history-list-item'
export interface WorkoutHistoryList {
    date: Date
}
export const WorkoutHistoryList: React.FC<WorkoutHistoryList> = (props) => {
    const [workouts, SetWorkouts] = useState<Workout[]>([])
    useEffect(() => {
        (async () => {
            let start = props.date.setHours(0, 0, 0, 0);
            let end = props.date.setHours(23, 59, 59, 999);
            let workouts = await Workout.find({
                selector: {
                    $and: [
                        { startTimestamp: { $gte: start } },
                        { startTimestamp: { $lte: end } }
                    ]
                }
            }).then((res) => res.docs.map((d) => new Workout(d)));
            SetWorkouts(workouts)
        })().catch((err) => {

        })
    }, [props.date])
    if (workouts.length <= 0) {
        return (
            <div style={{height:'80%'}} className='all-center'>
                <ExerciseSvg style={{ width: 200 }} />
            </div>
        )
    }
    return (
        <IonRow>
            {workouts.map((w) => {
                return (
                    <WorkoutHistoryListItem workout={w} />
                )
            })}
        </IonRow>
    )
}