import { useIonRouter } from '@ionic/react';
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router';
import Loading from '../../components/Loading';
import WorkoutTemplateInfo from '../../components/Workout/WorkoutTemplateInfo'
import WorkoutTemplate from '../../data/models/WorkoutTemplate'

interface WorkoutTemaplteInfoPageProps extends RouteComponentProps<{ id: string }> {

}

const WorkoutTemplateInfoPage: React.FC<WorkoutTemaplteInfoPageProps> = (props) => {
    const [template, SetTemplate] = useState<WorkoutTemplate | undefined>(undefined);
    const router = useIonRouter()
    useEffect(() => {
        (async () => {
            try {
                let temp = await WorkoutTemplate.findById(props.match.params.id);
                if (temp) {
                    SetTemplate(new WorkoutTemplate(temp));
                }
            } catch (err) {
                router.goBack();
            }
        })()

    }, [])
    if (!template) {
        return <Loading />
    }
    return (
        <>
            <WorkoutTemplateInfo OnDeleted={() => {
                router.goBack()
            }} OnStartExercise={() => {
                router.push('/workout-page')
            }} template={template} />
            
        </>
    )
}

export default WorkoutTemplateInfoPage