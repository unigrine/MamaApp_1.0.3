import { put, all } from 'redux-saga/effects';
import { getBannerText } from './services';
import {
  GET_BANNER_TEXT_SUCCESS, GET_BANNER_TEXT_FAILURE,
} from './types';

export function* GetBannerTextSaga() {
  try {
    const response = yield getBannerText();
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
    yield put({ type: GET_BANNER_TEXT_SUCCESS, data });
  } catch (e) {
    yield put({ type: GET_BANNER_TEXT_FAILURE });
  }
}