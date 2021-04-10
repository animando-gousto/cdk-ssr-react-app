import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, usersAreLoaded, loadUsers } from '../../store/users';

const Users = () => {
  const users = useSelector(getUsers);
  const usersLoaded = useSelector(usersAreLoaded);
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!usersLoaded) {
      dispatch(loadUsers())
    }
  }, [dispatch, usersLoaded])

  return (
    <div>
      <h4>Users</h4>
      {users.map(({id, firstName}) => (
        <p key={id}>{firstName}</p>
      ))}
    </div>
  )
}

export default Users
