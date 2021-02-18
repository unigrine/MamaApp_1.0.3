import {
  SET_MY_NOTIFICATION,
  SET_DEFAULT_VALUE_MY_NOTIFICATION,
  SET_IS_READ_MY_NOTIFICATION
} from './types';

export const SetMyNotificationAction = (data) => {
  return {
    type: SET_MY_NOTIFICATION,
    data
  }
};

export const SetIsReadMyNotificationAction = (data) => {
  return {
    type: SET_IS_READ_MY_NOTIFICATION,
    data
  }
};


export const SetDefaultValueMyNotificationAction = (data) => {
  return {
    type: SET_DEFAULT_VALUE_MY_NOTIFICATION,
    data
  }
};
