import { IonIcon, IonLabel, IonModal, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import { ProfileTab, WorkoutTab, MeasuresTab } from './workout-tabs'
import { calendar, clipboard, personCircle, } from 'ionicons/icons'

interface HomeProps extends RouteComponentProps {

}
export const Home: React.FC<HomeProps> = (props) => {
  const { match } = props;
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path={`${match.url}/workouts`} render={(props) => <WorkoutTab {...props} />} />
        {/*<Route exact path={`${match.url}/measures`} render={(props) => <MeasuresTab {...props} />} />*/}
        <Route exact path={`${match.url}/profile`} render={(props) => <ProfileTab {...props} />} />
        <Route exact path={`${match.url}`} render={(props) => <Redirect to={`${match.url}/workouts`} />} />
      </IonRouterOutlet>
      <IonTabBar onIonTabsDidChange={(e) => { }} slot='bottom'>
        <IonTabButton tab='workouts' href={`${match.url}/workouts`}>
          <IonIcon icon={calendar} />
          <IonLabel>Workout</IonLabel>
        </IonTabButton>
        {/*<IonTabButton tab='measures' href={`${match.url}/measures`}>
          <IonIcon icon={clipboard} />
          <IonLabel>Measures</IonLabel>
  </IonTabButton>*/}
        <IonTabButton tab='profile' href={`${match.url}/profile`}>
          <IonIcon icon={personCircle} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};


