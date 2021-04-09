import * as React from 'react';
import axios from 'axios';
import { renderToString } from 'react-dom/server';
import App from '../src/SsrApp'

const renderSsrApp = async () => {
  const apiResponse = await axios.get(process.env.API_ENDPOINT || '')
  console.log('got apiResponse', apiResponse);
  return renderToString(<App ssr data={apiResponse.data} />);
}

export default renderSsrApp
