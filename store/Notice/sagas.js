import { put, all } from 'redux-saga/effects';
import { getNotice } from './services';
import {
  GET_NOTICE_SUCCESS, GET_NOTICE_FAILURE,
} from './types';

export function* GetNoticeSaga() {
  try {
    const response = yield getNotice();
    let data = {}
    if (response.err == false) {  // success
      data = {
        data: response.data,
        err: response.err,
      }
    }
    else {  // fail
      data = {
        data: null,
        err: response.err
      }
    }
    yield put({ type: GET_NOTICE_SUCCESS, data });
  } catch (e) {
    yield put({ type: GET_NOTICE_FAILURE });
  }
}