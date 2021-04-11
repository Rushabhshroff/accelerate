import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

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
import './theme/app.scss'
import { PrivacyPolicy } from './pages/privacy-policy';
import { TermsAndConditions } from './pages/terms-and-conditions';
const App: React.FC = () => (

  <BrowserRouter>
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/legal/privacy_policy'>
        <PrivacyPolicy />
      </Route>
      <Route exact path='/legal/terms_and_conditions'>
        <TermsAndConditions />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
