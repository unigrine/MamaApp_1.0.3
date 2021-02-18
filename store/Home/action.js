import {
  GET_NEWS_EVENTS,
  UPDATE_SHOP_INFO,
  REGISTER_SHOP_INFO,
  UPDATE_MARK_IMAGE,
  GET_FAVORITE_NEWS_EVENTS,
  SET_DEFAULT_VALUE_HOME,
  UPDATE_NEWSEVNET_REPLY_CNT,
  UPDATE_FAVORITE_NEWSEVNET_REPLY_CNT,
  SET_IS_LOADING_NEWS_EVENTS,
  UPDATE_NEWSEVNET_FAVORITE,
  UPDATE_FAVORITE_NEWSEVNET_FAVORITE
} from './types';

export function GetNewsEventsAction(sendData) {
  return {
    type: GET_NEWS_EVENTS,
    sendData: sendData
  };
}

export function GetFavoriteNewsEventsAction(sendData) {
  return {
    type: GET_FAVORITE_NEWS_EVENTS,
    sendData: sendData
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

export function SetDefaultValueHomeAction(data) {
  return {
    type: SET_DEFAULT_VALUE_HOME,
    data
  };
}

// replyCnt update
export function UpdateNewsEventReplyCntAction(data) {
  return {
    type: UPDATE_NEWSEVNET_REPLY_CNT,
    data
  }
}

// replyCnt update
export function UpdateFavoriteNewsEventReplyCntAction(data) {
  return {
    type: UPDATE_FAVORITE_NEWSEVNET_REPLY_CNT,
    data
  }
}

// isLoading update
export function SetIsLoadingNewsEventsAction(data) {
  return {
    type: SET_IS_LOADING_NEWS_EVENTS,
    data
  }
}

// news events favorite add/remove update
export function UpdateNewsEventsFavoriteAction(data) {
  return {
    type: UPDATE_NEWSEVNET_FAVORITE,
    data
  }
}

// favorite news events favorite add/remove update
export function UpdateFavoriteNewsEventsFavoriteAction(data) {
  return {
    type: UPDATE_FAVORITE_NEWSEVNET_FAVORITE,
    data
  }
}
