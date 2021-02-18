import { put, all } from 'redux-saga/effects';
import { 
  SET_USER_STATUS_SUCCESS, SET_USER_STATUS_FAILURE,
  SET_LOCATION_SUCCESS, SET_LOCATION_FAILURE, 
  SET_DEVICE_TOKEN_SUCCESS, SET_DEVICE_TOKEN_FAILURE,
  SET_CURRENT_SCREEN_SUCCESS, SET_CURRENT_SCREEN_FAILURE,
} from './types';

export function* setUserStatusSaga(action) {
  const { status } = action;
  try {
    const data = {
      status: status,
    }
    yield put({ type: SET_USER_STATUS_SUCCESS, data });
    //return navigate('CheckInHome');
  } catch (e) {
    yield put({ type: SET_USER_STATUS_FAILURE });
  }
}

export function* setMyLocationSaga(action) {
  const { data } = action;
  try {
    yield put({ type: SET_LOCATION_SUCCESS, data });
  } catch (e) {
    yield put({ type: SET_LOCATION_FAILURE });
  }
}

export function* setDeviceTokenSaga(action) {
  const { data } = action;
  try {
    yield put({ type: SET_DEVICE_TOKEN_SUCCESS, data });
  } catch (e) {
    yield put({ type: SET_DEVICE_TOKEN_FAILURE });
  }
}

export function* setCurrentScreenSaga(action) {
  const { data } = action;
  try {
    yield put({ type: SET_CURRENT_SCREEN_SUCCESS, data });
  } catch (e) {
    yield put({ type: SET_CURRENT_SCREEN_FAILURE });
  }
}
