import { put, all } from 'redux-saga/effects';
import {
  getNewsEvents,
  getBusinessCategory,
  updateShopInfo,
  registerShopInfo,
  updateMarkImage,
  getFavoriteNewsEvents
} from './services';
import {
  GET_NEWS_EVENTS_SUCCESS,
  GET_NEWS_EVENTS_FAILURE,
  UPDATE_SHOP_INFO_SUCCESS,
  UPDATE_SHOP_INFO_FAILURE,
  REGISTER_SHOP_INFO_SUCCESS,
  REGISTER_SHOP_INFO_FAILURE,
  UPDATE_MARK_IMAGE_SUCCESS,
  UPDATE_MARK_IMAGE_FAILURE,
  GET_FAVORITE_NEWS_EVENTS_SUCCESS, GET_FAVORITE_NEWS_EVENTS_FAILURE,
} from './types';

export function* GetNewsEventsSaga(action) {
  try {
    const response = yield getNewsEvents(action.sendData.data);
    console.log(`GetNewsEventsSaga`, response.data.shops.length);
    let data = {}
    if (response?.err === false) {  // success
      data = {
        data: response.data,
        err: response.err,
        screen: action.sendData.screen
      }
    }
    else {  // fail
      data = {
        data: null,
        err: response.err,
        screen: action.sendData.screen
      }
    }
    yield put({ type: GET_NEWS_EVENTS_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_NEWS_EVENTS_FAILURE })
  }
}

export function* GetFavoriteNewsEventsSaga(action) {
  try {
    const response = yield getFavoriteNewsEvents(action.sendData.data);
    console.log(`GetFavoriteNewsEventsSaga`);
    let data = {}
    if (response?.err == false) {  // success
      data = {
        data: response.data,
        err: response.err,
        screen: action.sendData.screen
      }
    }
    else {  // fail
      data = {
        data: null,
        err: response.err,
        screen: action.sendData.screen
      }
    }
    yield put({ type: GET_FAVORITE_NEWS_EVENTS_SUCCESS, data })
  } catch (e) {
    yield put({ type: GET_FAVORITE_NEWS_EVENTS_FAILURE })
  }
}

export function* updateShopInfoSaga(action) {
  try {
    const response = yield updateShopInfo(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        shop_data: response.data,
        err: response.err,
      }
      yield put({ type: UPDATE_SHOP_INFO_SUCCESS, data });
    }
    else {  // fail
      data = {
        shop_data: null,
        err: response.err
      }
      yield put({ type: REGISTER_SHOP_INFO_FAILURE, data });
    }

  } catch (e) {
    yield put({ type: UPDATE_SHOP_INFO_FAILURE });
  }
}

export function* registerShopInfoSaga(action) {
  try {
    const response = yield registerShopInfo(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        shop_data: response.data,
        err: response.err,
      }
      yield put({ type: REGISTER_SHOP_INFO_SUCCESS, data });
    }
    else {  // fail
      data = {
        shop_data: null,
        err: response.err
      }
      yield put({ type: REGISTER_SHOP_INFO_FAILURE, data });
    }

  } catch (e) {
    yield put({ type: REGISTER_SHOP_INFO_FAILURE });
  }
}

export function* updateMarkImageSaga(action) {
  try {
    const response = yield updateMarkImage(action.sendData);
    let data = {}
    if (response.err == false) {  // success
      data = {
        shop_data: response.data,
        err: response.err,
      }
      yield put({ type: UPDATE_MARK_IMAGE_SUCCESS, data });
    }
    else {  // fail
      data = {
        shop_data: null,
        err: response.err
      }
      yield put({ type: UPDATE_MARK_IMAGE_FAILURE, data });
    }

  } catch (e) {
    yield put({ type: UPDATE_MARK_IMAGE_FAILURE });
  }
}
