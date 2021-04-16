import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, isPlatform, useIonAlert, useIonModal, useIonRouter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ExerciseDetailsPage, Home, RoutineEditPage, WorkoutEditPage } from './pages';

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
import { AppSettings, WorkoutController } from './utils';
import { ExerciseList, RegisterPage, LoginPage, ForgotPasswordPage, Settings, CreateExercise, WorkoutPreferences, EditWorkout } from './components';
import { WorkoutDetailsPage, WorkoutRoutinesPage } from './pages';

import { ExerciseData, init_database, Workout } from './database';
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
import { Plugins } from '@capacitor/core'
import { URLUtils } from './utils/url-utils';
import { IAPProduct, InAppPurchase2 as Store } from '@ionic-native/in-app-purchase-2'
import { ResetPasswordPage } from './components/auth/reset-password';
const App: React.FC = () => {
  const [Alert] = useIonAlert()
  useEffect(() => {
    const OnBackButton = () => {
      if (window.history.length <= 1) {
        Alert('Do you want to exit App?', [{ text: 'Cancel' }, {
          text: "Exit App", handler: () => {
            Plugins.App.exitApp()
          }
        }])
      }
    }
    const OnProductPurchased = (p: IAPProduct) => {
      Alert("Congratulation! Unlocked Accelerate Plus.", [{ text: 'Close' }])
    }
    Plugins.App.addListener('backButton', OnBackButton)
    if (isPlatform('capacitor')) {
      Store.when('product').owned(OnProductPurchased)
    }
    InitializeApp()
    return () => {
      Plugins.App.removeAllListeners()
      Store.off(OnProductPurchased);
    }
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
          <AuthRoute exact path='/reset-password' render={(props) => <ResetPasswordPage />} />
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
          <ProtectedRoute exact path='/exercise/details/:id' render={(props) => <ExerciseDetailsPage {...props} />} />
          <ProtectedRoute exact path='/workout/create' render={(props) => <EditWorkout liveMode={false} workout={new Workout({ name: "Workout", startTimestamp: Number(URLUtils.current.queryParams.get('date')) || Date.now() })} exercises={[]} />} />
          <ProtectedRoute exact path='/workout/current' render={(props) => <EditWorkout liveMode={true} workout={WorkoutController.active} exercises={WorkoutController.exercises} />} />
          <ProtectedRoute exact path='/workout/edit/:id' render={(props) => <WorkoutEditPage {...props} />} />
          <ProtectedRoute exact path='/workout/details/:id' render={(props) => <WorkoutDetailsPage {...props} />} />
          <ProtectedRoute exact path='/routine/create' render={(props) => <EditWorkout liveMode={false} workout={new Workout({ name: "Routine", startTimestamp: 0 })} exercises={[]} templateMode={true} />} />
          <ProtectedRoute exact path='/routine/edit/:id' render={(props) => <RoutineEditPage {...props} />} />
          <ProtectedRoute exact path='/routine/details/:id' render={(props) => <WorkoutRoutinesPage {...props} />} />
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

/*'https://api.accelerate.fitness'*/

