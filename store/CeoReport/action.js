import {
  GET_CEO_REPORT,
  UPDATE_CEO_REPORT,
  DELETE_CEO_REPORT,
  REPLY_CEO_REPORT,
  UPDATE_REPLY_BY_CEO,
  DELETE_REPLY_BY_CEO, REPORT_HOPE_TO_CEO, SET_DEFAULT_VALUE_CEO_REPORT, REPORT_HOPE_TO_CEO_BY_CUSTOMER
} from './types';


// 해당 가게의 모든 사장님께 바란다 얻기
export function GetCeoReportInfoAction(sendData) {
  return {
    type: GET_CEO_REPORT,
    sendData: sendData
  }
}

// 소비자가 쓴 사장님께 바란다 업데이트(해당 아이디의 것만)
export function UpdateCeoReportAction(sendData) {
  return {
    type: UPDATE_CEO_REPORT,
    sendData: sendData
  }
}

// 소비자가 쓴 사장님께 바란다 삭제 (해당 아이디의 것만)
export function DeleteCeoReportAction(sendData) {
  return {
    type: DELETE_CEO_REPORT,
    sendData: sendData
  }
}

//  소상공인이 해당 사장님께 바란다에 답장하기
export function ReplyCeoReportAction(sendData) {
  return {
    type: REPLY_CEO_REPORT,
    sendData: sendData
  }
}

//  소상공인이 해당 사장님께 바란다에 답장했던것 다시 업데이트
export function UpdateReplyByCeoAction(sendData) {
  return {
    type: UPDATE_REPLY_BY_CEO,
    sendData: sendData
  }
}

// 소비자가 쓴 사장님께 바란다에 답장했던것 삭제 (해당 아이디의 것만)
export function DeleteReplyByCeoAction(sendData) {
  return {
    type: DELETE_REPLY_BY_CEO,
    sendData: sendData
  }
}

// 소비자가 쓴 사장님께 바란다 신고
export function ReportCeoReportAction(sendData) {
  return {
    type: REPORT_HOPE_TO_CEO,
    sendData: sendData
  }
}

export function SetDefaultValueCeoReportAction(data) {
  return {
    type: SET_DEFAULT_VALUE_CEO_REPORT,
    data
  }
}

export function ReportHopeToCeoByCustomerAction(sendData) {
  return {
    type: REPORT_HOPE_TO_CEO_BY_CUSTOMER,
    sendData
  }
}
