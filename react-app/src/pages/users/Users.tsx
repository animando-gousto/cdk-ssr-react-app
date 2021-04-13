import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, usersAreLoaded, loadUsers } from '../../store/users';

const Users = () => {
  const users = useSelector(getUsers);
  const usersLoaded = useSelector(usersAreLoaded);
  const dispatch = useDispatch();
  const onLoadUsers = React.useCallback(() => {
    dispatch(loadUsers())
  }, [dispatch])
  React.useEffect(() => {
    if (!usersLoaded) {
      onLoadUsers()
    }
  }, [onLoadUsers, usersLoaded])

  return (
    <div>
      <h4>Users</h4>
      {users.map(({id, firstName}) => (
        <p key={id}>{firstName}</p>
      ))}
      <button onClick={onLoadUsers}>Refresh</button>
    </div>
  )
}

export default Users
