import * as React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/SsrApp'

const renderSsrApp = () => renderToString(<App ssr/>);

export default renderSsrApp
