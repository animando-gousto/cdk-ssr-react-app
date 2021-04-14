import { createReducer, createAction, createSelector } from '@reduxjs/toolkit'
import merge from 'lodash/merge'
import { logout } from '../session/state';
import{ RootState } from '../types'

const rootSelector = ({ users }: RootState) => users

export interface User {
  id: string,
  firstName: string,
  surname: string,
}

interface UsersState {
  loaded: boolean,
  entities: Record<string, User>
}

export const getUsersById = createSelector([rootSelector], (users) => users.entities);
export const getUsers = createSelector([getUsersById], (entities) => Object.values(entities));
export const usersAreLoaded = createSelector([rootSelector], ({ loaded }) => loaded);

export type GetUsersSuccessPayload = User[]
export const loadedUsers = createAction<GetUsersSuccessPayload>('users/LOADED_USERS')

const byId = (users: User[]) => users.reduce<Record<string, User>>((acc, user) => {
  return {
    ...acc,
    [user.id]: user
  }
}, {})

const initialState = {
  entities: {
  },
  loaded: false,
} as UsersState

export const usersReducer = createReducer(initialState, builder => {
  builder.addCase(loadedUsers, (state, action) => {
    merge(state.entities, byId(action.payload));
    state.loaded = true;
  })
  builder.addCase(logout, (state, action) => {
    state.entities = {}
    state.loaded = false;
  })
})
