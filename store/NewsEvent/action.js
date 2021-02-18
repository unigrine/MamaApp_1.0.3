import {
    GET_NEWSEVENT_CATEGORY,
    REGISTER_NEWSEVENT,
    UPDATE_NEWSEVENT,
    GET_NEWSEVENT,
    DELETE_NEWSEVENT,
    REPORT_TO_NEWSEVENT_COMMENT,
    SEND_COMMENT_TO_NEWSEVENT,
    SET_IS_COMMENT_LOADING,
    REPORT_TO_NEWSEVENT,
    SET_DEFAULT_VALUE_NEWSEVNET,
    UPDATE_SHOP_NEWSEVNET_REPLY_CNT
} from './types';

// 이벤트/뉴스에 입장할 때 카테고리목록 불러오기
export function GetNewsEventCategoryAction() {
  return {
    type: GET_NEWSEVENT_CATEGORY,
  };
}

// 뉴스/이벤트 한개 새로 등록
export function RegisterNewsEventAction(sendData) {
  return {
    type: REGISTER_NEWSEVENT,
    sendData: sendData
  }
}

// 내 가게의 모든 뉴스/이벤트 얻기
export function GetNewsEventAction(sendData) {
  return {
    type: GET_NEWSEVENT,
    sendData: sendData
  }
}

// 특정한 뉴스/이벤트 업데이트
export function UpdateNewsEventAction(sendData) {
  return {
    type: UPDATE_NEWSEVENT,
    sendData: sendData
  }
}

// 특정한 뉴스/이벤트 삭제
export function DeleteNewsEventAction(sendData) {
  return {
    type: DELETE_NEWSEVENT,
    sendData: sendData
  }
}

// 뉴스/이벤트 댓글 달기
export function SendCommentToNewsEventAction(sendData) {
    return {
        type: SEND_COMMENT_TO_NEWSEVENT,
        sendData: sendData
    }
}

// 소비자가 뉴스/이벤트에 신고하기(댓글달기)
export function ReportToNewsEventCommentAction(sendData) {
  return {
    type: REPORT_TO_NEWSEVENT_COMMENT,
    sendData: sendData
  }
}

// 소비자가 뉴스/이벤트에 신고하기(게시글)
export function ReportToNewsEventAction(sendData) {
    return {
        type: REPORT_TO_NEWSEVENT,
        sendData: sendData
    }
}

// 소비자가 뉴스/이벤트에 신고하기(게시글)
export function SetIsCommentLoadingAction(data) {
    return {
        type: SET_IS_COMMENT_LOADING,
        data
    }
}

// 뉴스/이벤트 초기화
export function SetDefaultValueNewsEventAction(data) {
    return {
        type: SET_DEFAULT_VALUE_NEWSEVNET,
        data
    }
}

// replyCnt update
export function UpdateShopNewsEventReplyCntAction(data) {
    return {
        type: UPDATE_SHOP_NEWSEVNET_REPLY_CNT,
        data
    }
}
