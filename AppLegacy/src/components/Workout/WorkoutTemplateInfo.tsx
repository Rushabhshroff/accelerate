import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonItemDivider, IonLabel, IonPage, IonText, IonTitle, isPlatform } from '@ionic/react'
import { informationCircle, shareOutline, shareSocial } from 'ionicons/icons'
import React, { useEffect, useReducer } from 'react'
import { IWorkoutExercise, Workout } from '../../data/models/Workout'
import ExerciseItemThumbnail from '../Exercise/ExerciseItemThumb'
import Header from '../Header'
import PopoverButton, { PopoverItem } from '../PopoverButton'
import {  ExerciseData, IExercise } from '../../data/models/Exercise'
import WorkoutTemplate from '../../data/models/WorkoutTemplate'
import AlertBox from '../../modals/Alert'
import Toast from '../../modals/Toast'
import WorkoutManager from '../../utils/WorkoutManager'
import ExerciseInfoModal from '../../modals/ExerciseInfoModal'
interface WorkoutTemplateInfoProps {
    template: WorkoutTemplate,
    OnDeleted?: () => void,
    OnStartExercise?: () => void
}

const WorkoutTemplateInfo: React.FC<WorkoutTemplateInfoProps> = (props) => {
    let template_org = props.template
    const WorkoutTemplateReducer = (state: WorkoutTemplate, action: Partial<WorkoutTemplate>) => {
        Object.assign(template_org, action);
        return new WorkoutTemplate({
            ...state,
            ...action
        })
    }
    const [template, UpdateTemplate] = useReducer(WorkoutTemplateReducer, template_org)
    useEffect(() => {
        UpdateTemplate(props.template);
    }, [props.template])
    const OnRename = () => {
        AlertBox.Show('Change Exercise Name', "Enter new name for the workout below", [
            {
                text: 'Cancel',
                type: 'cancel'
            }, {
                text: 'Update',
                handler: async (data: any) => {
                    if (data.name && data.name.length > 0) {
                        UpdateTemplate({ name: data.name })
                        await template.save()
                    }
                }
            }
        ],
            [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Enter name',
                    value: template.name,
                    label: 'Exercise Name'
                }
            ])
    }
    const OnDeleteTemplate = () => {
        AlertBox.Show('Delete Template?', "Are you sure you want to delete this template?", [
            {
                text: 'Cancel',
                type: 'cancel'
            }, {
                text: 'Yes Delete',
                handler: async () => {
                    await template.delete();
                    if (props.OnDeleted) {
                        props.OnDeleted()
                    }
                }
            }
        ])
    }
    const OnDuplicateTemplate = () => {
        AlertBox.Show('Duplicate Template', 'Enter name for the template', [
            { type: 'cancel', text: 'Cancel' }, {
                text: 'Duplicate', handler: async (data: any) => {
                    let temp = template.Duplicate(data.name);
                    await temp.save()
                    Toast.Show(`Template ${temp.name} created!`)
                }
            }
        ], [
            { name: "name", type: 'text', value: template.name }
        ])
    }
    const OnStartExercise = () => {
        if (WorkoutManager.workout) {
            AlertBox.Show('Workout in Progress', "There is workout in progress. Do you want to cancel it?", [
                { type: 'cancel', text: 'Cancel' },
                {
                    text: 'Yes, Discard', handler: () => {
                        WorkoutManager.cancel();
                        WorkoutManager.startFrom(Workout.fromTemplate(template), template.exercises);
                        if (props.OnStartExercise) {
                            props.OnStartExercise()
                        }
                    }
                }
            ])
        } else {
            WorkoutManager.startFrom(Workout.fromTemplate(template), template.exercises);
            if (props.OnStartExercise) {
                props.OnStartExercise()
            }
        }
    }

    return (
        <IonPage>
            <Header backButton noborder>
                <IonButtons slot='end'>
                    <IonButton>
                        <IonIcon icon={isPlatform('ios') ? shareOutline : shareSocial} />
                    </IonButton>
                    <PopoverButton>
                        <PopoverItem routerLink={`/workout-template/edit/${template._id}`} >Edit</PopoverItem>
                        <PopoverItem onClick={OnRename} >Rename</PopoverItem>
                        <PopoverItem onClick={OnDuplicateTemplate}>Duplicate</PopoverItem>
                        <PopoverItem onClick={OnDeleteTemplate}>Delete</PopoverItem>
                    </PopoverButton>

                </IonButtons>
                <IonTitle>{template.name}</IonTitle>
            </Header>
            <IonContent>
                {template.exercises.map((ex, i) => {
                    return (
                        <ExerciseListItem key={i} exercise={ex} />
                    )
                })}
            </IonContent>
            <div className='centering-box'>
                <hr />
                <IonButton onClick={OnStartExercise} style={{ width: '80%', margin: '10px 0' }} expand='full'>
                    <IonLabel>Start Exercise</IonLabel>
                </IonButton>
            </div>
        </IonPage>
    )
}

export default WorkoutTemplateInfo;

interface ExerciseListItemProps {
    exercise: IWorkoutExercise
}
const ExerciseListItem: React.FC<ExerciseListItemProps> = (props) => {
    const exercise = props.exercise
    const iEx = ExerciseData.map[exercise.exerciseId]
    if (!iEx) {
        return null;
    }
    const OnExerciseInfo = () => {
        ExerciseInfoModal.Show(iEx)
    }
    const noInfo = iEx.mediaType === "" && (!iEx.instructions || iEx.instructions.length <= 0);
    return (
        <IonItem lines='none'>
            <ExerciseItemThumbnail exercise={iEx} />
            <div className='column'>
                <IonText style={{ fontSize: 14 }} className='list-text bold'>{exercise.sets.length} x {exercise.exerciseName}</IonText>
                <IonText className='list-text light-text'>{exercise.bodyPart}</IonText>
            </div>
            {noInfo ? null : <IonButtons slot='end'>
                <IonButton onClick={OnExerciseInfo}>
                    <IonIcon style={{ fontSize: 25 }} icon={informationCircle} />
                </IonButton>
            </IonButtons>}
        </IonItem>
    )
}