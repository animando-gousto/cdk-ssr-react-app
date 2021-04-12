import { combineReducers } from 'redux'
import { usersReducer } from './users'
import { configReducer } from './config'
import sessionReducer from './session/state'

const rootReducer = combineReducers({
  users: usersReducer,
  config: configReducer,
  session: sessionReducer,
})

export default rootReducer
