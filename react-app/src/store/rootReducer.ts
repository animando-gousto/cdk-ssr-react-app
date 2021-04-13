import { combineReducers } from 'redux'
import { usersReducer } from './users'
import { configReducer } from './config'
import httpReducer from './http'
import sessionReducer from './session/state'

const rootReducer = combineReducers({
  users: usersReducer,
  config: configReducer,
  session: sessionReducer,
  http: httpReducer,
})

export default rootReducer
