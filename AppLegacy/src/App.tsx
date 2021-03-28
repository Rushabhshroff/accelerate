import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Main';

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
import './theme/app.scss';
import WorkoutModal from './pages/WorkoutPage';
import ExerciseSelectModal from './modals/ExercisesSelectModal';
import AlertBox from './modals/Alert';
import { useEffect } from 'react';
import { InitDatabase } from './Database';
import PickerBox from './components/Picker';
import SettingsPage from './pages/Settings';
import { InitSettings } from './pages/Settings/hook';
import RestTimerModal from './pages/RestTimer';
import WorkoutTemplatePage from './pages/WorkoutTemplate';
import WorkoutInfoPage from './pages/WorkoutInfoPage'
import Toast from './modals/Toast';
import Loader from './modals/Loader';
import EditWorkoutPage from './pages/WorkoutPage/EditWorkoutPage';
import ExerciseList from './components/Exercise/ExerciseList';
import WorkoutTemplateInfoPage from './pages/Wokout/WorkoutTemplateInfoPage';
import ExerciseInfoTabs from './pages/Exercise/ExerciseInfoTabs';
import ExerciseInfoModal from './modals/ExerciseInfoModal';
import Exercise from './data/models/Exercise';
import { Plugins, StatusBarStyle } from '@capacitor/core'
import { getVar, ThemeColor } from './utils';
import { HomeTabs } from './pages/HomeTabs';
import { MeasuresPage } from './pages/Measure/MeasuresPage';
Plugins.SplashScreen.show();
const App: React.FC = () => {
  useEffect(() => {
    InitializedApp()
    Plugins.StatusBar.setBackgroundColor({ color: getVar('--ion-background-color') || '#ffffff' })
    Plugins.StatusBar.setStyle({ style: StatusBarStyle.Light })
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/main">
            <HomeTabs />
          </Route>
          <Route exact path='/workout-page'>
            <WorkoutModal />
          </Route>
          <Route exact path='/workout/:id' render={(props) => <WorkoutInfoPage {...props} />} />
          <Route exact path='/workout'>
            <Redirect to='/main' />
          </Route>
          <Route exact path='/workout/edit/:id' render={(props) => <EditWorkoutPage {...props} />} />
          <Route exact path='/workout/edit'>
            <Redirect to='/main' />
          </Route>
          <Route exact path='/measures/:id' render={(props) => <MeasuresPage {...props} />} />
          <Route exact path='/create-workout-template' render={(props) => <WorkoutTemplatePage {...props} />} />
          <Route exact path='/wokout-template/:id' render={(props) => <WorkoutTemplateInfoPage {...props} />} />
          <Route exact path='/workout-template/edit/:id' render={(props) => <WorkoutTemplatePage {...props} />} />
          <Route exact path='/exercise-list'>
            <ExerciseList asModal={false} />
          </Route>
          <Route path='/exercise-info/:id' render={(props) => <ExerciseInfoTabs {...props} />} />
          <Route exact path='/settings'>
            <SettingsPage />
          </Route>
          <Route exact path='/'>
            <Redirect to='/main' />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <ExerciseInfoModal ref={ref => ExerciseInfoModal.ref = ref} />
      <ExerciseSelectModal ref={(ref) => ExerciseSelectModal.ref = ref} />
      <RestTimerModal ref={(ref) => RestTimerModal.ref = ref} />
      <PickerBox ref={ref => PickerBox.ref = ref} />
      <AlertBox ref={ref => AlertBox.ref = ref} />
      <Toast ref={ref => Toast.ref = ref} />
      <Loader ref={ref => Loader.ref = ref} />
    </IonApp>

  )
};

export default App;

async function InitializedApp() {
  await InitDatabase();
  await InitSettings();
  await Exercise.LoadAll()
  Plugins.SplashScreen.hide()
}