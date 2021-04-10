import { applyMiddleware, compose, createStore } from 'redux'
// import thunkMiddleware from 'redux-thunk'

// import monitorReducersEnhancer from './enhancers/monitorReducers'
// import loggerMiddleware from './middleware/logger'
import rootReducer from '../src/store/rootReducer'
import { loadedUsers } from '../src/store/users'

const configureStore = (/*preloadedState*/) => {
  // const middlewares = [/*loggerMiddleware, thunkMiddleware*/]
  // const middlewareEnhancer = applyMiddleware(...middlewares)

  // const enhancers = [middlewareEnhancer, /*monitorReducersEnhancer*/]
  // const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer/*, preloadedState, composedEnhancers*/)

  store.dispatch(loadedUsers({'1': {id: '1', firstName: 'Graham', surname: 'King'}}))

  return store
}

export default configureStore;
