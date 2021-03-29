import React from 'react';
import Menu from './menu/menu';
import Header from './header/header';
import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/home';
import { GamePage } from './pages/game';

export function App() {
  return (
    <main className='main'>
      <Switch>
        <Route exact path='/'>
          <HomePage />
        </Route>
        <Route path='/game/:gameId'>
          <GamePage />
        </Route>
      </Switch>
    </main>
  );
}

export default App;
