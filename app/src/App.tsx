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
import { AppSettings, SetStatusBarStyle, Unit, WorkoutController } from './utils';
import { CSS } from './utils/css';
import { StatusBarStyle } from '@capacitor/core';
import { ExerciseList, RegisterPage, LoginPage, ForgotPasswordPage, Settings, CreateExercise, WorkoutPreferences } from './components';
import { WorkoutDetailsPage, WorkoutRoutinesPage } from './pages';

import { ExerciseData, init_database } from './database';
import { SubscriptionCompare } from './components/subscription';
import { ManageSubscriptionPage } from './components/subscription/subscription-manage';
import { UnitsPreferences } from './components/settings/units-preferences';
import { ThemePreferences } from './components/settings/theme-preferences';
import { AppTheme } from './utils/app-theme';
import { ExportData } from './components/settings/export-data';
import { BodyMeasuresPage } from './pages/body-measures';
const App: React.FC = () => {
  useEffect(() => {
    InitializeApp()
  }, [])
  useEffect(() => {
    SetStatusBarStyle({ backgroundColor: CSS.variable('--ion-background-color') || '#ffffff', barStyle: StatusBarStyle.Dark })
  }, [AppSettings.current.theme.mode])
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet animated={true}>
          <Route exact path='/login' render={(props) => <LoginPage />} />
          <Route exact path='/register' render={(props) => <RegisterPage />} />
          <Route exact path='/forgot-password' render={(props) => <ForgotPasswordPage />} />
          <Route path="/home" render={(props) => <Home {...props} />} />
          <Route path='/exercises' exact render={() => <ExerciseList />} />
          <Route exact path='/settings' render={() => <Settings />} />
          <Route exact path='/settings/workout' render={() => <WorkoutPreferences />} />
          <Route exact path='/settings/units' render={() => <UnitsPreferences />} />
          <Route exact path='/settings/theme' render={() => <ThemePreferences />} />
          <Route exact path='/export-data' render={() => <ExportData />} />
          <Route exact path='/subscription' render={() => <SubscriptionCompare />} />
          <Route exact path='/subscription/manage' render={() => <ManageSubscriptionPage />} />
          <Route exact path='/exercise/:id' render={(props) => <ExerciseDetailsPage {...props} />} />
          <Route exact path='/workout/:id' render={(props) => <WorkoutDetailsPage {...props} />} />
          <Route exact path='/routine/:id' render={(props) => <WorkoutRoutinesPage {...props} />} />
          <Route exact path='/body-measures' render={() => <BodyMeasuresPage />} />
          <Route exact path='/create-exercise' render={(props) => <CreateExercise />} />
          <Route exact path="/" render={(props) => <Redirect to='/home' />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;

export async function InitializeApp() {
  await init_database()
  await ExerciseData.Load()
  await AppSettings.Load()
  await AppTheme.Load()
}



