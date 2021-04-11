import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle,  IonContent, IonIcon, IonItem, IonLabel,  IonText, useIonRouter } from '@ionic/react'
import React, { useEffect, useReducer, useState } from 'react'
import { add, play, } from 'ionicons/icons'
import "./Workout.scss"
import WorkoutTemplate from '../../data/models/WorkoutTemplate'
import useWorkout from '../../hooks/useWorkout'
import AlertBox from '../../modals/Alert'
import WorkoutManager from '../../utils/WorkoutManager'
import { useLocation } from 'react-router'





interface WorkoutSegmentProps {
    visible?: boolean,
}
const SectionHeader: React.FC<{ title: string }> = (prps) => {
    return (
        <IonItem lines='none'>
            <IonText style={{ fontSize: '12px' }}>{prps.title}</IonText>
            {prps.children}
        </IonItem>
    )
}
export default function WorkoutSegment(props: WorkoutSegmentProps) {
    const { workout, SetWorkout } = useWorkout();
    const [templates, SetTemplates] = useState<WorkoutTemplate[]>([])
    const router = useIonRouter()
    const { pathname } = useLocation()
    var mounted = false;
    
    const StartWorkout = () => {
        if (workout) {
            AlertBox.Show('Workout in progress', 'You are currently performing a workout. Would you like to discard it?',
                [
                    {
                        text: 'CANCEL',
                        type: 'cancel,'
                    },
                    {
                        text: 'YES, DISCARD',
                        handler: () => {
                            WorkoutManager.cancel()
                            WorkoutManager.start()
                            router.push('/workout-page', 'forward')
                        }
                    }
                ]
            )
        } else {
            WorkoutManager.start();
            router.push('/workout-page')
        }
    }
    const OnDeleteTemplate = (template: WorkoutTemplate) => {
        AlertBox.Show('Delete Template?', "Are you sure you want to delete this template?", [
            {
                text: 'Cancel',
                type: 'cancel'
            }, {
                text: 'Yes Delete',
                handler: async () => {
                    let new_templs = templates.filter((t) => t._id !== template._id);
                    await template.delete()
                    SetTemplates(new_templs);
                }
            }
        ])
    }
    const OnDuplicateTemplate = (template: WorkoutTemplate) => {
        AlertBox.Show('Duplicate Template', 'Enter name for the template', [
            { type: 'cancel', text: 'Cancel' }, {
                text: 'Duplicate', handler: async (data: any) => {
                    let temp = template.Duplicate(data.name);
                    let x = [...templates, temp];
                    SetTemplates(x);
                    await temp.save()
                }
            }
        ], [
            { name: "name", type: 'text', value: template.name }
        ])
    }
    useEffect(() => {
        mounted = true
        WorkoutTemplate.getAll().then((res) => {
            if (mounted) {
                SetTemplates(res.docs.map((d) => new WorkoutTemplate(d)))
            }
        })
        return () => {
            mounted = false;
        }
    }, [pathname])
    return (
        <>
            <IonContent style={{ display: props.visible ? 'block' : 'none' }}>
                <SectionHeader title='Quick Start' />
                <div style={{ margin: '10px 0' }} className='centering-box'>
                    <IonButton onClick={StartWorkout}>
                        <IonIcon style={{ margin: '0 10px' }} icon={play} />
                        <IonLabel>Start an empty workout</IonLabel>
                    </IonButton>
                </div>
                <SectionHeader title='Workout Templates' >
                    <IonButtons slot='end'>
                        <IonButton onClick={() => {
                            router.push('/create-workout-template')
                        }
                        }>
                            <IonIcon icon={add} />
                        </IonButton>
                    </IonButtons>
                </SectionHeader>
                {templates.length <= 0 ? <IonItem lines='none'>
                    <IonText style={{ fontSize: '14px', textAlign: 'center', width: '100%' }}>
                        You do not have any custom templates yet.
                        <br />
                        Tap the '+' to create your first template.
                    </IonText>
                </IonItem> : <>
                    {templates.map((t) => {
                        return <WorkoutTemplateItem
                            OnDuplicate={() => OnDuplicateTemplate(t)}
                            OnDelete={() => OnDeleteTemplate(t)}
                            key={t._id}
                            template={t}
                        />
                    })}
                </>
                }


            </IonContent>
        </>
    )
}


interface WorkoutTemplateItemProps {
    template: WorkoutTemplate,
    OnDelete: () => void,
    OnDuplicate: () => void
}
function WorkoutTemplateItem(props: WorkoutTemplateItemProps) {
    let template_org = props.template
    const WorkoutTemplateReducer = (state: WorkoutTemplate, action: Partial<WorkoutTemplate>) => {
        Object.assign(template_org, action);
        return new WorkoutTemplate({
            ...state,
            ...action
        })
    }
    const [template, UpdateTemplate] = useReducer(WorkoutTemplateReducer, props.template);
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
    return (
        <IonCard routerLink={`/wokout-template/${template._id}`} button className='card'>
            <IonItem lines='none'>
                <IonCardTitle>{props.template.name}</IonCardTitle>
                {/*<IonButtons slot='end'>
                    <PopoverButton>
                        <PopoverItem routerLink={`/workout-template/edit/${template._id}`}>Edit</PopoverItem>
                        <PopoverItem onClick={OnRename}>Rename</PopoverItem>
                        <PopoverItem>Share</PopoverItem>
                        <PopoverItem onClick={props.OnDuplicate}>Duplicate</PopoverItem>
                        <PopoverItem onClick={props.OnDelete}>Delete</PopoverItem>
                    </PopoverButton>
    </IonButtons>*/}
            </IonItem>
            <IonCardContent style={{ display: 'flex', flexDirection: 'column' }}>
                {template.exercises.map((ex, i) => {
                    return (
                        <IonText key={i}>{ex.sets.length} x {ex.exerciseName}</IonText>
                    )
                })}
            </IonCardContent>
        </IonCard>
    )
}

