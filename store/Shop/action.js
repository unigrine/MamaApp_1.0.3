import {
  GET_BUSINESS_CATEGORY,
  GET_SHOP_INFO,
  UPDATE_SHOP_INFO,
  REGISTER_SHOP_INFO,
  UPDATE_MARK_IMAGE,
  REPORT_TO_CEO,
  GET_SHOP_INFO_BY_SHOPID,
  UPDATE_BUSINESS_INFO,
  SET_DEFAULT_VALUE_SHOP,
  SET_SELECTED_ADDRESS,
  UPDATE_PHONE_VERIFICATION,
  UPDATE_EMAIL_VERIFICATION
} from './types';


export function GetShopInfoByShopIdAction(sendData) {
  return {
    type: GET_SHOP_INFO_BY_SHOPID,
    sendData: sendData
  };
}

export function GetShopInfoAction(sendData) {
  return {
    type: GET_SHOP_INFO,
    sendData: sendData
  };
}

export function GetBusinessCategoryAction() {
  return {
    type: GET_BUSINESS_CATEGORY,
  };
}

export function UpdateShopInfoAction(sendData) {
  return {
    type: UPDATE_SHOP_INFO,
    sendData: sendData
  };
}

export function RegisterShopInfoAction(sendData) {
  return {
    type: REGISTER_SHOP_INFO,
    sendData: sendData
  };
}

export function UploadMarkImageAction(sendData) {
  return {
    type: UPDATE_MARK_IMAGE,
    sendData: sendData
  };
}

export function ReportToCeoAction(sendData) {
  return {
    type: REPORT_TO_CEO,
    sendData: sendData
  };
}

export function UpdateBusinessInfoAction(sendData) {
  return {
    type: UPDATE_BUSINESS_INFO,
    sendData: sendData
  };
}

export function SetDefaultValueShopAction(data) {
  return {
    type: SET_DEFAULT_VALUE_SHOP,
    data
  };
}

export function SetSelectedAddressAction(data) {
  return {
    type: SET_SELECTED_ADDRESS,
    data
  };
}

export function UpdatePhoneVerificationAction(sendData) {
  return {
    type: UPDATE_PHONE_VERIFICATION,
    sendData: sendData
  };
}

export function UpdateEmailVerificationAction(sendData) {
  return {
    type: UPDATE_EMAIL_VERIFICATION,
    sendData: sendData
  };
}
