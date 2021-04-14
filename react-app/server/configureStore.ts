import { createStore } from 'redux'
import axios from 'axios';
import rootReducer from '../src/store/rootReducer'
import { loadedUsers, User } from '../src/store/users'
import { setConfig } from '../src/store/config';

const configureStore = async () => {

  const store = createStore(rootReducer);

  const { data } = await axios.get<Array<User>>(`https://${process.env.API_ENDPOINT}/users`, {
    headers: {
      'Authorization': process.env.SERVICE_TOKEN,
    },
  })
  store.dispatch(loadedUsers({ response: data }))
  process.env.API_ENDPOINT && store.dispatch(setConfig({ apiEndpoint: process.env.API_ENDPOINT }))

  return store
}

export default configureStore;
