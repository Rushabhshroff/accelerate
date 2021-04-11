import { IonFab, IonFabButton, IonIcon, IonModal } from '@ionic/react'
import { checkmark } from 'ionicons/icons'

import React from 'react'
import ExerciseList from '../components/Exercise/ExerciseList'
import { IExercise } from '../data/models/Exercise'
interface State {
    show: boolean,
    selectedExercises: IExercise[],
    resolve?: (exercises: IExercise[]) => void,
    mode: 'multi' | 'single'
}
export default class ExerciseSelectModal extends React.Component {
    static ref: ExerciseSelectModal | null = null
    state: State = {
        show: false,
        selectedExercises: [],
        mode: 'multi',
    }
    show(mode: 'multi' | 'single' = 'multi') {
        return new Promise<IExercise[]>((resolve) => {
            this.setState({
                show: true,
                mode: mode,
                resolve: resolve
            })
        })
    }
    hide() {
        this.setState({
            show: false,
            selectedExercises: [],
            searching: false,
            resolve: undefined,
            mode: 'multi'
        })
    }
    onDone() {
        if (this.state.resolve) {
            this.state.resolve(this.state.selectedExercises)
        }
        this.hide()
    }

    render() {
        return (
            <IonModal isOpen={this.state.show}>
                {this.state.show?<ExerciseList selectedExercises={this.state.selectedExercises} asModal OnRequestDismiss={this.hide.bind(this)} OnSelectedExerciseListChange={(ex) => this.setState({ selectedExercises: ex })} selectable={true} selectionMode={this.state.mode} >
                    <IonFab slot='fixed' vertical='bottom' horizontal='end'>
                        <IonFabButton onClick={this.onDone.bind(this)} className={`${this.state.selectedExercises.length > 0 ? '' : 'hidden'}`}>
                            <IonIcon icon={checkmark} />
                        </IonFabButton>
                    </IonFab>
                </ExerciseList>:null}
            </IonModal>
        )
    }
}
/**
 *
 */