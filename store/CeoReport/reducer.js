import {
  GET_CEO_REPORT,
  GET_CEO_REPORT_SUCCESS,
  GET_CEO_REPORT_FAILURE,
  UPDATE_CEO_REPORT,
  UPDATE_CEO_REPORT_SUCCESS,
  UPDATE_CEO_REPORT_FAILURE,
  DELETE_CEO_REPORT,
  DELETE_CEO_REPORT_SUCCESS,
  DELETE_CEO_REPORT_FAILURE,
  REPLY_CEO_REPORT,
  REPLY_CEO_REPORT_SUCCESS,
  REPLY_CEO_REPORT_FAILURE,
  UPDATE_REPLY_BY_CEO,
  UPDATE_REPLY_BY_CEO_SUCCESS,
  UPDATE_REPLY_BY_CEO_FAILURE,
  DELETE_REPLY_BY_CEO,
  DELETE_REPLY_BY_CEO_SUCCESS,
  DELETE_REPLY_BY_CEO_FAILURE,
  REPORT_HOPE_TO_CEO,
  REPORT_HOPE_TO_CEO_SUCCESS,
  REPORT_HOPE_TO_CEO_FAILURE,
  SET_DEFAULT_VALUE_CEO_REPORT,
  REPORT_HOPE_TO_CEO_BY_CUSTOMER,
  REPORT_HOPE_TO_CEO_BY_CUSTOMER_SUCCESS, REPORT_HOPE_TO_CEO_BY_CUSTOMER_FAILURE
} from './types';

export const defaultState = {
  isLoading: false,
  isUpdateLoading: false,
  isDeleteLoading: false,
  isReplyLoading: false,
  isUpdateReplyLoading: false,
  isReplyDeleteLoading: false,
  isReportLoading: false,
  err: false,
  message: '',
  ceo_report_list: null
};

export const ceoreport = (state = defaultState, action) => {
  switch (action.type) {
    case GET_CEO_REPORT:
      return {
        ...state,
        isLoading: true,
      }
    case GET_CEO_REPORT_SUCCESS:
      return {
        ...state,
        ceo_report_list: action.data?.data,
        err: action.data.err,
        isLoading: false
    }
    case GET_CEO_REPORT_FAILURE:
      return {
        ...state,
        ceo_report_list: null,
        err: action.data.err,
        isLoading: false
      }
    case UPDATE_CEO_REPORT:
      return {
        ...state,
        isUpdateLoading: true,
      }
    case UPDATE_CEO_REPORT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isUpdateLoading: false
    }
    case UPDATE_CEO_REPORT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isUpdateLoading: false
      }
    case REPLY_CEO_REPORT:
      return {
        ...state,
        isReplyLoading: true,
      }
    case REPLY_CEO_REPORT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isReplyLoading: false
    }
    case REPLY_CEO_REPORT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isUpdateReplyLoading: false
      }
    case UPDATE_REPLY_BY_CEO:
      return {
        ...state,
        isUpdateReplyLoading: true,
      }
    case UPDATE_REPLY_BY_CEO_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isUpdateReplyLoading: false
    }
    case UPDATE_REPLY_BY_CEO_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isReplyLoading: false
      }
    case DELETE_REPLY_BY_CEO:
      return {
        ...state,
        isReplyDeleteLoading: true,
      }
    case DELETE_REPLY_BY_CEO_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isReplyDeleteLoading: false
    }
    case DELETE_REPLY_BY_CEO_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isReplyDeleteLoading: false
      }
    case DELETE_CEO_REPORT:
      return {
        ...state,
        isDeleteLoading: true,
      }
    case DELETE_CEO_REPORT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isDeleteLoading: false
    }
    case DELETE_CEO_REPORT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isDeleteLoading: false
      }
    case REPORT_HOPE_TO_CEO:
      return {
        ...state,
        isReportLoading: true,
      }
    case REPORT_HOPE_TO_CEO_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case REPORT_HOPE_TO_CEO_FAILURE:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case REPORT_HOPE_TO_CEO_BY_CUSTOMER:
      return {
        ...state,
        isReportLoading: true,
      }
    case REPORT_HOPE_TO_CEO_BY_CUSTOMER_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case REPORT_HOPE_TO_CEO_BY_CUSTOMER_FAILURE:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case SET_DEFAULT_VALUE_CEO_REPORT:
      return defaultState
    default:
      return state;
  }
};
