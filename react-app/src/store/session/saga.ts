import { call, takeEvery } from '@redux-saga/core/effects'
import { HttpSuccessPayload } from '../sagas/http/types'
import { loginSuccessful } from './state'
import { LoginSuccessfulPayload } from './types'

export function* processLoginSuccessful({ payload : { context } }: { payload: HttpSuccessPayload<LoginSuccessfulPayload> }) {
  if (context.doRedirect) {
    yield call(context.doRedirect)
  }

}
export function* sessionSaga() {
  yield takeEvery(loginSuccessful, processLoginSuccessful)
}
