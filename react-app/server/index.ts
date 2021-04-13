
import { Handler } from 'aws-lambda'
import axios from 'axios'
import Cookies from 'universal-cookie'
import renderSsrApp from './renderSsrApp';

export const handler: Handler = async (event) => {
  if (event.path.match(/manifest.json/)) {
    const staticPath = event.path.replace(/\/prod\//, '/')
    console.log(`Redirect '${event.path} to https://${process.env.STATIC_WEBSITE}${staticPath}`)
    const staticResponse = await axios.get(`http://${process.env.STATIC_WEBSITE}${staticPath}`)
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(staticResponse.data)
    }
  }
  else if (event.path.match(/(static\/|.*\.json|site.webmanifest|favicon|.*\.png|.*\.txt|.*\.js|.*\.css)/)) {
    const staticPath = event.path.replace(/\/prod\//, '/')
    console.log(`Redirect '${event.path} to https://${process.env.STATIC_WEBSITE}${staticPath}`)
    return {
      statusCode: 301,
      headers: {
        Location: `https://${process.env.STATIC_WEBSITE}${staticPath}`
      },
      body: undefined,
    }
  }
  let token = undefined
  const cookies = new Cookies(event.headers.cookie);
  const tokenValue = cookies.get('token');
  if (tokenValue) {
    const { data } = await axios.get<{ valid: boolean }>(`https://${process.env.API_ENDPOINT}/token/validate?token=${tokenValue}`)
    if (data.valid) {
      token = tokenValue
    } else {
      console.log('Token not valid')
    }
  }
  const staticPath = event.path.replace(/^.*prod\//, '/')
  const staticResponse = await axios.get(`http://${process.env.STATIC_WEBSITE}/index.html`)

  const app = await renderSsrApp(staticResponse.data, staticPath, token);

  const body = app.replace(/"\/prod\//g, '"/')

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html", apiEndpoint: process.env.API_ENDPOINT },
    body,
  }
}

