import { put, all } from 'redux-saga/effects';
import { login, register, registerCeoOneSignalId } from './services';
import {
  LOGIN_SUCCESS, LOGIN_FAILURE,
  REGISTER_SUCCESS, REGISTER_FAILURE,
  REGISTER_CEO_ONESIGNAL_ID_SUCCESS, REGISTER_CEO_ONESIGNAL_ID_FAILURE,
} from './types';

export function* loginSaga(action) {
  const { email, password } = action;
  try {
    const response = yield login(email, password);
    let data = {}
    if (response.err == false) {  // success
      data = {
        token: response.token,
        seller_id: response.seller_id,
        seller_uid: response.seller_uid,
        err: response.err,
      }
    }
    else {  // fail
      data = {
        token: null,
        seller_id: null,
        err: response.err
      }
    }

    yield put({ type: LOGIN_SUCCESS, data });

  } catch (e) {
    yield put({ type: LOGIN_FAILURE });
  }
}

export function* registerSaga(action) {
  const sendData = action.data
  try {
    const response = yield register(sendData);
    const data = {
      err: response.err,
    }
    yield put({ type: REGISTER_SUCCESS, data });

  } catch (e) {
    yield put({ type: REGISTER_FAILURE });
  }
}

export function* RegisterCeoOneSignalIdSaga(action) {
  try {
    const response = yield registerCeoOneSignalId(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        onesignal_uid: response.data.id,
        status: response.err,
      }
    }
    else {  // fail
      data = {
        onesignal_uid: null,
        status: response.err
      }
    }

    yield put({ type: REGISTER_CEO_ONESIGNAL_ID_SUCCESS, data });
  } catch (e) {

    yield put({ type: REGISTER_CEO_ONESIGNAL_ID_FAILURE });

  }
}
