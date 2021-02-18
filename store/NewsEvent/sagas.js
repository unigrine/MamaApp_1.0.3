import { put, all } from 'redux-saga/effects';
import {
  getNewsEventCategory,
  registerNewsEvent,
  getNewsEvent,
  updateNewsEvent,
  deleteNewsEvent,
  reportToNewsEventComment,
  sendCommentToNewsEvent,
  reportToNewsEvent
} from './services';
import {
  GET_NEWSEVENT_CATEGORY_SUCCESS,
  GET_NEWSEVENT_CATEGORY_FAILURE,
  REGISTER_NEWSEVENT_SUCCESS,
  REGISTER_NEWSEVENT_FAILURE,
  UPDATE_NEWSEVENT_SUCCESS,
  UPDATE_NEWSEVENT_FAILURE,
  GET_NEWSEVENT_SUCCESS,
  GET_NEWSEVENT_FAILURE,
  DELETE_NEWSEVENT_SUCCESS,
  DELETE_NEWSEVENT_FAILURE,
  REPORT_TO_NEWSEVENT_COMMENT_SUCCESS,
  REPORT_TO_NEWSEVENT_COMMENT_FAILURE,
  SEND_COMMENT_TO_NEWSEVENT_SUCCESS,
  SEND_COMMENT_TO_NEWSEVENT_FAILURE, REPORT_TO_NEWSEVENT_SUCCESS, REPORT_TO_NEWSEVENT_FAILURE,
} from './types';

export function* GetNewsEventCategorySaga() {
  try {
    const response = yield getNewsEventCategory();
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
    yield put({ type: GET_NEWSEVENT_CATEGORY_SUCCESS, data });
  } catch (e) {
    yield put({ type: GET_NEWSEVENT_CATEGORY_FAILURE });
  }
}

export function* RegisterNewsEventSaga(action) {
  try {
    const response = yield registerNewsEvent(action.sendData);
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
    yield put({ type: REGISTER_NEWSEVENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: REGISTER_NEWSEVENT_FAILURE });
  }
}

export function* UpdateNewsEventSaga(action) {
  try {
    const response = yield updateNewsEvent(action.sendData);
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
    yield put({ type: UPDATE_NEWSEVENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: UPDATE_NEWSEVENT_FAILURE });
  }
}

export function* DeleteNewsEventSaga(action) {
  try {
    const response = yield deleteNewsEvent(action.sendData);
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
    yield put({ type: DELETE_NEWSEVENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: DELETE_NEWSEVENT_FAILURE });
  }
}

export function* GetNewsEventSaga(action) {
  try {
    const response = yield getNewsEvent(action.sendData);

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
    yield put({ type: GET_NEWSEVENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: GET_NEWSEVENT_FAILURE });
  }
}

export function* ReportToNewsEventCommentSaga(action) {
  try {
    const response = yield reportToNewsEventComment(action.sendData);

    let data = {}
    if (!response.err) {  // success
      data = {
        data: response.data,
        err: response.err,
        message: response.message
      }
    }
    else {  // fail
      data = {
        data: null,
        err: response.err,
        message: response.message
      }
    }
    yield put({ type: REPORT_TO_NEWSEVENT_COMMENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: REPORT_TO_NEWSEVENT_COMMENT_FAILURE });
  }
}

export function* ReportToNewsEventSaga(action) {
  try {
    const response = yield reportToNewsEvent(action.sendData);

    let data = {}
    if (response.err == false) {  // success
      data = {
        data: response.data,
        err: response.err,
        message: response.message
      }
    }
    else {  // fail
      data = {
        data: null,
        err: response.err,
        message: response.message
      }
    }
    yield put({ type: REPORT_TO_NEWSEVENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: REPORT_TO_NEWSEVENT_FAILURE });
  }
}

export function* SendCommentToNewsEventSaga(action) {
  try {
    const response = yield sendCommentToNewsEvent(action.sendData);
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
    yield put({ type: SEND_COMMENT_TO_NEWSEVENT_SUCCESS, data });
  } catch (e) {
    yield put({ type: SEND_COMMENT_TO_NEWSEVENT_FAILURE });
  }
}
