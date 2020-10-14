import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';
import { ExistingUserLogin } from './components/auth/ExistingUserLogin';
import { NewUserSignup } from './components/auth/NewUserSignup';


function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route exact path='/login' component={ ExistingUserLogin } />
        <Route exact path='/signup' component={ NewUserSignup } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
