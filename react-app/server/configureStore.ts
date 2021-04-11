import { createStore } from 'redux'
import axios from 'axios';
import rootReducer from '../src/store/rootReducer'
import { loadedUsers, User } from '../src/store/users'
import { setConfig } from '../src/store/config';

const configureStore = async () => {

  const store = createStore(rootReducer);

  console.log(`seed store from endpoint ${process.env.API_ENDPOINT}`)

  const { data } = await axios.get<Array<User>>(`https://${process.env.API_ENDPOINT}/users`)
  const byId = data.reduce<Record<string, User>>((acc, user) => ({
    ...acc,
    [user.id]: user
  }), {})

  store.dispatch(loadedUsers(byId))
  process.env.API_ENDPOINT && store.dispatch(setConfig({ apiEndpoint: process.env.API_ENDPOINT }))

  return store
}

export default configureStore;
