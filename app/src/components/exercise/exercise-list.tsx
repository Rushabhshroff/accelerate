import { IonButton, IonButtons, IonCheckbox, IonContent, IonIcon, IonItem, IonPage, IonSearchbar, IonText, IonTitle, useIonRouter } from '@ionic/react'
import { arrowBack, checkmark, filter } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Header, TouchableOpcity } from '../core'
import { PopoverButton, PopoverItem } from '../core/Popover/popover-button'
import { List } from 'react-virtualized';
import './styles.scss'
import { useDimension } from '../../hooks'
import { DataSet } from '../../database'
import { ExerciseListItem } from './exercise-list-item'
import { ExerciseInfo } from '../../database/models/exercise-data'
interface ExerciseListProps {
    onDismiss?: () => void,
    selectionMode?: boolean,
    onSelectionChange?: (exercises: string[]) => void,
    selectionType?: 'single' | 'multiple'
}
export const ExerciseList: React.FC<ExerciseListProps> = (props) => {
    const router = useIonRouter()
    const [exercises, SetExercises] = useState(DataSet)
    const [selectedExercises, SetSelectedExercises] = useState<string[]>([])
    const { width, height } = useDimension()
    const OnSearch = (query: string) => {
        if (query.trim() == "") {
            SetExercises(DataSet)
        } else {
            SetExercises(DataSet.filter(x => x.exerciseName.toLowerCase().includes(query.toLowerCase())))
        }
    }
    const OnSelect = (checked: boolean, exId: string) => {

        if (checked) {
            let x: string[] = []
            if (props.selectionType === 'multiple') {
                x = [...selectedExercises, exId]
            } else {
                x = [exId]
            }
            SetSelectedExercises(x);
        } else {
            SetSelectedExercises(selectedExercises.filter(f => f !== exId))
        }
    }
    const Checked = (exId: string) => selectedExercises.some(e => e == exId)
    const OnBack = () => {
        if (props.onDismiss) {
            props.onDismiss()
        } else {
            router.goBack()
        }
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={OnBack} slot='icons-only'>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonSearchbar onIonChange={e => OnSearch(e.detail.value || '')} placeholder='Enter Exercise Name' style={{ padding: '0 10px' }} mode='ios' />
                <IonButtons slot='end'>
                    <IonButton>
                        <IonIcon icon={filter} />
                    </IonButton>
                    <PopoverButton>
                        <PopoverItem button >Create Exercise</PopoverItem>
                    </PopoverButton>
                </IonButtons>
            </Header>
            <List
                rowHeight={56}
                rowCount={exercises.length}
                width={width}
                height={height - 50}
                rowRenderer={({
                    key,
                    index,
                    isScrolling,
                    isVisible,
                    style,
                }) => {
                    const ex = exercises[index]
                    return (
                        <ExerciseListItem
                            key={key}
                            style={style}
                            onClick={props.onDismiss}
                            selectionMode={props.selectionMode}
                            checked={Checked(ex._id)}
                            onCheckboxValueChange={(checked) => OnSelect(checked, ex._id)}
                            exercise={ex as ExerciseInfo}
                        />
                    )
                }}
            />
            {props.selectionMode ? <TouchableOpcity onClick={() => {
                if (props.onSelectionChange) {
                    props.onSelectionChange(selectedExercises)
                }
                if (props.onDismiss) {
                    props.onDismiss()
                }
            }} className={`fab${selectedExercises.length > 0 ? ' fab-show' : ''}`}>
                <IonIcon color='light' style={{ width: 30, height: 30 }} size='medium' icon={checkmark} />
            </TouchableOpcity> : null}
        </IonPage>
    )
}

/*
*/