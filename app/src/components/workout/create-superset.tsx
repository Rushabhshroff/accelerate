import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonPage, IonTitle } from '@ionic/react'
import { checkmark, link } from 'ionicons/icons'
import React, { CSSProperties, useState } from 'react'
import { Exercise, IExercise } from '../../database/models'
import { ExerciseData, ExerciseInfo } from '../../database/models/exercise-data'
import { SupersetPallete } from '../../utils/superset-pallete'
import { Header } from '../core'
import { ExerciseListItem } from '../exercise/exercise-list-item'

export interface CreateSuperset {
    exercises: IExercise[]
    OnDone?: (exercises: IExercise[]) => void
    OnDismiss?: () => void
}
export const CreateSuperset: React.FC<CreateSuperset> = (props) => {
    const [selectedExercises, SetSelectedExercises] = useState<string[]>([])
    const [exercises, SetExercises] = useState<IExercise[]>(props.exercises)
    const exerciseInfo = exercises.map((e) => ExerciseData.find(e.exerciseId) as ExerciseInfo);
    const OnCheckbox = (id:string, checked: boolean) => {
        if (checked) {
            SetSelectedExercises([...selectedExercises, id])
        } else {
            SetSelectedExercises(selectedExercises.filter(i => i !== id))
        }
    }
    const OnCreateSupersets = () => {
        if (selectedExercises.length <= 0) {
            return;
        }
        let supersets: string[] = []
        for (let ex of exercises) {
            if (ex.superset && !supersets.includes(ex.superset)) {
                supersets.push(ex.superset)
            }
        }
        let count = supersets.length
        let next = SupersetPallete.next(count);
        let exs = [...exercises]
        selectedExercises.forEach((i) => {
            let index = exs.findIndex(e=>e._id == i);
            if(index != -1){
                exs[index].superset = next;
            }
        })
        
        SetExercises(exs);
        SetSelectedExercises([])
    }
    const OnDone = () => {
        if (props.OnDone) {
            props.OnDone(exercises)
        }
        if (props.OnDismiss) {
            props.OnDismiss()
        }
    }
    return (
        <IonPage>
            <Header>
                <IonTitle>Create Superset</IonTitle>
                <IonButtons slot='end'>
                    <IonButton onClick={OnCreateSupersets} disabled={selectedExercises.length <= 1}>
                        <IonIcon color='primary' icon={link} />
                    </IonButton>
                </IonButtons>
            </Header>
            <IonContent>
                {exerciseInfo.map((ex, i) => {
                    const checked = selectedExercises.some(j => j == exercises[i]._id)
                    const superset = exercises[i].superset
                    return (
                        <ExerciseListItem key={i} onCheckboxValueChange={(c) => OnCheckbox(exercises[i]._id || '', c)} checked={checked} selectionMode={superset === undefined} exercise={ex}>
                            { superset? <SupersetBadge backgroundColor={exercises[i].superset} /> : null}
                        </ExerciseListItem>
                    )
                })}
                <IonFab slot='fixed' vertical='bottom' horizontal='end'>
                    <IonFabButton onClick={OnDone}>
                        <IonIcon icon={checkmark} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    )
}

function SupersetBadge(props: CSSProperties) {
    return (
        <div slot='end' style={{ height: '100%', width: 10, ...props }} />
    )
}