import { createReducer, createAction, createSelector } from '@reduxjs/toolkit'
import merge from 'lodash/merge'
import{ RootState } from '../'

const rootSelector = ({ users }: RootState) => users

interface User {
  id: string,
  firstName: string,
}

interface UsersState {
  loaded: boolean,
  entities: Record<string, User>
}

export const getUsersById = createSelector([rootSelector], (users) => users.entities);
export const getUsers = createSelector([getUsersById], (entities) => Object.values(entities));
export const usersAreLoaded = createSelector([rootSelector], ({ loaded }) => loaded);

export const loadedUsers = createAction<Record<string, User>>('users/LOADED_USERS')

const initialState = {
  entities: {
  },
  loaded: false,
} as UsersState

export const usersReducer =createReducer(initialState, builder => {
  builder.addCase(loadedUsers, (state, action) => {
    merge(state.entities, action.payload);
    state.loaded = true;
  })
})
