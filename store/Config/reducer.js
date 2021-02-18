import {
    SET_USER_STATUS, SET_USER_STATUS_SUCCESS, SET_USER_STATUS_FAILURE,
    SET_LOCATION, SET_LOCATION_SUCCESS, SET_LOCATION_FAILURE,
    SET_DEVICE_TOKEN, SET_DEVICE_TOKEN_SUCCESS, SET_DEVICE_TOKEN_FAILURE,
    SET_CURRENT_SCREEN, SET_CURRENT_SCREEN_FAILURE, SET_CURRENT_SCREEN_SUCCESS,
    ADD_ADDRESS_HISTORY,
    INIT_ADDRESS_HISTORY,
    REMOVE_ADDRESS_HISTORY,
    SET_ONESIGNAL_ID,
    SET_TERMS_AGREE, SET_CLICK_AREA, SET_ENTER_HOME, SET_DEFAULT_VALUE_CONFIG, SET_TAB_SCROLL_LOCK
} from './types';

export const defaultState = {
    error: null,
    isLoading: false,
    location: null,
    deviceid: null,
    address_list: [],
    address_history_list: [],
    onesignal_id: null,
    status: 'onboarding', // onboarding, customer_logged_in, ceo_logged_in, ceo_login_screen,
    isAgree: false,
    currentscreen: "MainScreen",
    isClickArea: false,
    isEnterHome: false,
    tabScrollLock: false
};

export const userstatus = (state = defaultState, action) => {
    let address_history_list = JSON.parse(JSON.stringify(state.address_history_list));

    switch (action.type) {
        case SET_USER_STATUS_SUCCESS:
            return {
                ...state,
                status: action.data.status,
                isLoading: false
            };
        case SET_USER_STATUS_FAILURE:
            return {
                ...state,
                status: -1,
                isLoading: false
            }
        case SET_USER_STATUS:
            return {
                ...state,
                isLoading: true,
                status: -2,
            }
        case SET_LOCATION_SUCCESS:
            return {
                ...state,
                location: action?.data,
                isLoading: false
            };
        case SET_LOCATION_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        case SET_LOCATION:
            return {
                ...state,
                isLoading: true,
            }
        case SET_DEVICE_TOKEN_SUCCESS:
            return {
                ...state,
                deviceid: action?.data,
                isLoading: false
            };
        case SET_DEVICE_TOKEN_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        case SET_DEVICE_TOKEN:
            return {
                ...state,
                isLoading: true,
            }
        case SET_CURRENT_SCREEN_SUCCESS:
            return {
                ...state,
                currentscreen: action?.data,
                isLoading: false
            };
        case SET_CURRENT_SCREEN_FAILURE:
            return {
                ...state,
                isLoading: false
            }
        case SET_CURRENT_SCREEN:
            return {
                ...state,
                isLoading: true,
            }
        case ADD_ADDRESS_HISTORY:
            let tempAddressHistoryList = address_history_list.filter(item =>
                item.address_name === action.data.address_name
            );

            if (tempAddressHistoryList.length < 1) {
                address_history_list.unshift(action.data);
            }

            return {
                ...state,
                address_history_list,
            };
        case INIT_ADDRESS_HISTORY:
            return {
                ...state,
                address_list: [],
            };
        case REMOVE_ADDRESS_HISTORY:
            const idx = address_history_list.findIndex(item => item.address_name === action.data.address_name);

            if (idx > -1) {
                address_history_list.splice(idx, 1);
            }

            return {
                ...state,
                address_history_list,
            };
        case SET_ONESIGNAL_ID:
            return {
                ...state,
                onesignal_id: action.data,
            };
        case SET_TERMS_AGREE:
            return {
                ...state,
                isAgree: action.data,
            };
        case SET_CLICK_AREA:
            return {
                ...state,
                isClickArea: action.data,
            };
        case SET_ENTER_HOME:
            return {
                ...state,
                isEnterHome: action.data,
            };
        case SET_TAB_SCROLL_LOCK:
            return {
                ...state,
                tabScrollLock: action.data
            }
        case SET_DEFAULT_VALUE_CONFIG:
            return defaultState;
        default:
            return state;
    }
};
