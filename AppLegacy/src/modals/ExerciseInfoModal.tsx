import { IonModal } from '@ionic/react';
import React from 'react'
import ExerciseInfo from '../components/Exercise/ExerciseInfo';
import { IExercise } from '../data/models/Exercise';

interface ExerciseInfoModalProps {

}

interface State {
    show: boolean,
    exercise?: IExercise
}
export default class ExerciseInfoModal extends React.Component<ExerciseInfoModalProps, State>{
    static ref: ExerciseInfoModal | null = null;
    state: State = {
        show: false,
        exercise: undefined
    }
    static Show(exercise: IExercise) {
        ExerciseInfoModal.ref?.show(exercise);
    }
    show(exercise: IExercise) {
        this.setState({
            show: true,
            exercise
        })
    }
    hide() {
        this.setState({
            show: false,
            exercise: undefined
        })
    }
    render() {
        if (!this.state.exercise) {
            return null;
        }
        return (
            <IonModal isOpen={this.state.show}>
                <ExerciseInfo onBack={this.hide.bind(this)} exercise={this.state.exercise} />
            </IonModal>
        )
    }
}