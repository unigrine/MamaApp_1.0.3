import {
    GET_NOTICE, SET_DEFAULT_VALUE_NOTICE
} from './types';

// 공지사항 얻기
export function GetNoticeAction() {
  return {
    type: GET_NOTICE,
  };
}

// 공지사항 얻기
export function SetDefaultValueNoticeAction(data) {
  return {
    type: SET_DEFAULT_VALUE_NOTICE,
    data
  };
}
