import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { fork, all, call, put, take, cancelled, select } from 'redux-saga/effects'
import { requestSent, requestSucceeded, requestCancelled, requestFailed } from '../http'
import { GetUsersSuccessPayload, loadedUsers } from '../users'
import { getApiEndpoint } from '../config'
import axios from 'axios'
import { getToken, loginSuccessful } from '../session/state'
import { LoginSuccessfulPayload } from '../session/types'
import URI from 'urijs'
import { HttpSuccessPayload } from './types'

function* doGet (config: HttpSagaConfig<any>, payload: GetRequestPayload): Generator<any, any, any> {
  const apiEndpoint = yield select(getApiEndpoint)
  const token = yield select(getToken)
  const uri = new URI(`https://${apiEndpoint}${config.path}`).query(URI.buildQuery(payload.queries || {})).valueOf()
  const response = yield call(axios.get, uri, {
    withCredentials: true,
    headers: {
      Authorization: token,
    }
  })
  return response.data
}
function* doPost <B>(config: HttpSagaConfig<any>, payload: PostRequestPayload<B>): Generator<any, any, any> {
  const apiEndpoint = yield select(getApiEndpoint)
  const token = yield select(getToken)
  const response = yield call(axios.post, `https://${apiEndpoint}${config.path}`, payload.body, {
    withCredentials: true,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

type HttpMethod = 'GET' | 'POST'// | 'PUT' | 'DELETE'

type MethodHandlers = {
  'GET': typeof doGet,
  'POST': typeof doPost,
}
const methodHandlers: MethodHandlers = {
  GET: doGet,
  POST: doPost,
}

function* doApiCall(config: HttpSagaConfig<any>, payload: any): Generator<any> {
  if (config.method === 'GET') {
    return yield call(doGet, config, payload)
  }
  if (config.method === 'POST') {
    return yield call(doPost, config, payload)
  }
}

interface HttpRequestPayload {
  context?: any,
}
export interface GetRequestPayload extends HttpRequestPayload {
  queries?: Record<string, string>
  headers?: Record<string, string>,
}
export interface PostRequestPayload<B> extends HttpRequestPayload {
  headers?: Record<string, string>,
  body?: B,
}
type ConfigNames = 'getUsers' | 'requestToken' // it would be nice to infer this from `configs`
type HttpSagaConfig<R> = {
  method: HttpMethod,
  path: string,
  action: string,
  successAction: ActionCreatorWithPayload<HttpSuccessPayload<R>>,
}

interface GetHttpSagaConfig<R> extends HttpSagaConfig<R> {
  method: 'GET'
}
interface PostHttpSagaConfig<R> extends HttpSagaConfig<R> {
  method: 'POST'
}

const configs = {
  'getUsers': {
    path: '/users',
    method: 'GET',
    action: 'users/GET_USERS',
    successAction: loadedUsers,
  } as GetHttpSagaConfig<GetUsersSuccessPayload>,
  'requestToken': {
    path: '/token',
    method: 'POST',
    action: 'session/REQUEST_TOKEN',
    successAction: loginSuccessful,
  } as PostHttpSagaConfig<LoginSuccessfulPayload>,
}

const createDispatchAction = (configName: ConfigNames)=> {
  const config = configs[configName]
  const method = config.method
  const handler = methodHandlers[method]
  type PayloadType = Parameters<typeof handler>[1]
  const doAction = createAction<PayloadType, typeof config.action>(config.action);
  return doAction
}
type HttpActionCreators = {
  [K in ConfigNames]: ActionCreatorWithPayload<Parameters<typeof methodHandlers[typeof configs[K]['method']]>[1]>
}

const configKeys = Object.keys(configs) as Array<ConfigNames>

const httpActionCreators: HttpActionCreators = configKeys.reduce((acc, c) => {
  return {
    ...acc,
    [c]: createDispatchAction(c)
  }
}, {} as Record<ConfigNames, ActionCreatorWithPayload<any>>)

export const { getUsers, requestToken } = httpActionCreators

const createSagaFromConfig = (configName: ConfigNames) => {
  const config = configs[configName]

  type P = Parameters<HttpActionCreators[typeof configName]>[0]

  function* callHttpSaga({ payload }: { payload: P }): any {
    const { context } = payload
    yield put(requestSent(config.action))
    try {
      const response = yield call(doApiCall, config, payload)
      yield put(requestSucceeded(config.action))
      yield put(config.successAction({ response, context }))
    } catch (err) {
      yield put(requestFailed(config.action))
    } finally {
      if (yield cancelled()) {
        yield put(requestCancelled(config.action))
      }
    }
  }

  return function* (): any {
    let lastTask
    while (true) {
      const action = yield take(config.action)
      if (lastTask) {
        lastTask.cancel()
      }
      lastTask = yield fork(callHttpSaga, action)
    }
  }
}

function* httpSaga() {
  const cc = Object.keys(configs) as Array<keyof typeof configs>
  const httpSagas = cc.map(c => createSagaFromConfig(c)())

  yield all([
    ...httpSagas,
  ])
}

export default httpSaga
