import { createReducer, createAction, createSelector } from '@reduxjs/toolkit'
import axios from 'axios';
import merge from 'lodash/merge'
import{ AppDispatch, RootState } from '../'
import { getApiEndpoint } from '../config';

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

export const loadedUsers = createAction<Record<string, User>>('users/LOADED_USERS')

export const loadUsers = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const response = await axios.get<Array<User>>(`https://${getApiEndpoint(getState())}/users`);

  const users = response.data
  const byId = users.reduce<Record<string, User>>((acc, user) => {
    return {
      ...acc,
      [user.id]: user
    }
  }, {})
  dispatch(loadedUsers(byId))
}

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
