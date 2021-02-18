import {
  GET_SHOP_INFO,
  GET_SHOP_INFO_SUCCESS,
  GET_SHOP_INFO_FAILURE,
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
  REPORT_TO_CEO,
  REPORT_TO_CEO_SUCCESS,
  REPORT_TO_CEO_FAILURE,
  GET_SHOP_INFO_BY_SHOPID,
  GET_SHOP_INFO_BY_SHOPID_SUCCESS,
  GET_SHOP_INFO_BY_SHOPID_FAILURE,
  UPDATE_BUSINESS_INFO_SUCCESS,
  UPDATE_BUSINESS_INFO,
  UPDATE_BUSINESS_INFO_FAILURE,
  SET_DEFAULT_VALUE_SHOP,
  SET_SELECTED_ADDRESS,
  UPDATE_PHONE_VERIFICATION,
  UPDATE_PHONE_VERIFICATION_SUCCESS,
  UPDATE_PHONE_VERIFICATION_FAILURE,
  UPDATE_EMAIL_VERIFICATION, UPDATE_EMAIL_VERIFICATION_SUCCESS, UPDATE_EMAIL_VERIFICATION_FAILURE

} from './types';

export const defaultState = {
  shop_data: null,
  isLoading: false,
  isUpdateLoading: false,
  isUploadImageLoading: false,
  isReportToCeoLoading: false,
  err: false,
  businessCategory: null,
  isUpdateBusinessLoading: false,
  isUpdateVerificationLoading: false,
  selectedAddress: {}
};
export const shop = (state = defaultState, action) => {
  switch (action.type) {
    case GET_SHOP_INFO_BY_SHOPID:
      return {
        ...state,
        isLoading: true,
      }
    case GET_SHOP_INFO_BY_SHOPID_SUCCESS:
      return {
        ...state,
        shop_data: action.data?.shop_data,
        err: action?.data?.err,
        isLoading: false
    }
    case GET_SHOP_INFO_BY_SHOPID_FAILURE:
      return {
        ...state,
        shop_data: null,
        err: action?.data?.err,
        isLoading: false
      }
    case GET_SHOP_INFO:
      return {
        ...state,
        isLoading: true,
      }
    case GET_SHOP_INFO_SUCCESS:
      return {
        ...state,
        shop_data: action.data?.shop_data,
        err: action?.data?.err,
        isLoading: false
    }
    case GET_SHOP_INFO_FAILURE:
      return {
        ...state,
        shop_data: null,
        err: action?.data?.err,
        isLoading: false
      }
    case GET_BUSINESS_CATEGORY:
      return {
        ...state,
        isLoading: true,
      }
    case GET_BUSINESS_CATEGORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        businessCategory: action.response?.data
    }
    case GET_BUSINESS_CATEGORY_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case UPDATE_SHOP_INFO:
      return {
        ...state,
        isUpdateLoading: true,
      }
    case UPDATE_SHOP_INFO_SUCCESS:
      return {
        ...state,
        shop_data: action.data?.shop_data,
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
        shop_data: action.data?.shop_data,
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
        shop_data: action.data?.shop_data,
        err: action?.data?.err,
        isUpdateLoading: false
    }
    case REGISTER_SHOP_INFO_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isUpdateLoading: false
      }
    case REPORT_TO_CEO:
      return {
        ...state,
        isReportToCeoLoading: true,
      }
    case REPORT_TO_CEO_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isReportToCeoLoading: false
    }
    case REPORT_TO_CEO_FAILURE:
      return {
        ...state,
        err: action?.data?.err,
        isReportToCeoLoading: false
      }
    case UPDATE_BUSINESS_INFO_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isUpdateBusinessLoading: false
    };
    case UPDATE_BUSINESS_INFO_FAILURE:
      return {
        ...state,
        err: true,
        isUpdateBusinessLoading: false
    }
    case UPDATE_BUSINESS_INFO:
      return {
        ...state,
        isUpdateBusinessLoading: true,
        err: true,
      }
    case SET_DEFAULT_VALUE_SHOP:
      return {
        ...defaultState,
        businessCategory: state.businessCategory
      };
    case SET_SELECTED_ADDRESS:
      return {
        ...state,
        selectedAddress: action?.data
      };
    case UPDATE_PHONE_VERIFICATION:
      return {
        ...state,
        isUpdateVerificationLoading: true,
        err: true,
      }
    case UPDATE_PHONE_VERIFICATION_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isUpdateVerificationLoading: false
      };
    case UPDATE_PHONE_VERIFICATION_FAILURE:
      return {
        ...state,
        err: true,
        isUpdateVerificationLoading: false
      }
    case UPDATE_EMAIL_VERIFICATION:
      return {
        ...state,
        isUpdateVerificationLoading: true,
        err: true,
      }
    case UPDATE_EMAIL_VERIFICATION_SUCCESS:
      return {
        ...state,
        err: action?.data?.err,
        isUpdateVerificationLoading: false
      };
    case UPDATE_EMAIL_VERIFICATION_FAILURE:
      return {
        ...state,
        err: true,
        isUpdateVerificationLoading: false
      }
    default:
      return state;
  }
};
