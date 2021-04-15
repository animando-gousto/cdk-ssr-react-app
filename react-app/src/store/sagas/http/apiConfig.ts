import { GetHttpSagaConfig, PostHttpSagaConfig } from './types'
import { loginSuccessful } from '../../session/state'
import { GetUsersSuccessPayload, UserAddedSuccessPayload, loadedUsers, userAdded } from '../../users'
import { LoginSuccessfulPayload } from '../../session/types'

const getUsers: GetHttpSagaConfig<GetUsersSuccessPayload> = {
  path: '/users',
  method: 'GET',
  action: 'users/GET_USERS',
  successAction: loadedUsers,
}

const addUser: PostHttpSagaConfig<UserAddedSuccessPayload> = {
  path: '/users',
  method: 'POST',
  action: 'users/ADD_USER',
  successAction: userAdded,
}

const requestToken: PostHttpSagaConfig<LoginSuccessfulPayload> = {
  path: '/token',
  method: 'POST',
  action: 'session/REQUEST_TOKEN',
  successAction: loginSuccessful,
}

const configs = {
  addUser,
  getUsers,
  requestToken,
}

export default configs
