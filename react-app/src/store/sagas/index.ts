import { all } from 'redux-saga/effects'
import httpSaga from './httpSaga'

function* rootSaga() {
  yield all([
    httpSaga()
  ])
}

export default rootSaga
