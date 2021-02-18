import {
  SET_DEFAULT_VALUE_MY_NOTIFICATION,
  SET_IS_READ_MY_NOTIFICATION,
  SET_MY_NOTIFICATION
} from "./types";

export const defaultState = {
  notificationData: [],
  isReadNotification: true,
  isLoading: false,
  isSuccess: false,
  errorMsg: "",
};

export const mynotification = (state = defaultState, action) => {
  switch (action.type) {
    case SET_MY_NOTIFICATION:
      return {
        ...state,
        notificationData: action.data,
      };
    case SET_IS_READ_MY_NOTIFICATION:
      return {
        ...state,
        isReadNotification: action.data,
      };
    case SET_DEFAULT_VALUE_MY_NOTIFICATION:
      return defaultState;
    default:
      return state;
  }
};
