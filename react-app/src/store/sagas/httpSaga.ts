import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit'
import { fork, all, call, put, take, cancelled, select } from 'redux-saga/effects'
import { requestSent, requestSucceeded, requestCancelled, requestFailed } from '../http'
import { loadedUsers } from '../users'
import { getApiEndpoint } from '../config'
import axios from 'axios'
import { getToken } from '../session/state'

function* doGet (config: HttpSagaConfig<any>, payload: any): Generator<any, any, any> {
  const apiEndpoint = yield select(getApiEndpoint)
  const token = yield select(getToken)
  console.log('GET', apiEndpoint, config.path)
  const response = yield call(axios.get, `https://${apiEndpoint}${config.path}`, {
    withCredentials: true,
    headers: {
      Authorization: token,
    }
  })
  return response.data
}

function* doApiCall(config: HttpSagaConfig<any>, payload: any): Generator<any> {
  return yield call(doGet, config, payload)
}

type HttpSagaConfig<R> = {
  method: string,
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

const createDispatchAction = <R, P = void>(config: HttpSagaConfig<R>)=> {
  const doAction = createAction<P, typeof config.action>(config.action);
  return doAction
}

export const httpActionCreators: Record<keyof typeof configs, ActionCreatorWithPayload<any>> = Object.keys(configs).reduce((acc, c) => ({
  ...acc,
  [c]: createDispatchAction(configs[c]),
}), {})

export const httpRequest = createAction<any>('HTTP_REQUEST');

const createSagaFromConfig = <T>(config: HttpSagaConfig<T>) => {

  function* callHttpSaga({ payload }: { payload: any }): any {
    yield put(requestSent(config.action))
    try {
      const response: T = yield call(doApiCall, config, payload)
      console.log({response})
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
    // const channel = yield actionChannel(config.action, buffers.sliding(1))
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
