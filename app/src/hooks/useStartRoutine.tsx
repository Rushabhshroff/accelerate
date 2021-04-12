import { useIonAlert, useIonModal } from '@ionic/react';
import React from 'react'
import { EditWorkout } from '../components';
import { RoutineToWorkout } from '../components/workout/workout-functions';
import { WorkoutRoutine } from '../database/models/workout-routine';
import { WorkoutController } from '../utils';


export function useStartRoutine(routine?: WorkoutRoutine) {
    const { workout, exercises } = RoutineToWorkout(routine);
    const [OpenModal, Dismiss] = useIonModal(() => <EditWorkout onDiscard={OnDiscard} onDismiss={Dismiss} liveMode={true} workout={workout} exercises={exercises} />)
    const [Alert] = useIonAlert()
    const OnDiscard = () => {
        Alert("Are you sure you want to discard this workout?", [
            { text: 'Cancel', role: 'cancel' },
            {
                text: 'Yes, Discard', handler: () => {
                    WorkoutController.reset()
                    Dismiss()
                }
            }
        ])
    }
    const Start = () => {
        WorkoutController.active = workout
        WorkoutController.exercises = exercises
        WorkoutController.events.emit('change')
        OpenModal({ mode: 'ios', swipeToClose: true })
    }
    return () => {
        if (WorkoutController.active) {
            Alert({
                header: "Start new workout?",
                message: "Your current workout will be discarded. This cannot be undone.",
                buttons: [
                    { text: 'cancel', role: 'cancel' },
                    {
                        text: 'Yes Discard', handler: () => {
                            Start()
                        }
                    }
                ]
            })
        } else {
            Start()
        }
    }
}