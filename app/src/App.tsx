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
import { Api } from './api'
import { AuthRoute } from './components/routes/auth-route';
import { ProtectedRoute } from './components/routes';
import { EditProfilePage } from './pages/auth';
import { InAppPurchase } from './utils/in-app-purchase';
import { Website } from './components/website';
const App: React.FC = () => {
  useEffect(() => {
    InitializeApp()
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet animated={true}>
          <Route exact path='/privacy_policy' render={(props) => <Website url='/legal/privacy_policy' />} />
          <Route exact path='/terms_and_conditions' render={(props) => <Website url='/legal/terms_and_conditions' />} />
          <AuthRoute exact path='/login' render={(props) => <LoginPage />} />
          <AuthRoute exact path='/register' render={(props) => <RegisterPage />} />
          <AuthRoute exact path='/forgot-password' render={(props) => <ForgotPasswordPage />} />
          <ProtectedRoute path="/home" render={(props) => <Home {...props} />} />
          <ProtectedRoute path='/exercises' exact render={() => <ExerciseList />} />
          <ProtectedRoute path='/edit-profile' exact render={() => <EditProfilePage />} />
          <ProtectedRoute exact path='/settings' render={() => <Settings />} />
          <ProtectedRoute exact path='/settings/workout' render={() => <WorkoutPreferences />} />
          <ProtectedRoute exact path='/settings/units' render={() => <UnitsPreferences />} />
          <ProtectedRoute exact path='/settings/theme' render={() => <ThemePreferences />} />
          <ProtectedRoute exact path='/export-data' render={() => <ExportData />} />
          <ProtectedRoute exact path='/subscription' render={() => <SubscriptionCompare />} />
          <ProtectedRoute exact path='/subscription/manage' render={() => <ManageSubscriptionPage />} />
          <ProtectedRoute exact path='/exercise/:id' render={(props) => <ExerciseDetailsPage {...props} />} />
          <ProtectedRoute exact path='/workout/:id' render={(props) => <WorkoutDetailsPage {...props} />} />
          <ProtectedRoute exact path='/routine/:id' render={(props) => <WorkoutRoutinesPage {...props} />} />
          <ProtectedRoute exact path='/body-measures' render={() => <BodyMeasuresPage />} />
          <ProtectedRoute exact path='/create-exercise' render={(props) => <CreateExercise />} />
          <ProtectedRoute exact path="/" render={(props) => <Redirect to='/login' />} />
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
  await Api.init('https://api.accelerate.fitness')
  InAppPurchase.initialize()
}



