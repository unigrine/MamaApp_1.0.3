import {
  SET_FAVORITE, SET_FAVORITE_SUCCESS, SET_FAVORITE_FAILURE,
  DELETE_FAVORITE, DELETE_FAVORITE_SUCCESS, DELETE_FAVORITE_FAILURE, SET_DEFAULT_VALUE_FAVORITE,
} from './types';

export const defaultState = {
  isLoading: false,
  err: false,
};
export const favorite = (state = defaultState, action) => {
  switch (action.type) {
    case SET_FAVORITE:
      return {
        ...state,
        isLoading: true,
      }
    case SET_FAVORITE_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    }
    case SET_FAVORITE_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
      }
    case DELETE_FAVORITE:
      return {
        ...state,
        isLoading: true,
      }
    case DELETE_FAVORITE_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    }
    case DELETE_FAVORITE_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
      }
    case SET_DEFAULT_VALUE_FAVORITE:
      return defaultState
    default:
      return state;
  }
};
