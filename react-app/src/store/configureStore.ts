import { applyMiddleware, compose, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import rootReducer from './rootReducer';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

const persistConfig = {
  key: 'root',
  storage,
}

const configureStore = (preloadedState: any) => {
  const sagaMiddleware = createSagaMiddleware()
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

  const middlewares = [thunkMiddleware, sagaMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer/*, monitorReducersEnhancer*/]
  const composedEnhancers = composeEnhancers(...enhancers)

  const store = createStore(persistedReducer, preloadedState, composedEnhancers)
  let persistor = persistStore(store)
  sagaMiddleware.run(rootSaga)

  return {store, persistor}
}

export default configureStore;
