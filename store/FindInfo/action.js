import {
  FIND_ID_ADDRESS,
  FIND_ID_PHONE,
  FIND_ID_EMAIL,
  CHANGE_SELLER_ID,
  CHANGE_SELLER_PASSWORD,
  CHANGE_SHOP_ADDRESS,
  UPDATE_BUSINESS_INFO,
  FIND_PASSWORD_PHONE,
  FIND_PASSWORD_EMAIL, SET_DEFAULT_VALUE_FIND_INFO
} from './types';

export function FindIdByAddressAction(sendData) {
  return {
    type: FIND_ID_ADDRESS,
    sendData: sendData
  };
}

export function FindIdByPhoneAction(sendData) {
  return {
    type: FIND_ID_PHONE,
    sendData: sendData
  };
}

export function FindIdByEmailAction(sendData) {
  return {
    type: FIND_ID_EMAIL,
    sendData: sendData
  };
}

export function FindPasswordByEmailAction(sendData) {
  return {
    type: FIND_PASSWORD_EMAIL,
    sendData: sendData
  };
}

export function FindPasswordByPhoneAction(sendData) {
  return {
    type: FIND_PASSWORD_PHONE,
    sendData: sendData
  };
}



export function ChangeSellerIdAction(sendData) {
  return {
    type: CHANGE_SELLER_ID,
    sendData: sendData
  };
}

export function ChangePasswordAction(sendData) {
  return {
    type: CHANGE_SELLER_PASSWORD,
    sendData: sendData
  };
}

export function ChangeShopAddressAction(sendData) {
  return {
    type: CHANGE_SHOP_ADDRESS,
    sendData: sendData
  };
}

export function SetDefaultValueFindInfoAction(data) {
  return {
    type: SET_DEFAULT_VALUE_FIND_INFO,
    data
  };
}

