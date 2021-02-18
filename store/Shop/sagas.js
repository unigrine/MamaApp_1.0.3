import {put, all} from 'redux-saga/effects';
import {
    getShopInfo, getBusinessCategory, updateShopInfo, registerShopInfo, updateMarkImage, reportToCeo,
    getShopInfoByShopId, updateBusinessInfo, updatePhoneVerification, updateEmailVerification
} from './services';
import {
    GET_SHOP_INFO_SUCCESS,
    GET_SHOP_INFO_FAILURE,
    GET_BUSINESS_CATEGORY_SUCCESS,
    GET_BUSINESS_CATEGORY_FAILURE,
    UPDATE_SHOP_INFO_SUCCESS,
    UPDATE_SHOP_INFO_FAILURE,
    REGISTER_SHOP_INFO_SUCCESS,
    REGISTER_SHOP_INFO_FAILURE,
    UPDATE_MARK_IMAGE_SUCCESS,
    UPDATE_MARK_IMAGE_FAILURE,
    REPORT_TO_CEO_SUCCESS,
    REPORT_TO_CEO_FAILURE,
    GET_SHOP_INFO_BY_SHOPID_SUCCESS,
    GET_SHOP_INFO_BY_SHOPID_FAILURE,
    UPDATE_BUSINESS_INFO_SUCCESS,
    UPDATE_BUSINESS_INFO_FAILURE,
    UPDATE_PHONE_VERIFICATION_SUCCESS,
    UPDATE_PHONE_VERIFICATION_FAILURE,
    UPDATE_EMAIL_VERIFICATION_SUCCESS,
    UPDATE_EMAIL_VERIFICATION_FAILURE
} from './types';

export function* getShopInfoSaga(action) {
    try {
        const response = yield getShopInfo(action);
        let data = {}
        if (response.err == false) {  // success
            data = {
                shop_data: response.data,
                err: response.err,
            }
        } else {  // fail
            data = {
                shop_data: null,
                err: response.err
            }
        }
        yield put({type: GET_SHOP_INFO_SUCCESS, data});
    } catch (e) {
        yield put({type: GET_SHOP_INFO_FAILURE});
    }
}

export function* getBusinessCategorySaga() {
    try {
        const response = yield getBusinessCategory();
        yield put({type: GET_BUSINESS_CATEGORY_SUCCESS, response});
    } catch (e) {
        yield put({type: GET_BUSINESS_CATEGORY_FAILURE});
    }
}

export function* updateShopInfoSaga(action) {
    try {
        const response = yield updateShopInfo(action.sendData);
        let data = {}
        if (response.err == false) {  // success
            data = {
                shop_data: response.data,
                err: response.err,
            }
            yield put({type: UPDATE_SHOP_INFO_SUCCESS, data});
        } else {  // fail
            data = {
                shop_data: null,
                err: response.err
            }
            yield put({type: REGISTER_SHOP_INFO_FAILURE, data});
        }

    } catch (e) {
        yield put({type: UPDATE_SHOP_INFO_FAILURE});
    }
}

export function* registerShopInfoSaga(action) {
    try {
        const response = yield registerShopInfo(action.sendData);
        let data = {}
        if (response.err == false) {  // success
            data = {
                shop_data: response.data,
                err: response.err,
            }
            yield put({type: REGISTER_SHOP_INFO_SUCCESS, data});
        } else {  // fail
            data = {
                shop_data: null,
                err: response.err
            }
            yield put({type: REGISTER_SHOP_INFO_FAILURE, data});
        }

    } catch (e) {
        yield put({type: REGISTER_SHOP_INFO_FAILURE});
    }
}

export function* updateMarkImageSaga(action) {
    try {
        const response = yield updateMarkImage(action.sendData);
        let data = {}
        if (response.err == false) {  // success
            data = {
                shop_data: response.data,
                err: response.err,
            }
            yield put({type: UPDATE_MARK_IMAGE_SUCCESS, data});
        } else {  // fail
            data = {
                shop_data: null,
                err: response.err
            }
            yield put({type: UPDATE_MARK_IMAGE_FAILURE, data});
        }

    } catch (e) {
        yield put({type: UPDATE_MARK_IMAGE_FAILURE});
    }
}

export function* ReportToCeoSaga(action) {
    try {
        const response = yield reportToCeo(action.sendData);
        let data = {}
        if (response.err == false) {  // success
            data = {
                data: response.data,
                err: response.err,
            }
        } else {  // fail
            data = {
                data: null,
                err: response.err
            }
        }
        yield put({type: REPORT_TO_CEO_SUCCESS, data});
    } catch (e) {
        yield put({type: REPORT_TO_CEO_FAILURE});
    }
}

export function* getShopInfoByShopIdSaga(action) {
    try {
        const response = yield getShopInfoByShopId(action);
        let data = {}
        if (response.err == false) {  // success
            data = {
                shop_data: response.data,
                err: response.err,
            }
        } else {  // fail
            data = {
                shop_data: null,
                err: response.err
            }
        }
        yield put({type: GET_SHOP_INFO_BY_SHOPID_SUCCESS, data});
    } catch (e) {
        yield put({type: GET_SHOP_INFO_BY_SHOPID_FAILURE});
    }
}

export function* UpdateBusinessInfoSaga(action) {
    try {
        const response = yield updateBusinessInfo(action.sendData);
        let data = {}
        if (response?.err == false) {  // success
            data = {
                err: response?.err,
            }
            yield put({type: UPDATE_BUSINESS_INFO_SUCCESS, data});
        } else {  // fail
            data = {
                err: response?.err
            }
            yield put({type: UPDATE_BUSINESS_INFO_FAILURE, data});
        }
    } catch (e) {
        yield put({type: UPDATE_BUSINESS_INFO_FAILURE});
    }
}

export function* UpdatePhoneVerificationSaga(action) {
    try {
        const response = yield updatePhoneVerification(action.sendData);
        let data = {}
        if (response?.err == false) {  // success
            data = {
                err: response?.err,
            }
            yield put({type: UPDATE_PHONE_VERIFICATION_SUCCESS, data});
        } else {  // fail
            data = {
                err: response?.err
            }
            yield put({type: UPDATE_PHONE_VERIFICATION_FAILURE, data});
        }
    } catch (e) {
        yield put({type: UPDATE_PHONE_VERIFICATION_FAILURE});
    }
}

export function* UpdateEmailVerificationSaga(action) {
    try {
        const response = yield updateEmailVerification(action.sendData);
        console.log(response, 'updateEmailVerification', action);
        let data = {}
        if (response?.err == false) {  // success
            data = {
                err: response?.err,
            }
            yield put({type: UPDATE_EMAIL_VERIFICATION_SUCCESS, data});
        } else {  // fail
            data = {
                err: response?.err
            }
            yield put({type: UPDATE_EMAIL_VERIFICATION_FAILURE, data});
        }
    } catch (e) {
        yield put({type: UPDATE_EMAIL_VERIFICATION_FAILURE});
    }
}
