import {
  GET_NEWS_EVENTS,
  GET_NEWS_EVENTS_SUCCESS,
  GET_NEWS_EVENTS_FAILURE,
  GET_BUSINESS_CATEGORY,
  GET_BUSINESS_CATEGORY_SUCCESS,
  GET_BUSINESS_CATEGORY_FAILURE,
  UPDATE_SHOP_INFO,
  UPDATE_SHOP_INFO_SUCCESS,
  UPDATE_SHOP_INFO_FAILURE,
  REGISTER_SHOP_INFO,
  REGISTER_SHOP_INFO_SUCCESS,
  REGISTER_SHOP_INFO_FAILURE,
  UPDATE_MARK_IMAGE,
  UPDATE_MARK_IMAGE_SUCCESS,
  UPDATE_MARK_IMAGE_FAILURE,
  GET_FAVORITE_NEWS_EVENTS,
  GET_FAVORITE_NEWS_EVENTS_FAILURE,
  GET_FAVORITE_NEWS_EVENTS_SUCCESS,
  SET_DEFAULT_VALUE_HOME,
  UPDATE_NEWSEVNET_REPLY_CNT,
  UPDATE_FAVORITE_NEWSEVNET_REPLY_CNT,
  SET_IS_LOADING_NEWS_EVENTS,
  UPDATE_FAVORITE_NEWSEVNET_FAVORITE,
  UPDATE_NEWSEVNET_FAVORITE
} from './types';

export const defaultState = {
  news_events: [],      // all news and event data
  news_events_fav: [],  // favorite data
  isSearchLoading: false,
  isLoading: false,
  isUpdateLoading: false,
  isUploadImageLoading: false,
  err: false,
  businessCategory: []
};
export const home = (state = defaultState, action) => {
  switch (action.type) {
    case SET_IS_LOADING_NEWS_EVENTS:
      return {
        ...state,
        isSearchLoading: action.data,
      }
    case GET_NEWS_EVENTS:
      return {
        ...state,
        isSearchLoading: true,
      }
    case GET_FAVORITE_NEWS_EVENTS:
      return {
        ...state,
        isSearchLoading: true,
      }
    case GET_NEWS_EVENTS_SUCCESS:
      return {
        ...state,
        news_events: action.data?.data?.shops,
        err: action?.data?.err,
        isSearchLoading: false
      }
    case GET_FAVORITE_NEWS_EVENTS_SUCCESS:
      return {
        ...state,
        news_events_fav: action.data?.data?.shops,
        err: action?.data?.err,
        isSearchLoading: false
      }
    case GET_NEWS_EVENTS_FAILURE:
      return {
        ...state,
        news_events: null,
        err: action?.data?.err,
        isSearchLoading: false
      }
    case GET_FAVORITE_NEWS_EVENTS_FAILURE:
      return {
        ...state,
        news_events_fav: null,
        err: action?.data?.err,
        isSearchLoading: false
      }
    case UPDATE_SHOP_INFO:
      return {
        ...state,
        isUpdateLoading: true,
      }
    case UPDATE_SHOP_INFO_SUCCESS:
      return {
        ...state,
        news_events: action.data?.news_events,
        err: action?.data?.err,
        isUpdateLoading: false
    }
    case UPDATE_SHOP_INFO_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isUpdateLoading: false
      }
    case UPDATE_MARK_IMAGE:
      return {
        ...state,
        isUploadImageLoading: true,
      }
    case UPDATE_MARK_IMAGE_SUCCESS:
      return {
        ...state,
        news_events: action.data?.news_events,
        err: action?.data?.err,
        isUploadImageLoading: false
    }
    case UPDATE_MARK_IMAGE_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isUploadImageLoading: false
      }
    case REGISTER_SHOP_INFO:
      return {
        ...state,
        isUpdateLoading: true,
      }
    case REGISTER_SHOP_INFO_SUCCESS:
      return {
        ...state,
        news_events: action.data?.news_events,
        err: action?.data?.err,
        isUpdateLoading: false
    }
    case REGISTER_SHOP_INFO_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isUpdateLoading: false
      }
    case UPDATE_NEWSEVNET_REPLY_CNT:
      const newsEventResult = inspectChangedReplyCnt(action.data, state.news_events);
      if (newsEventResult.isChanged) {
        return {
          ...state,
          news_events: newsEventResult.resultList,
        }
      }
      else  {
        return {
          ...state
        }
      }
    case UPDATE_FAVORITE_NEWSEVNET_REPLY_CNT:
      const favoriteNewsEventResult = inspectChangedReplyCnt(action.data, state.news_events_fav);
      if (favoriteNewsEventResult.isChanged) {
        return {
          ...state,
          news_events_fav: favoriteNewsEventResult.resultList,
        }
      }
      else  {
        return {
          ...state
        }
      }
    case UPDATE_NEWSEVNET_FAVORITE:
      const newsEventFavoriteResult = updateNewEventsFavorite(action.data, state.news_events);
      return {
        ...state,
        news_events: newsEventFavoriteResult,
      }
    case UPDATE_FAVORITE_NEWSEVNET_FAVORITE:
      const favoriteNewsEventFavoriteResult = updateNewEventsFavorite(action.data, state.news_events_fav);
      return {
        ...state,
        news_events_fav: favoriteNewsEventFavoriteResult,
      }
    case SET_DEFAULT_VALUE_HOME:
      return defaultState;
    default:
      return state;
  }
};

//news_events_fav
const inspectChangedReplyCnt = (newData, newsEventList) => {
  const {replyCnt, newsId} = newData;
  let findIndex = newsEventList.findIndex((item) => (item?.newsId === newsId) && item?.replyCnt !== replyCnt);

  if (findIndex !== -1) {
    newsEventList[findIndex].replyCnt = replyCnt;

    return {
      isChanged: true,
      resultList: newsEventList
    }
  }
  else {
    return {
      isChanged: false
    }
  }
}

const updateNewEventsFavorite = (data, newsEventList) => {
  const { shop_id, action, screen } = data;
  console.log('updateNewEventsFavorite', screen);
  let tempNewsEventList = [];
  if (screen === 'FAVORITE') {
    newsEventList.map((item, index) => {
      if (item.shop_id !== shop_id) {
        tempNewsEventList.push(item);
      }
    });
  }
  else {
    newsEventList.map((item, index) => {
      if (item.shop_id === shop_id) {
        switch (action) {
          case 'DELETED':
            tempNewsEventList.push({
              ...item,
              favoriteCnt: 0
            });
            break;
          case 'ADDED':
            tempNewsEventList.push({
              ...item,
              favoriteCnt: 1
            });
            break;
        }
      }
      else {
        tempNewsEventList.push(item);
      }
    });
  }

  return tempNewsEventList;
}
