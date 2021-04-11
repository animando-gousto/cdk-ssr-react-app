import { createStore } from 'redux'
import rootReducer from '../src/store/rootReducer'
import { loadedUsers } from '../src/store/users'

const configureStore = () => {

  const store = createStore(rootReducer);

  store.dispatch(loadedUsers({'1': {id: '1', firstName: 'Graham', surname: 'King'}}))

  return store
}

export default configureStore;
