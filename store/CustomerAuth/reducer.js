import {
    LOGIN_CUSTOMER,
    LOGIN_CUSTOMER_FAILURE,
    LOGIN_CUSTOMER_SUCCESS,
    REGISTER_CUSTOMER_ONESIGNALID,
    REGISTER_CUSTOMER_ONESIGNALID_SUCCESS,
    REGISTER_CUSTOMER_ONESIGNALID_FAILURE, SET_CUSTOMER_AUTH, SET_DEFAULT_VALUE_CUSTOMER_AUTH,
} from './types';

export const defaultState = {
    token: null,
    customer_id: null,
    social_id: null,
    social_type: null,
    status: -2,
    onesignal_uid: null,  // 마마 서버에 보관데 인덱스
    isLoading: false,
    isLoadingOneSingalId: false
};

export const customer = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_CUSTOMER_SUCCESS:
            return {
                ...state,
                token: action.data.token,
                customer_id: action.data?.customer_id,
                social_id: action.data?.social_id,
                social_type: action.data?.social_type,
                status: action.data?.status,
                isLoading: false
            };
        case LOGIN_CUSTOMER_FAILURE:
            return {
                ...state,
                token: null,
                customer_id: null,
                social_id: null,
                social_type: null,
                status: -1,
                isLoading: false
            }
        case LOGIN_CUSTOMER:
            return {
                ...state,
                isLoading: true,
                token: null,
                customer_id: null,
                social_id: null,
                social_type: null,
                status: -2,
            }
        case REGISTER_CUSTOMER_ONESIGNALID_SUCCESS:
            return {
                ...state,
                onesignal_uid: action.data.onesignal_uid,
                status: action.data.status,
                isLoadingOneSingalId: false
            };
        case REGISTER_CUSTOMER_ONESIGNALID_FAILURE:
            return {
                ...state,
                isLoadingOneSingalId: false
            }
        case REGISTER_CUSTOMER_ONESIGNALID:
            return {
                ...state,
                isLoadingOneSingalId: true,
            }
        case SET_CUSTOMER_AUTH:
            return {
                ...state,
                token: action.data.token,
                customer_id: action.data?.customer_id,
                social_id: action.data?.social_id,
                social_type: action.data?.social_type,
                // status: action.data?.status,
            };
        case SET_DEFAULT_VALUE_CUSTOMER_AUTH:
            return defaultState
        default:
            return state;
    }
};
