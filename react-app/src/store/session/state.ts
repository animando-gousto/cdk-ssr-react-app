import { createAction, createReducer, createSelector } from '@reduxjs/toolkit'
import axios from 'axios'
import { ThunkAction } from 'redux-thunk'
import rootSelector from '../rootSelector'
import { RootState } from '../types'

interface SessionState {
  token?: string,
  user?: {
    id: string,
  }
}

interface LoginPayload {
  token: string,
  user: {
    id: string,
  }
}
export const login = createAction<LoginPayload>('session/LOGIN')
export const logout = createAction<void>('session/LOGOUT')

export const sessionSelector = createSelector([rootSelector], ({ session }) => session);
export const userSelector = createSelector([sessionSelector], ({ user }) => user);
export const getToken = createSelector([sessionSelector], ({ token }) => token);

const callLoginApi = async (loginForm: LoginFormData) => {
  const response = await axios.post(`https://${process.env.REACT_APP_API_ENDPOINT}/token`, loginForm)
  console.log('login response', { response })
  return response.data
}
export const doLogout = (): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
  dispatch(logout())
}
export interface LoginFormData {
  username: string,
  password: string,
}
export const doLogin = (loginForm: LoginFormData): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
  const loginResponse = await callLoginApi(loginForm);
  dispatch({type: 'session/ATTEMPT_LOGIN' })
  dispatch(login(loginResponse))
}

const initialState = { } as SessionState

const sessionReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(login, (state, {payload}) => {
      state.token = payload.token
      state.user = payload.user
    })
    .addCase(logout, (state, {payload}) => {
      state.token = undefined
      state.user = undefined
    })
    .addDefaultCase(() => {

    })
})

export default sessionReducer;
