import { createAction, createReducer } from '@reduxjs/toolkit'

export const requestSent = createAction<string>('REQUEST_SENT');
export const requestSucceeded = createAction<string>('REQUEST_SUCCEEDED');
export const requestFailed = createAction<string>('REQUEST_FAILED');
export const requestCancelled = createAction<string>('REQUEST_CANCELLED');

interface HttpState {
  requests: number,
}

const initialState = { requests: 0 } as HttpState

const httpReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(requestSent, (state, {payload}) => {
      state.requests++
    })
    .addCase(requestSucceeded, (state, {payload}) => {
      state.requests--
    })
    .addCase(requestFailed, (state, {payload}) => {
      state.requests--
    })
    .addCase(requestCancelled, (state, {payload}) => {
      state.requests--
    })
    .addDefaultCase(() => {

    })
})

export default httpReducer;
