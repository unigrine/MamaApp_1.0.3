import {
    LOGIN_CUSTOMER,
    REGISTER_CUSTOMER_ONESIGNALID, SET_CUSTOMER_AUTH,
} from './types';

export function LoginCustomerAction(sendData) {
    return {
        type: LOGIN_CUSTOMER,
        sendData
    };
}

export function RegisterOneSingalIdAction(sendData) {
    return {
        type: REGISTER_CUSTOMER_ONESIGNALID,
        sendData
    };
}

export function SetCustomerAuthAction(data) {
    return {
        type: SET_CUSTOMER_AUTH,
        data
    };
}

export function SetDefaultValueCustomerAuthAction(data) {
    return {
        type: SET_DEFAULT_VALUE_CUSTOMER_AUTH,
        data
    };
}
