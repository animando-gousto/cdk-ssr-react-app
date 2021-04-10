
import { Handler } from 'aws-lambda'
import axios from 'axios'

import renderSsrApp from './renderSsrApp';

export const handler: Handler = async (event) => {
  console.log('react server handle event', JSON.stringify(event, null, 2));


  if (event.path.match(/(static|manifest.json|favicon.ico)/)) {
    const staticPath = event.path.replace(/^.*prod\//, '/')
    console.log(`fetch static path '${staticPath}' from ${process.env.STATIC_WEBSITE}`)
    const staticResponse = await axios.get(`http://${process.env.STATIC_WEBSITE}${staticPath}`)
    return {
      statusCode: 200,
      body: staticResponse.data,
    }
  }
  const staticPath = event.path.replace(/^.*prod\//, '/')
  console.log(`fetch static path '${staticPath}' from ${process.env.STATIC_WEBSITE}`)
  const staticResponse = await axios.get(`http://${process.env.STATIC_WEBSITE}${staticPath}`)

  const app = await renderSsrApp(staticResponse.data);

  const body = app.replace(/\/static\//g, '/prod/static/')
    .replace(/\/manifest.json/, '/prod/manifest.json')
    .replace(/\/favicon.ico/, '/prod/favicon.ico')

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html", apiEndpoint: process.env.API_ENDPOINT },
    body,
  }
}

