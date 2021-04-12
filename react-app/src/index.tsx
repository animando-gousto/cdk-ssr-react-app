import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components';
import App from './SsrApp'
import reportWebVitals from './reportWebVitals';
import configureStore from './store/configureStore';
import setupLocalState from './setupLocalState';
import theme from './theme';
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from 'react-router-dom'
import ssrContext from './context/ssr';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = (window as any).__PRELOADED_STATE__ || undefined
delete (window as any).__PRELOADED_STATE__

const {store, persistor} = configureStore(preloadedState)

if (!preloadedState) {
  setupLocalState(store.dispatch)
}

const renderMethod = preloadedState ? ReactDOM.hydrate : ReactDOM.render
renderMethod(
  <React.StrictMode>
    <ssrContext.Provider value={false}>
      <Provider store={store}>
        <Router>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </PersistGate>
        </Router>
      </Provider>
    </ssrContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
