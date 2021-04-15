import { useIonAlert, useIonModal, useIonRouter } from '@ionic/react';
import { Workout } from '../database';
import { WorkoutController } from '../utils';


export function useStartWorkout(date?: number) {
    const router = useIonRouter()
    const [Alert] = useIonAlert()
    const Start = () => {
        WorkoutController.active = new Workout({ name: "Workout", startTimestamp: date || Date.now() })
        WorkoutController.exercises = []
        WorkoutController.events.emit('change')
        router.push('/workout/current')
    }
    return () => {
        if (WorkoutController.active) {
            Alert({
                header: "Start new workout?",
                message: "Your current workout will be discarded. This cannot be undone.",
                buttons: [
                    { text: 'cancel', role: 'cancel' },
                    {
                        text: "Resume Current", handler: () => {
                            router.push('/workout/current')
                        }
                    },
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