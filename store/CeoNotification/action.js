import {
  SET_CEO_NOTIFICATION,
  SET_DEFAULT_VALUE_CEO_NOTIFICATION, SET_IS_READ_CEO_NOTIFICATION
} from './types';

export const SetCeoNotificationAction = (data) => {
    return {
        type: SET_CEO_NOTIFICATION,
        data
    }
};

export const SetIsReadCeoNotificationAction = (data) => {
    return {
        type: SET_IS_READ_CEO_NOTIFICATION,
        data
    }
};


export const SetDefaultValueCeoNotificationAction = (data) => {
    return {
        type: SET_DEFAULT_VALUE_CEO_NOTIFICATION,
        data
    }
};
