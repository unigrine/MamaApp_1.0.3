import {
  GET_BANNER_TEXT, GET_BANNER_TEXT_SUCCESS, GET_BANNER_TEXT_FAILURE, SET_DEFAULT_VALUE_BANNER
} from './types';

export const defaultState = {
  isLoading: false,
  err: false,
  bannerlist: []
};
export const banner = (state = defaultState, action) => {
  switch (action.type) {
    case GET_BANNER_TEXT:
      return {
        ...state,
        isLoading: true,
      }
    case GET_BANNER_TEXT_SUCCESS:
      return {
        ...state,
        bannerlist: action.data?.data,
        err: action.data.err,
        isLoading: false
    }
    case GET_BANNER_TEXT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isLoading: false
      }
    case SET_DEFAULT_VALUE_BANNER:
      return defaultState;
    default:
      return state;
  }
};
