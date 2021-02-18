import { put, all } from 'redux-saga/effects';
import { setFavorite, deleteFavorite } from './services';
import {
  SET_FAVORITE_SUCCESS, SET_FAVORITE_FAILURE,
  DELETE_FAVORITE_SUCCESS, DELETE_FAVORITE_FAILURE,
} from './types';

export function* SetFavoriteSaga(action) {
  try {
    const response = yield setFavorite(action.sendData)
    let data = {}
    if (response?.err == false) {  // success
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
    yield put({ type: SET_FAVORITE_SUCCESS, data })
  } catch (e) {
    yield put({ type: SET_FAVORITE_FAILURE })
  }
}

export function* DeleteFavoriteSaga(action) {
  try {
    const response = yield deleteFavorite(action.sendData)
    let data = {}
    if (response?.err == false) {  // success
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
    yield put({ type: DELETE_FAVORITE_SUCCESS, data })
  } catch (e) {
    yield put({ type: DELETE_FAVORITE_FAILURE })
  }
}
