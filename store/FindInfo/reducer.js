import {
  FIND_ID_ADDRESS, FIND_ID_ADDRESS_SUCCESS, FIND_ID_ADDRESS_FAILURE,
  FIND_ID_EMAIL, FIND_ID_EMAIL_SUCCESS, FIND_ID_EMAIL_FAILURE,
  FIND_ID_PHONE, FIND_ID_PHONE_SUCCESS, FIND_ID_PHONE_FAILURE,
  FIND_PASSWORD_PHONE, FIND_PASSWORD_PHONE_SUCCESS, FIND_PASSWORD_PHONE_FAILURE,
  FIND_PASSWORD_EMAIL, FIND_PASSWORD_EMAIL_SUCCESS, FIND_PASSWORD_EMAIL_FAILURE,
  CHANGE_SELLER_ID, CHANGE_SELLER_ID_SUCCESS, CHANGE_SELLER_ID_FAILURE,
  CHANGE_SELLER_PASSWORD, CHANGE_SELLER_PASSWORD_SUCCESS, CHANGE_SELLER_PASSWORD_FAILURE,
  CHANGE_SHOP_ADDRESS, CHANGE_SHOP_ADDRESS_SUCCESS, CHANGE_SHOP_ADDRESS_FAILURE, SET_DEFAULT_VALUE_FIND_INFO,
} from './types';

export const defaultState = {
  isLoading: false,
  err: false,
  message: "",
  yourid: null,
  yourpw: null,
};

export const findinfo = (state = defaultState, action) => {
  switch (action.type) {
    case FIND_ID_ADDRESS_SUCCESS:
      return {
        ...state,
        yourid: action.data?.yourid,
        err: action?.data?.err,
        isLoading: false
    };
    case FIND_ID_ADDRESS_FAILURE:
      return {
        ...state,
        yourid: null,
        err: action?.data?.err,
        isLoading: false
    }
    case FIND_ID_ADDRESS:
      return {
        ...state,
        isLoading: true,
      }
    case FIND_ID_PHONE_SUCCESS:
      return {
        ...state,
        yourid: action.data?.yourid,
        err: action?.data?.err,
        isLoading: false
    };
    case FIND_ID_PHONE_FAILURE:
      return {
        ...state,
        yourid: null,
        err: action?.data?.err,
        isLoading: false
    }
    case FIND_ID_PHONE:
      return {
        ...state,
        isLoading: true,
      }
    case FIND_ID_EMAIL_SUCCESS:
      return {
        ...state,
        yourid: action.data?.yourid,
        err: action?.data?.err,
        isLoading: false
    };
    case FIND_ID_EMAIL_FAILURE:
      return {
        ...state,
        yourid: null,
        err: action?.data?.err,
        isLoading: false
    }
    case FIND_ID_EMAIL:
      return {
        ...state,
        isLoading: true,
      }
    case FIND_PASSWORD_EMAIL_SUCCESS:
      return {
        ...state,
        yourpw: action.data?.yourpw,
        err: action?.data?.err,
        isLoading: false
    };
    case FIND_PASSWORD_EMAIL_FAILURE:
      return {
        ...state,
        yourpw: null,
        err: action?.data?.err,
        isLoading: false
    }
    case FIND_PASSWORD_EMAIL:
      return {
        ...state,
        isLoading: true,
      }
    case FIND_PASSWORD_PHONE_SUCCESS:
      return {
        ...state,
        yourpw: action.data?.yourpw,
        err: action?.data?.err,
        isLoading: false
    };
    case FIND_PASSWORD_PHONE_FAILURE:
      return {
        ...state,
        yourpw: null,
        err: action?.data?.err,
        isLoading: false
    }
    case FIND_PASSWORD_PHONE:
      return {
        ...state,
        isLoading: true,
      }
    case CHANGE_SELLER_ID_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    };
    case CHANGE_SELLER_ID_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    }
    case CHANGE_SELLER_ID:
      return {
        ...state,
        isLoading: true,
      }
    case CHANGE_SELLER_PASSWORD_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    };
    case CHANGE_SELLER_PASSWORD_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    }
    case CHANGE_SELLER_PASSWORD:
      return {
        ...state,
        isLoading: true,
      }
    case CHANGE_SHOP_ADDRESS_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    };
    case CHANGE_SHOP_ADDRESS_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isLoading: false
    }
    case CHANGE_SHOP_ADDRESS:
      return {
        ...state,
        isLoading: true,
      }
    case SET_DEFAULT_VALUE_FIND_INFO:
      return defaultState;
    default:
      return state;
  }
};
