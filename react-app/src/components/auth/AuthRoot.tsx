import * as React from 'react'
import authContext from './authContext'
import { useAppSelector } from '../../store/hooks'
import { userSelector } from '../../store/session/state'

const useProvideAuth = () => {
  const user = useAppSelector(userSelector);

  return {
    user,
  }
}

type Props = {
  children: React.ReactNode;
}
const AuthRoot = ({ children }: Props) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export default AuthRoot
