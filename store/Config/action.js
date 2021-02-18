import {
  SET_USER_STATUS,
  SET_LOCATION,
  SET_DEVICE_TOKEN,
  SET_CURRENT_SCREEN,
  ADD_ADDRESS_HISTORY,
  REMOVE_ADDRESS_HISTORY,
  INIT_ADDRESS_HISTORY,
  SET_ONESIGNAL_ID,
  SET_TERMS_AGREE, SET_CLICK_AREA, SET_ENTER_HOME, SET_DEFAULT_VALUE_CONFIG, SET_TAB_SCROLL_LOCK
} from './types';

export function SetUserStatusAction(action) {
  return {
    type: SET_USER_STATUS,
    status: action.status
  };
}

export function SetMyLocationAction(data) {
  return {
    type: SET_LOCATION,
    data
  };
}

export function AddAddressHistoryAction(data) {
  return {
    type: ADD_ADDRESS_HISTORY,
    data
  };
}

export function RemoveAddressHistoryAction(data) {
  return {
    type: REMOVE_ADDRESS_HISTORY,
    data
  };
}

export function InitAddressHistoryAction() {
  return {
    type: INIT_ADDRESS_HISTORY,
    // data
  };
}

export function SetDeviceTokenAction(data) {
  return {
    type: SET_DEVICE_TOKEN,
    data
  };
}

export function SetCurrentScreenAction(data) {
  return {
    type: SET_CURRENT_SCREEN,
    data
  };
}

export function SetOneSignalIdAction(data) {
  return {
    type: SET_ONESIGNAL_ID,
    data
  };
}

export function setTermsAgreeAction(data) {
  return {
    type: SET_TERMS_AGREE,
    data
  };
}

export function SetClickAreaAction(data) {
  return {
    type: SET_CLICK_AREA,
    data
  };
}

export function SetEnterHomeAction(data) {
  return {
    type: SET_ENTER_HOME,
    data
  };
}

export function setTabScrollLockAction(data) {
  return {
    type: SET_TAB_SCROLL_LOCK,
    data
  };
}

export function SetDefaultValueConfigAction(data) {
  return {
    type: SET_DEFAULT_VALUE_CONFIG,
    data
  };
}

