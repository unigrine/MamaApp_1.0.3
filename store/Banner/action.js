import {
  GET_BANNER_TEXT, SET_DEFAULT_VALUE_BANNER
} from './types';

// 공지사항 얻기
export function GetBannerTextAction() {
  return {
    type: GET_BANNER_TEXT,
  };
}

// 공지사항 초기화
export function SetDefaultValueBannerAction(data) {
  return {
    type: SET_DEFAULT_VALUE_BANNER,
    data
  }
}
