import { put, all } from 'redux-saga/effects';
import {
  getCeoReport,
  updateCeoReport,
  replyCeoReport,
  deleteCeoReport,
  updateReplyByCeo,
  deleteReplyByCeo,
  reportHopeToCeoByCeo,
  reportHopeToCeoByCustomer
} from './services';
import {
  GET_CEO_REPORT_SUCCESS,
  GET_CEO_REPORT_FAILURE,
  UPDATE_CEO_REPORT_SUCCESS,
  UPDATE_CEO_REPORT_FAILURE,
  DELETE_CEO_REPORT_SUCCESS,
  DELETE_CEO_REPORT_FAILURE,
  REPLY_CEO_REPORT_FAILURE,
  REPLY_CEO_REPORT_SUCCESS,
  UPDATE_REPLY_BY_CEO,
  UPDATE_REPLY_BY_CEO_SUCCESS,
  UPDATE_REPLY_BY_CEO_FAILURE,
  DELETE_REPLY_BY_CEO_SUCCESS,
  DELETE_REPLY_BY_CEO_FAILURE,
  REPORT_HOPE_TO_CEO_SUCCESS,
  REPORT_HOPE_TO_CEO_FAILURE,
  REPORT_HOPE_TO_CEO_BY_CUSTOMER_SUCCESS,
  REPORT_HOPE_TO_CEO_BY_CUSTOMER_FAILURE
} from './types';


export function* GetCeoReportSaga(action) {
  try {
    const response = yield getCeoReport(action.sendData);
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
    yield put({ type: GET_CEO_REPORT_SUCCESS, data });
  } catch (e) {
    yield put({ type: GET_CEO_REPORT_FAILURE });
  }
}

export function* UpdateCeoReportSaga(action) {
  try {
    const response = yield updateCeoReport(action.sendData);
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
    yield put({ type: UPDATE_CEO_REPORT_SUCCESS, data });
  } catch (e) {
    yield put({ type: UPDATE_CEO_REPORT_FAILURE });
  }
}

export function* DeleteCeoReportSaga(action) {
  try {
    const response = yield deleteCeoReport(action.sendData);
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
    yield put({ type: DELETE_CEO_REPORT_SUCCESS, data });
  } catch (e) {
    yield put({ type: DELETE_CEO_REPORT_FAILURE });
  }
}


export function* ReplyCeoReportSaga(action) {
  try {
    const response = yield replyCeoReport(action.sendData);
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
    yield put({ type: REPLY_CEO_REPORT_SUCCESS, data });
  } catch (e) {
    yield put({ type: REPLY_CEO_REPORT_FAILURE });
  }
}

export function* UpdateReplyByCeoSaga(action) {
  try {
    const response = yield updateReplyByCeo(action.sendData);
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
    yield put({ type: UPDATE_REPLY_BY_CEO_SUCCESS, data });
  } catch (e) {
    yield put({ type: UPDATE_REPLY_BY_CEO_FAILURE });
  }
}

export function* DeleteReplyByCeoSaga(action) {
  try {
    const response = yield deleteReplyByCeo(action.sendData);
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
    yield put({ type: DELETE_REPLY_BY_CEO_SUCCESS, data });
  } catch (e) {
    yield put({ type: DELETE_REPLY_BY_CEO_FAILURE });
  }
}

export function* ReportHopeToCeoByCeoSaga(action) {
  try {
    const response = yield reportHopeToCeoByCeo(action.sendData);
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
    yield put({ type: REPORT_HOPE_TO_CEO_SUCCESS, data });
  } catch (e) {
    yield put({ type: REPORT_HOPE_TO_CEO_FAILURE });
  }
}

export function* ReportHopeToCeoByCustomerSaga(action) {
  try {
    const response = yield reportHopeToCeoByCustomer(action.sendData);

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
    yield put({ type: REPORT_HOPE_TO_CEO_BY_CUSTOMER_SUCCESS, data });
  } catch (e) {
    yield put({ type: REPORT_HOPE_TO_CEO_BY_CUSTOMER_FAILURE });
  }
}
