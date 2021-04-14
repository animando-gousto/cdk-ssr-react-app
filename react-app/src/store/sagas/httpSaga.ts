import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { fork, all, call, put, take, cancelled, select } from 'redux-saga/effects'
import { requestSent, requestSucceeded, requestCancelled, requestFailed } from '../http'
import { loadedUsers } from '../users'
import { getApiEndpoint } from '../config'
import axios from 'axios'
import { getToken } from '../session/state'
import URI from 'urijs'

interface GetRequestPayload {
  queries: Record<string, string>
  headers?: Record<string, string>,
}
function* doGet (config: HttpSagaConfig<any>, payload: GetRequestPayload): Generator<any, any, any> {
  const apiEndpoint = yield select(getApiEndpoint)
  const token = yield select(getToken)
  const uri = new URI(`https://${apiEndpoint}${config.path}`).query(URI.buildQuery({a: 'b'})).valueOf()
  const response = yield call(axios.get, uri, {
    withCredentials: true,
    headers: {
      Authorization: token,
    }
  })
  return response.data
}
interface PostRequestPayload<B> {
  queries: Record<string, string>
  headers?: Record<string, string>,
  body?: B,
}
function* doPost <B>(config: HttpSagaConfig<any>, payload: PostRequestPayload<B>): Generator<any, any, any> {
  const apiEndpoint = yield select(getApiEndpoint)
  const token = yield select(getToken)
  const uri = new URI(`https://${apiEndpoint}${config.path}`).query(URI.buildQuery({a: 'b'})).valueOf()
  const response = yield call(axios.post, uri, {
    withCredentials: true,
    headers: {
      Authorization: token,
    },
    body: payload.body,
  })
  return response.data
}

type HttpMethod = 'GET' | 'POST'// | 'PUT' | 'DELETE'
const methodHandlers: Record<HttpMethod, any> = {
  GET: doGet,
  POST: doPost,
}

function* doApiCall(config: HttpSagaConfig<any>, payload: any): Generator<any> {
  return yield call(doGet, config, payload)
}

type HttpSagaConfig<R> = {
  method: HttpMethod,
  path: string,
  action: string,
  successAction: ActionCreatorWithPayload<R>,
}

const configs: Record<string, HttpSagaConfig<any>> = {
  'getUsers': {
    path: '/users',
    method: 'GET',
    action: 'users/GET_USERS',
    successAction: loadedUsers,
  }
}

const createDispatchAction = <R>(config: HttpSagaConfig<R>)=> {
  const method = config.method
  const handler = methodHandlers[method]
  type PayloadType = Parameters<typeof handler>
  const doAction = createAction<PayloadType, typeof config.action>(config.action);
  return doAction
}
type ConfigKeys = keyof typeof configs
const httpActionCreators: Record<keyof typeof configs, ActionCreatorWithPayload<any>> = Object.keys(configs).reduce((acc, c) => {
  const config = configs[c]
  return {
    ...acc,
    [c]: createDispatchAction(config)
  }
}, {})

export const { getUsers } = httpActionCreators

export const httpRequest = createAction<any>('HTTP_REQUEST');

const createSagaFromConfig = <T>(config: HttpSagaConfig<T>) => {

  function* callHttpSaga({ payload }: { payload: any }): any {
    yield put(requestSent(config.action))
    try {
      const response: T = yield call(doApiCall, config, payload)
      yield put(requestSucceeded(config.action))
      yield put(config.successAction(response as any))
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
  const httpSagas = Object.keys(configs).map(action => createSagaFromConfig(configs[action])())

  yield all([
    ...httpSagas,
  ])
}

export default httpSaga
