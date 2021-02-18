import {put, all} from 'redux-saga/effects';
import {loginCustomer, registerOneSignalId} from './services';
import {
    LOGIN_CUSTOMER_SUCCESS,
    LOGIN_CUSTOMER_FAILURE,
    REGISTER_CUSTOMER_ONESIGNALID_SUCCESS,
    REGISTER_CUSTOMER_ONESIGNALID_FAILURE,
} from './types';

export function* LoginCustomerSaga(action) {
    try {
        const response = yield loginCustomer(action.sendData);
        let data = {}
        if (!response.err) {  // success
            data = {
                token: response.token,
                customer_id: response.customer_id,
                social_id: response.social_id,
                social_type: action.sendData.social_type,
                device_player_id: response.device_player_id,
                status: response.err,
            }
        } else {  // fail
            data = {
                token: null,
                seller_id: null,
                status: response.err
            }
        }

        yield put({type: LOGIN_CUSTOMER_SUCCESS, data});

    } catch (e) {
        yield put({type: LOGIN_CUSTOMER_FAILURE});
    }
}

export function* RegisterCustomerOneSignalIdSaga(action) {
    try {
        const response = yield registerOneSignalId(action.sendData);
        let data = {}
        if (response.err == false) {  // success
            data = {
                onesignal_uid: response.data.id,
                status: response.err,
            }
        } else {  // fail
            data = {
                onesignal_uid: null,
                status: response.err
            }
        }

        yield put({type: REGISTER_CUSTOMER_ONESIGNALID_SUCCESS, data});
    } catch (e) {

        yield put({type: REGISTER_CUSTOMER_ONESIGNALID_FAILURE});

    }
}
