import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    SET_SELLER_ID,
    REGISTER_CEO_ONESIGNAL_ID,
    REGISTER_CEO_ONESIGNAL_ID_SUCCESS,
    REGISTER_CEO_ONESIGNAL_ID_FAILURE,
    SET_DEFAULT_VALUE_CEO_AUTH
} from './types';

export const defaultState = {
    token: null,
    error: null,
    isLoading: false,
    isJoinLoading: false,
    username: null,
    password: null,
    seller_id: null,
    seller_uid: null,
    userName: null,
    onesignal_uid: null,
    err: false,
    status: -2,
};
export const session = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.data.token,
                seller_id: action.data.seller_id,
                seller_uid: action.data.seller_uid,
                err: action.data.err,
                isLoading: false
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                token: null,
                seller_id: null,
                seller_uid: null,
                name: null,
                err: true,
                isLoading: false
            }
        case LOGIN:
            return {
                ...state,
                isLoading: true,
                token: null,
                seller_id: null,
                seller_uid: null,
                name: null,
                err: true,
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                err: action.data.err,
                isJoinLoading: false
            };
        case REGISTER_FAILURE:
            return {
                ...state,
                isJoinLoading: false,
                err: true,
            }
        case REGISTER:
            return {
                ...state,
                isJoinLoading: true,
                err: false,
            }
        case SET_SELLER_ID:
            return {
                ...state,
                seller_id: action.seller_id
            }
        case REGISTER_CEO_ONESIGNAL_ID_SUCCESS:
            return {
                ...state,
                err: action.data.err,
                onesignal_uid: action.data.onesignal_uid,
                isOneSignalLoading: false
            };
        case REGISTER_CEO_ONESIGNAL_ID_FAILURE:
            return {
                ...state,
                isOneSignalLoading: false,
                err: true,
            }
        case REGISTER_CEO_ONESIGNAL_ID:
            return {
                ...state,
                isOneSignalLoading: true,
                err: true,
            }
        case SET_DEFAULT_VALUE_CEO_AUTH:
            return defaultState;
        default:
            return state;
    }
};
