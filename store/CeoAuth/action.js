import {
    LOGIN,
    LOG_OUT,
    REGISTER,
    FORGOT_PASSWORD,
    REGISTER_CEO_ONESIGNAL_ID, SET_DEFAULT_VALUE_CEO_AUTH,
} from './types';

export function LoginAction(action) {
  return {
    type: LOGIN,
    email: action.email,
    password: action.password
  };
}

export function RegisterAction(data) {
  return {
    type: REGISTER,
    data,
  };
}

export function RegisterCeoOneSignalIdAction(sendData) {
  return {
    type: REGISTER_CEO_ONESIGNAL_ID,
    sendData,
  };
}

export function ForgotPasswordAction(email) {
  return {
    type: FORGOT_PASSWORD,
    email,
  };
}


// 공지사항 초기화
export function SetDefaultValueCeoAuthAction(data) {
    return {
        type: SET_DEFAULT_VALUE_CEO_AUTH,
        data
    }
}
