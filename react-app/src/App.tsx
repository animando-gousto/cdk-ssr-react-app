import { Route, Switch } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import { WithBase } from './components/Base'
import { UserIsLoggedIn } from './components/auth/routeWrappers';
import Users from './pages/Users'
import Home from './pages/Home'

const NotFound = () => <>Not Found</>

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={WithBase(LoginForm)} />
      <Route path="/" exact component={WithBase(Home)} />
      <Route path="/users" component={UserIsLoggedIn(WithBase(Users))} />
      <Route component={WithBase(NotFound)} />
    </Switch>
  )
}

export default App
