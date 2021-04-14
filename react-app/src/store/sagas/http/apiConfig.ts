import { GetHttpSagaConfig, PostHttpSagaConfig } from './types'
import { loginSuccessful } from '../../session/state'
import { GetUsersSuccessPayload, loadedUsers } from '../../users'
import { LoginSuccessfulPayload } from '../../session/types'

const getUsers: GetHttpSagaConfig<GetUsersSuccessPayload> = {
  path: '/users',
  method: 'GET',
  action: 'users/GET_USERS',
  successAction: loadedUsers,
}

const requestToken: PostHttpSagaConfig<LoginSuccessfulPayload> = {
  path: '/token',
  method: 'POST',
  action: 'session/REQUEST_TOKEN',
  successAction: loginSuccessful,
}

const configs = {
  getUsers,
  requestToken,
}

export default configs
