import { IonButton, IonCard, IonItem, IonRouterLink, IonText } from '@ionic/react'
import React from 'react'
import { WorkoutRoutine } from '../../database/models/workout-routine'
import { useStartRoutine } from '../../hooks/useStartRoutine'
import './styles.scss'
export interface WorkoutRoutineListItem {
    routine: WorkoutRoutine
}
export const WorkoutRoutineListItem: React.FC<WorkoutRoutineListItem> = (props) => {
    const routine = props.routine
    const StartWorkout = useStartRoutine(routine)
    return (
        <IonCard className='workout-routine-list-item'>
            <IonItem detail routerLink={`/routine/${routine._id}`} lines='full'>{routine.name}</IonItem>
            <IonRouterLink routerLink={`/routine/${routine._id}`} color='dark'>
                {routine.exercises.map((ex,i) => {
                    return (
                        <IonText key={i} className='text-item'>{ex.sets.length} x {ex.exerciseName}</IonText>
                    )
                })}
            </IonRouterLink>
            <section>
                <IonButton onClick={StartWorkout} fill='outline'>
                    Start Workout
                </IonButton>
            </section>
        </IonCard>
    )
}