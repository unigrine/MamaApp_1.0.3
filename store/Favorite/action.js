import {
  SET_FAVORITE,
  DELETE_FAVORITE, SET_DEFAULT_VALUE_FAVORITE,
} from './types';

export function SetFavoriteAction(sendData) {
  return {
    type: SET_FAVORITE,
    sendData: sendData
  };
}

export function DeleteFavoriteAction(sendData) {
  return {
    type: DELETE_FAVORITE,
    sendData: sendData
  };
}

export function SetDefaultValueFavoriteAction(data) {
  return {
    type: SET_DEFAULT_VALUE_FAVORITE,
    data
  };
}
