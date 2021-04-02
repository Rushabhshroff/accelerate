import { useIonAlert, useIonModal } from '@ionic/react';
import { EditWorkout } from '../components';
import { RoutineToWorkout } from '../components/workout/workout-functions';
import { WorkoutRoutine } from '../database/models/workout-routine';


export function useEditRoutine(routine?: WorkoutRoutine,fn?:()=>void) {
    const { workout, exercises } = RoutineToWorkout(routine, true);
    const [OpenModal, Dismiss] = useIonModal(() => <EditWorkout onDismiss={OnDismiss} liveMode={false} templateMode={true} workout={workout} exercises={exercises} />)
    const Open = () => {
        OpenModal({ mode: 'ios', swipeToClose: true })
    }
    const OnDismiss = ()=>{
        Dismiss();
        if(fn) fn()
    }
    return Open
}