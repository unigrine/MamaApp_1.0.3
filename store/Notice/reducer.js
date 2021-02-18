import {
  GET_NOTICE, GET_NOTICE_SUCCESS, GET_NOTICE_FAILURE, SET_DEFAULT_VALUE_NOTICE
} from './types';

export const defaultState = {
  isLoading: false,
  err: false,
  notices: []
};
export const notice = (state = defaultState, action) => {
  switch (action.type) {
    case GET_NOTICE:
      return {
        ...state,
        isLoading: true,
      }
    case GET_NOTICE_SUCCESS:
      return {
        ...state,
        notices: action.data?.data,
        err: action.data.err,
        isLoading: false
    }
    case GET_NOTICE_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isLoading: false
      }
    case SET_DEFAULT_VALUE_NOTICE:
      return defaultState;
    default:
      return state;
  }
};
