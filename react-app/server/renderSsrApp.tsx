import * as React from 'react';
import { Provider } from 'react-redux';
// import axios from 'axios';
import { renderToString } from 'react-dom/server';
import App from '../src/SsrApp'
import configureStore from './configureStore';

const renderSsrApp = async (page: string) => {
  // const apiResponse = await axios.get(process.env.API_ENDPOINT || '')
  // console.log('got apiResponse', apiResponse);
  const store = configureStore();

  const app = renderToString(
    <Provider store={store}>
      <App ssr />
    </Provider>
  );

  const preloadedState = store.getState()

  return page.replace('<div id="root"></div>', `
  <div id="root">${app}</div>
  <script>
    // WARNING: See the following for security issues around embedding JSON in HTML:
    // https://redux.js.org/recipes/server-rendering/#security-considerations
    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
      /</g,
      '\\u003c'
    )}
  </script>
  `)
}

export default renderSsrApp
