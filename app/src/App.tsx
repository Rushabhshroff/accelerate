import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, useIonModal } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ExerciseDetailsPage, Home } from './pages';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/fonts.css'
import './theme/main.scss'
import { useEffect } from 'react';
import { SetStatusBarStyle, WorkoutController } from './utils';
import { CSS } from './utils/css';
import { StatusBarStyle } from '@capacitor/core';
import firebase from 'firebase/app'
import firebaseConfig from './configs/firebase.config.json'
import { Timer } from './components/core/Timer';
import Duration from './utils/duration';
import { ExerciseList } from './components';
if (firebase.apps.length <= 0) {
  firebase.initializeApp(firebaseConfig)
}
const App: React.FC = () => {
  useEffect(() => {
    SetStatusBarStyle({ backgroundColor: CSS.variable('--ion-color-background') || '#ffffff', barStyle: StatusBarStyle.Dark })
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet animated={true}>
          <Route path="/home" render={(props) => <Home {...props} />} />
          <Route path='/exercises' exact render={()=><ExerciseList />} />
          <Route exact path='/exercise/:id' render={(props) => <ExerciseDetailsPage {...props} />} />
          <Route exact path="/" render={(props) => <Redirect to='/home' />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
