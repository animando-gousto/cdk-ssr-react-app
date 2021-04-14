import * as React from 'react';
import { Provider } from 'react-redux';
import ssrContext from '../src/context/ssr'
import { ThemeProvider } from 'styled-components'
import { renderToString } from 'react-dom/server';
import App from '../src/App'
import configureStore from './configureStore';
import { StaticRouter } from "react-router";
import theme from '../src/theme'
import { loginSuccessful } from '../src/store/session/state';

const renderSsrApp = async (page: string, url: string, token?: string) => {
  const store = await configureStore();
  if (token) {
    store.dispatch(loginSuccessful({ response: { token }}))
  }

  const routerContext = {}
  const app = renderToString(
    <Provider store={store}>
      <ssrContext.Provider value={true}>
        <ThemeProvider theme={theme}>
          <StaticRouter location={url} context={routerContext}>
            <App />
          </StaticRouter>
        </ThemeProvider>
      </ssrContext.Provider>
    </Provider>
  );

  console.log('Pre-rendered', app)

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
