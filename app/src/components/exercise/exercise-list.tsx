import { IonButton, IonButtons, IonCheckbox, IonContent, IonIcon, IonItem, IonPage, IonSearchbar, IonText, IonTitle, useIonModal, useIonRouter } from '@ionic/react'
import { arrowBack, checkmark, filter } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { Header, TouchableOpcity } from '../core'
import { PopoverButton, PopoverItem } from '../core/Popover/popover-button'
import { List } from 'react-virtualized';
import './styles.scss'
import { useDimension } from '../../hooks'
import { ExerciseListItem } from './exercise-list-item'
import { ExerciseData, ExerciseInfo } from '../../database/models/exercise-data'
import { ExerciseFilter } from './exercise-filter'
interface ExerciseListProps {
    onDismiss?: () => void,
    selectionMode?: boolean,
    onSelectionChange?: (exercises: string[]) => void,
    selectionType?: 'single' | 'multiple'
}
export const ExerciseList: React.FC<ExerciseListProps> = (props) => {
    const router = useIonRouter()
    const [exercises, SetExercises] = useState(ExerciseData.dataset)
    const [selectedExercises, SetSelectedExercises] = useState<string[]>([])
    const [bodyparts, SetBodyparts] = useState<string[]>([])
    const [equipments, SetEquipments] = useState<string[]>([])
    const [search,SetSearch] = useState('')
    const { width, height } = useDimension()
    const [ShowFilterModal, HideFilterModal] = useIonModal(() => <ExerciseFilter bodyparts={bodyparts} equipments={equipments} onDismiss={OnDismissFilter} />)
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
    const OnDismissFilter = (data: { bodyparts: string[], equipments: string[] }) => {
        HideFilterModal()
        SetBodyparts(data.bodyparts)
        SetEquipments(data.equipments)
    }
    useEffect(() => {
        let exs = [...ExerciseData.dataset]
        if (bodyparts.length > 0 || equipments.length > 0 || search.length > 0) {
            if (bodyparts.length > 0) {
                exs = exs.filter((e) => bodyparts.includes(e.bodyPart))
            }
            if (equipments.length > 0) {
                exs = exs.filter((e) => equipments.includes(e.equipment))
            }
            if(search.length > 0){
                exs = exs.filter((e)=>e.exerciseName.toLowerCase().includes(search.toLowerCase()))
            }
        }
        SetExercises(exs)
    }, [bodyparts, equipments,search])
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonButton onClick={OnBack} slot='icons-only'>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonSearchbar value={search} onIonChange={e => SetSearch(e.detail.value || '')} placeholder='Enter Exercise Name' style={{ padding: '0 10px' }} mode='ios' />
                <IonButtons slot='end'>
                    <IonButton onClick={() => ShowFilterModal()}>
                        <IonIcon icon={filter} />
                    </IonButton>
                    <PopoverButton>
                        <PopoverItem routerLink={'/create-exercise'} button >Create Exercise</PopoverItem>
                    </PopoverButton>
                </IonButtons>
            </Header>
            <List
                className='virtual-list'
                rowHeight={56}
                rowCount={exercises.length}
                width={width}
                height={height - 50}
                style={{backgroundColor:'var(--ion-background-color, #fff)'}}
                containerStyle={{backgroundColor:'var(--ion-background-color, #fff)'}}
                rowRenderer={({
                    key,
                    index,
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