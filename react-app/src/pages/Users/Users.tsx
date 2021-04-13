import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers as getUsersSelector, usersAreLoaded } from '../../store/users';

import {httpActionCreators} from '../../store/sagas/httpSaga'

const { getUsers } = httpActionCreators

type Users = ReturnType<typeof getUsersSelector>

interface UsersViewProps {
  users: Users,
  onLoadUsers: () => Promise<any>,
}
export const UsersView = ({users, onLoadUsers}: UsersViewProps) => (
  <div>
    <h4>Users</h4>
    {users.map(({id, firstName}) => (
      <p key={id}>{firstName}</p>
    ))}
    <button onClick={onLoadUsers}>Refresh</button>
  </div>
)

const UsersPage = () => {
  const users = useSelector(getUsersSelector);
  const usersLoaded = useSelector(usersAreLoaded);
  const dispatch = useDispatch();
  const onLoadUsers = React.useCallback(async () => {
    // dispatch(loadUsers())
    dispatch(getUsers('payload'))
  }, [dispatch])

  React.useEffect(() => {
    if (!usersLoaded) {
      onLoadUsers()
    }
  }, [onLoadUsers, usersLoaded])

  return (
    <UsersView users={users} onLoadUsers={onLoadUsers} />
  )
}

export default UsersPage
