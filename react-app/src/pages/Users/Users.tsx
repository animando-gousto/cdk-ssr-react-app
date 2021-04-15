import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers as getUsersSelector, usersAreLoaded } from '../../store/users';

import { getUsers } from '../../store/sagas/http/httpSaga'
import { useHistory, useLocation } from 'react-router';
import UserForm from './UserForm';

type Users = ReturnType<typeof getUsersSelector>

interface UsersViewProps {
  users: Users,
  onLoadUsers: () => Promise<any>,
  onClickAddNewUser: () => void,
  showNew: boolean,
}
export const UsersView = ({users, onLoadUsers, onClickAddNewUser, showNew }: UsersViewProps) => (
  <div>
    <h4>Users</h4>
    {users.map(({username, firstName}) => (
      <p key={username}>{firstName}</p>
    ))}
    {showNew && <UserForm />}
    <button onClick={onLoadUsers}>Refresh</button>
    <button onClick={onClickAddNewUser}>Add new</button>
  </div>
)

const UsersPage = () => {
  const users = useSelector(getUsersSelector);
  const usersLoaded = useSelector(usersAreLoaded);
  const dispatch = useDispatch();
  const onLoadUsers = React.useCallback(async () => {
    dispatch(getUsers({queries: {/* q: 'Graham' */}}))
  }, [dispatch])
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    if (!usersLoaded) {
      onLoadUsers()
    }
  }, [onLoadUsers, usersLoaded])

  const onClickAddNewUser = React.useCallback(() => {
    history.push('/users/new')
  }, [history])

  return (
    <UsersView users={users} onLoadUsers={onLoadUsers} onClickAddNewUser={onClickAddNewUser} showNew={location.pathname === '/users/new'}/>
  )
}

export default UsersPage
