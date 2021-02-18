import {
  GET_NEWSEVENT_CATEGORY,
  GET_NEWSEVENT_CATEGORY_SUCCESS,
  GET_NEWSEVENT_CATEGORY_FAILURE,
  REGISTER_NEWSEVENT,
  REGISTER_NEWSEVENT_SUCCESS,
  REGISTER_NEWSEVENT_FAILURE,
  UPDATE_NEWSEVENT,
  UPDATE_NEWSEVENT_SUCCESS,
  UPDATE_NEWSEVENT_FAILURE,
  GET_NEWSEVENT,
  GET_NEWSEVENT_SUCCESS,
  GET_NEWSEVENT_FAILURE,
  DELETE_NEWSEVENT,
  DELETE_NEWSEVENT_SUCCESS,
  DELETE_NEWSEVENT_FAILURE,
  REPORT_TO_NEWSEVENT_COMMENT,
  REPORT_TO_NEWSEVENT_COMMENT_SUCCESS,
  REPORT_TO_NEWSEVENT_COMMENT_FAILURE,
  SEND_COMMENT_TO_NEWSEVENT_FAILURE,
  SEND_COMMENT_TO_NEWSEVENT_SUCCESS,
  SEND_COMMENT_TO_NEWSEVENT,
  REPORT_TO_NEWSEVENT,
  REPORT_TO_NEWSEVENT_SUCCESS,
  REPORT_TO_NEWSEVENT_FAILURE,
  SET_IS_COMMENT_LOADING,
  SET_DEFAULT_VALUE_NEWSEVNET,
  UPDATE_NEWSEVNET_REPLY_CNT,
  UPDATE_SHOP_NEWSEVNET_REPLY_CNT,
} from './types';

export const defaultState = {
  isLoading: false,
  isUpdateLoading: false,
  isDeleteLoading: false,
  isReportLoading: false,
  isCommentLoading: false,
  err: false,
  message: '',
  news_event_category: null,
  news_event_list: null,
};
export const newsevent = (state = defaultState, action) => {
  switch (action.type) {
    case GET_NEWSEVENT_CATEGORY:
      return {
        ...state,
        isLoading: true,
      }
    case GET_NEWSEVENT_CATEGORY_SUCCESS:
      return {
        ...state,
        news_event_category: action.data?.data,
        err: action.data.err,
        isLoading: false
    }
    case GET_NEWSEVENT_CATEGORY_FAILURE:
      return {
        ...state,
        news_event_category: null,
        err: action.data.err,
        isLoading: false
      }
    case REGISTER_NEWSEVENT:
      return {
        ...state,
        isUpdateLoading: true,
      }
    case REGISTER_NEWSEVENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isUpdateLoading: false
    }
    case REGISTER_NEWSEVENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isUpdateLoading: false
      }
    case UPDATE_NEWSEVENT:
      return {
        ...state,
        isUpdateLoading: true,
      }
    case UPDATE_NEWSEVENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isUpdateLoading: false
    }
    case UPDATE_NEWSEVENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isUpdateLoading: false
      }
    case DELETE_NEWSEVENT:
      return {
        ...state,
        isDeleteLoading: true,
      }
    case DELETE_NEWSEVENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isDeleteLoading: false
    }
    case DELETE_NEWSEVENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isDeleteLoading: false
      }
    case GET_NEWSEVENT:
      return {
        ...state,
        isLoading: true,
      }
    case GET_NEWSEVENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        news_event_list: action.data.data,
        isLoading: false
    }
    case GET_NEWSEVENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        news_event_list: null,
        isLoading: false
      }
    case REPORT_TO_NEWSEVENT_COMMENT:
      return {
        ...state,
        isReportLoading: true,
      }
    case REPORT_TO_NEWSEVENT_COMMENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
    }
    case REPORT_TO_NEWSEVENT_COMMENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case REPORT_TO_NEWSEVENT:
      return {
        ...state,
        isReportLoading: true,
      }
    case REPORT_TO_NEWSEVENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case REPORT_TO_NEWSEVENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        message: action.data.message,
        isReportLoading: false
      }
    case SEND_COMMENT_TO_NEWSEVENT:
      return {
        ...state,
        isCommentLoading: true,
      }
    case SEND_COMMENT_TO_NEWSEVENT_SUCCESS:
      return {
        ...state,
        err: action.data.err,
        isCommentLoading: false
      }
    case SEND_COMMENT_TO_NEWSEVENT_FAILURE:
      return {
        ...state,
        err: action.data.err,
        isCommentLoading: false
      }
    case SET_IS_COMMENT_LOADING:
      return {
        ...state,
        isCommentLoading: action.data,
      }
    case UPDATE_SHOP_NEWSEVNET_REPLY_CNT:
      const {replyCnt, newsId} = action.data;
      let newsEventList = state.news_event_list;
      let findIndex = newsEventList.findIndex((item) => (item?.newsId === newsId) && item?.replyCnt !== replyCnt);

      if (findIndex !== -1) {
        newsEventList[findIndex].replyCnt = replyCnt;

        return {
          ...state,
          news_event_list: newsEventList,
        }
      }
      else {
        return {
          ...state
        }
      }
    case SET_DEFAULT_VALUE_NEWSEVNET:
      return defaultState;
    default:
      return state;
  }
};
