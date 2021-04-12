import * as React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import { WithBase } from './components/Base'
import { UserIsNotLoggedIn } from './components/auth/routeWrappers';
import { UserIsLoggedIn } from './components/auth/routeWrappers';
import Users from './pages/users'
import Home from './pages/Home'

const NotFound = () => <>Not Found</>

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={UserIsNotLoggedIn(WithBase(LoginForm))} />
        <Route path="/" exact component={WithBase(Home)} />
        <Route path="/users" component={UserIsLoggedIn(WithBase(Users))} />
        <Route component={WithBase(NotFound)} />
      </Switch>
    </Router>
  )
}

export default App
