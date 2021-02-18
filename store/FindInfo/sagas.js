import { put, all } from 'redux-saga/effects';
import { findIdByAddress, findIdByEmail, findIdByPhone, changeSellerId,
        changePassword, changeShopAddress, findPasswordByPhone, findPasswordByEmail } from './services';

import {
  FIND_ID_ADDRESS_SUCCESS, FIND_ID_ADDRESS_FAILURE,
  FIND_ID_PHONE_SUCCESS, FIND_ID_PHONE_FAILURE,
  FIND_ID_EMAIL_SUCCESS, FIND_ID_EMAIL_FAILURE,
  CHANGE_SELLER_ID_SUCCESS, CHANGE_SELLER_ID_FAILURE,
  CHANGE_SELLER_PASSWORD_SUCCESS, CHANGE_SELLER_PASSWORD_FAILURE,
  CHANGE_SHOP_ADDRESS_SUCCESS, CHANGE_SHOP_ADDRESS_FAILURE,
  UPDATE_BUSINESS_INFO_SUCCESS, UPDATE_BUSINESS_INFO_FAILURE,
  FIND_PASSWORD_PHONE_SUCCESS, FIND_PASSWORD_PHONE_FAILURE,
  FIND_PASSWORD_EMAIL_SUCCESS, FIND_PASSWORD_EMAIL_FAILURE,
} from './types';

import { SET_SELLER_ID} from '../CeoAuth/types'

export function* FindIdByAddressSaga(action) {
  try {
    const response = yield findIdByAddress(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourid: response.data,
        err: response.err,
      }
      yield put({ type: FIND_ID_ADDRESS_SUCCESS, data });
    }
    else {  // fail
      data = {
        yourid: null,
        err: response.err
      }
      yield put({ type: FIND_ID_ADDRESS_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: FIND_ID_ADDRESS_FAILURE });
  }
}

export function* FindIdByPhoneSaga(action) {
  try {
    const response = yield findIdByPhone(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourid: response.data,
        err: response.err,
      }
      yield put({ type: FIND_ID_PHONE_SUCCESS, data });
    }
    else {  // fail
      data = {
        yourid: null,
        err: response.err
      }
      yield put({ type: FIND_ID_PHONE_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: FIND_ID_PHONE_FAILURE });
  }
}

export function* FindIdByEmailSaga(action) {
  try {
    const response = yield findIdByEmail(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourid: response.data,
        err: response.err,
      }
      yield put({ type: FIND_ID_EMAIL_SUCCESS, data });
    }
    else {  // fail
      data = {
        yourid: null,
        err: response.err
      }
      yield put({ type: FIND_ID_EMAIL_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: FIND_ID_EMAIL_FAILURE });
  }
}

export function* FindPasswordByPhoneSaga(action) {
  try {
    const response = yield findPasswordByPhone(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourpw: response.data,
        err: response.err,
      }
      yield put({ type: FIND_PASSWORD_PHONE_SUCCESS, data });
    }
    else {  // fail
      data = {
        yourpw: null,
        err: response.err
      }
      yield put({ type: FIND_PASSWORD_PHONE_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: FIND_PASSWORD_PHONE_FAILURE });
  }
}

export function* FindPasswordByEmailSaga(action) {
  try {
    const response = yield findPasswordByEmail(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourpw: response.data,
        err: response.err,
      }
      yield put({ type: FIND_PASSWORD_EMAIL_SUCCESS, data });
    }
    else {  // fail
      data = {
        yourpw: null,
        err: response.err
      }
      yield put({ type: FIND_PASSWORD_EMAIL_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: FIND_PASSWORD_EMAIL_FAILURE });
  }
}

export function* ChangeSellerIdSaga(action) {
  try {
    const response = yield changeSellerId(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourid: response.data,
        err: response.err,
      }
      yield put({ type: CHANGE_SELLER_ID_SUCCESS, data });

      // 세션에서 아이디 업데이트
      const seller_id = response.data
      yield put({ type: SET_SELLER_ID, seller_id });

    }
    else {  // fail
      data = {
        yourid: null,
        err: response.err
      }
      yield put({ type: CHANGE_SELLER_ID_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: CHANGE_SELLER_ID_FAILURE });
  }
}

export function* ChangePasswordSaga(action) {
  try {
    const response = yield changePassword(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        yourid: response.data,
        err: response.err,
      }
      yield put({ type: CHANGE_SELLER_PASSWORD_SUCCESS, data });
    }
    else {  // fail
      data = {
        yourid: null,
        err: response.err
      }
      yield put({ type: CHANGE_SELLER_PASSWORD_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: CHANGE_SELLER_PASSWORD_FAILURE });
  }
}

export function* ChangeShopAddressSaga(action) {
  try {
    const response = yield changeShopAddress(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        err: response.err,
      }
      yield put({ type: CHANGE_SHOP_ADDRESS_SUCCESS, data });
    }
    else {  // fail
      data = {
        err: response.err
      }
      yield put({ type: CHANGE_SHOP_ADDRESS_FAILURE, data });
    }
  } catch (e) {
    yield put({ type: CHANGE_SHOP_ADDRESS_FAILURE });
  }
}
