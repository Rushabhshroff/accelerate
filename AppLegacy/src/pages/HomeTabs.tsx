import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { barbell, clipboard } from 'ionicons/icons'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { MeasuresTab } from './Measure/MeasuresTab'
import Workout from './Main'
interface HomeTabProps {

}
export const HomeTabs: React.FC<HomeTabProps> = (props) => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path='/main/workout'>
                    <Workout />
                </Route>
                <Route exact path='/main/measures'>
                    <MeasuresTab />
                </Route>
                <Route exact path='/main'>
                    <Redirect to='/main/workout' />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot='bottom'>
                <IonTabButton href='/main/workout' tab='workout'>
                    <IonIcon icon={barbell} />
                    <IonLabel>Workout</IonLabel>
                </IonTabButton>
                <IonTabButton href='/main/measures' tab='logs'>
                    <IonIcon icon={clipboard} />
                    <IonLabel>Measures</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}