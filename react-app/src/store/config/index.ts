import { createReducer, createAction, createSelector } from '@reduxjs/toolkit'
import merge from 'lodash/merge'
import{ RootState } from '../types'

const rootSelector = ({ config }: RootState) => config

interface ConfigState {
  apiEndpoint: string,
}

export const getApiEndpoint = createSelector([rootSelector], ({apiEndpoint}) => apiEndpoint);

export const setConfig = createAction<ConfigState>('config/SET_CONFIG')

const initialState = {
} as ConfigState

export const configReducer =createReducer(initialState, builder => {
  builder.addCase(setConfig, (state, action) => {
    merge(state, action.payload);
  })
})
