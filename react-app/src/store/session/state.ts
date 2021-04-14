import { createAction, createReducer, createSelector } from '@reduxjs/toolkit'
// import axios from 'axios'
import { ThunkAction } from 'redux-thunk'
// import { getApiEndpoint } from '../config'
import rootSelector from '../rootSelector'
import { RootState } from '../types'
import Cookies from 'universal-cookie'
import { LoginSuccessfulPayload } from './types'
import { HttpSuccessPayload } from '../sagas/http/types'

const cookie = new Cookies()
interface SessionState {
  token?: string,
  user?: {
    id: string,
  }
}

export const loginSuccessful = createAction<HttpSuccessPayload<LoginSuccessfulPayload>>('session/LOGIN')
export const logout = createAction<void>('session/LOGOUT')

export const sessionSelector = createSelector([rootSelector], ({ session }) => session);
export const userSelector = createSelector([sessionSelector], ({ user }) => user);
export const getToken = createSelector([sessionSelector], ({ token }) => token);

export const doLogout = (): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
  dispatch(logout())
  cookie.remove('token')
}
export interface LoginFormData {
  username: string,
  password: string,
}

const initialState = { } as SessionState

const sessionReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginSuccessful, (state, {payload}) => {
      state.token = payload.response.token
      state.user = payload.response.user
    })
    .addCase(logout, (state, {payload}) => {
      state.token = undefined
      state.user = undefined
    })
})


export default sessionReducer;
