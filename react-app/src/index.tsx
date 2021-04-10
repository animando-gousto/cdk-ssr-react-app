import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux'
// import App from './App';
import App from './SsrApp'
import reportWebVitals from './reportWebVitals';
import configureStore from './store/configureStore';

console.log('hydrating react app');

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = (window as any).__PRELOADED_STATE__ || undefined
delete (window as any).__PRELOADED_STATE__

const store = configureStore(preloadedState)

console.log(process.env.REACT_APP_LOCAL)

const renderMethod = process.env.REACT_APP_LOCAL ? ReactDOM.render : ReactDOM.hydrate
renderMethod(
  <React.StrictMode>
    <Provider store={store}>
      <App ssr={false}/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
