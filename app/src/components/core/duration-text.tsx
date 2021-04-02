import { IonText } from "@ionic/react"
import { useEffect, useState } from "react"
import { Workout } from "../../database"
import { Duration } from "../../utils"

export interface DurationText {
    workout: Workout
    liveMode?: boolean
}
export function DurationText(props: DurationText) {
    const { liveMode, workout } = props
    const { startTimestamp, endTimestamp } = workout
    const [duration, SetDuration] = useState(new Duration(liveMode ? Date.now() - startTimestamp : 0))
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined = undefined
        if (endTimestamp) {
            SetDuration(new Duration(Math.abs(startTimestamp - endTimestamp)))
        } else {
            if (liveMode) {
                interval = setInterval(() => {
                    let dur = new Duration(Date.now() - startTimestamp)
                    SetDuration(dur);
                }, 1000)
            } else {
                SetDuration(new Duration())
            }
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [workout])
    return (
        <IonText className='block-text small'>{duration.toString()}</IonText>
    )
}