import { Redirect } from 'react-router';
import { useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/types'

interface StateCheckingConfig {
  redirect: string;
  selector: (state: RootState) => boolean;
}

const StateCheckingRoute = (config: StateCheckingConfig) => (Component: React.ComponentType) => {
  const Internal: React.ComponentType = () => {
    const enablePath = useAppSelector(config.selector)
    return enablePath ? <Component /> : <Redirect to={config.redirect} />
  }
  return Internal
}

export const UserIsLoggedIn = StateCheckingRoute({
  redirect: '/login',
  selector: state => !!state.session.token,
})

export const UserIsNotLoggedIn = StateCheckingRoute({
  redirect: '/',
  selector: state => !state.session.token,
})
