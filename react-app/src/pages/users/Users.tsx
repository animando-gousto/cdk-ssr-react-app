import * as React from 'react'
import { useSelector } from 'react-redux'
import { getUsers, usersAreLoaded } from '../../store/users';

const Users = () => {
  const users = useSelector(getUsers);
  const usersLoaded = useSelector(usersAreLoaded);
  console.log({users})
  React.useEffect(() => {
    if (!usersLoaded) {
      console.log('load users');
    }
  }, [usersLoaded])
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
