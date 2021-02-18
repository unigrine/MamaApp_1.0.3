import {
  SET_CEO_NOTIFICATION,
  SET_DEFAULT_VALUE_CEO_NOTIFICATION,
  SET_IS_READ_CEO_NOTIFICATION,
} from './types';

export const defaultState = {
  notificationData: [],
  isReadNotification: true,
  isLoading: false,
  isSuccess: false,
  errorMsg: '',
};

export const notification = (state = defaultState, action) => {
  switch (action.type) {
    case SET_CEO_NOTIFICATION:
      return {
        ...state,
        notificationData: action.data,
      };
    case SET_IS_READ_CEO_NOTIFICATION:
      return {
        ...state,
        isReadNotification: action.data,
      };
    case SET_DEFAULT_VALUE_CEO_NOTIFICATION:
      return defaultState;
    default:
      return state;
  }
};
