import { all } from 'redux-saga/effects'
import httpSaga from './httpSaga'
import { sessionSaga } from '../session/saga'

function* rootSaga() {
  yield all([
    httpSaga(),
    sessionSaga(),
  ])
}

export default rootSaga
