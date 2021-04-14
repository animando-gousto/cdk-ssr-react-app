import { createAction, createReducer, createSelector } from '@reduxjs/toolkit'
// import axios from 'axios'
import { ThunkAction } from 'redux-thunk'
// import { getApiEndpoint } from '../config'
import rootSelector from '../rootSelector'
import { RootState } from '../types'
import Cookies from 'universal-cookie'

const cookie = new Cookies()
interface SessionState {
  token?: string,
  user?: {
    id: string,
  }
}

interface LoginPayload {
  token: string,
  user?: {
    id: string,
  }
}
export const loginSuccessful = createAction<LoginPayload>('session/LOGIN')
export const logout = createAction<void>('session/LOGOUT')

export const sessionSelector = createSelector([rootSelector], ({ session }) => session);
export const userSelector = createSelector([sessionSelector], ({ user }) => user);
export const getToken = createSelector([sessionSelector], ({ token }) => token);

// const callLoginApi = async (apiEndpoint: string, loginForm: LoginFormData) => {
//   const response = await axios.post(`https://${apiEndpoint}/token`, loginForm, {
//     withCredentials: true
//   })
//   return response.data
// }
export const doLogout = (): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
  dispatch(logout())
  cookie.remove('token')
}
export interface LoginFormData {
  username: string,
  password: string,
}
// export const doLogin = (loginForm: LoginFormData): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
//   const loginResponse = await callLoginApi(getApiEndpoint(getState()), loginForm);
//   dispatch(login(loginResponse))
// }

const initialState = { } as SessionState

const sessionReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginSuccessful, (state, {payload}) => {
      state.token = payload.token
      state.user = payload.user
    })
    .addCase(logout, (state, {payload}) => {
      state.token = undefined
      state.user = undefined
    })
})

export default sessionReducer;
