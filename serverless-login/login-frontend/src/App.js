import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={ Home } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
