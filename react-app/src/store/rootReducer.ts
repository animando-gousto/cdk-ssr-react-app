import { combineReducers } from 'redux'
import { usersReducer } from './users'
import { configReducer } from './config'

const rootReducer = combineReducers({
  users: usersReducer,
  config: configReducer,
})

export default rootReducer
