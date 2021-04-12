import configureStore from './configureStore'

const {store} = configureStore(undefined);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
