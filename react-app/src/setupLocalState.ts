import { AppDispatch } from './store/types';
import { setConfig } from './store/config';

const setupLocalState = (dispatch: AppDispatch) => {
  dispatch(setConfig({
    apiEndpoint: process.env.REACT_APP_API_ENDPOINT!,
  }))
}

export default setupLocalState
