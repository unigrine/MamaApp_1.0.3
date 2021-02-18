/*******
 * configureStore
 * Set up and configure store, reducers and epics
 */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, all } from 'redux-saga/effects';

/* Reducers */

import { session } from './CeoAuth/reducer';
import { shop } from './Shop/reducer';
import { userstatus } from "./Config/reducer";
import { newsevent } from "./NewsEvent/reducer";
import { ceoreport } from "./CeoReport/reducer";
import { notification } from "./CeoNotification/reducer";
import { mynotification } from "./MyNotification/reducer";
import { notice } from "./Notice/reducer";
import { banner } from "./Banner/reducer";

import { customer } from "./CustomerAuth/reducer";
import { home } from "./Home/reducer";
import { favorite } from "./Favorite/reducer";
import { findinfo } from "./FindInfo/reducer";


/* Sagas */
import { setUserStatusSaga, setMyLocationSaga, setDeviceTokenSaga, setCurrentScreenSaga } from "./Config/sagas";
import { loginSaga, registerSaga, RegisterCeoOneSignalIdSaga } from './CeoAuth/sagas';
import {
  getShopInfoSaga,
  getBusinessCategorySaga,
  updateShopInfoSaga,
  registerShopInfoSaga,
  updateMarkImageSaga,
  ReportToCeoSaga,
  getShopInfoByShopIdSaga,
  UpdateBusinessInfoSaga,
  UpdateEmailVerificationSaga, UpdatePhoneVerificationSaga
} from './Shop/sagas';
import {
  GetNewsEventCategorySaga,
  RegisterNewsEventSaga,
  UpdateNewsEventSaga,
  GetNewsEventSaga,
  DeleteNewsEventSaga,
  ReportToNewsEventCommentSaga,
  SendCommentToNewsEventSaga,
  ReportToNewsEventSaga
} from "./NewsEvent/sagas";
import {
  GetCeoReportSaga,
  UpdateCeoReportSaga,
  DeleteCeoReportSaga,
  ReplyCeoReportSaga,
  UpdateReplyByCeoSaga,
  DeleteReplyByCeoSaga,
  ReportHopeToCeoByCeoSaga,
  ReportHopeToCeoByCustomerSaga
} from './CeoReport/sagas';
import { LoginCustomerSaga, RegisterCustomerOneSignalIdSaga } from './CustomerAuth/sagas';
import {GetFavoriteNewsEventsSaga, GetNewsEventsSaga} from "./Home/sagas";
import { SetFavoriteSaga, DeleteFavoriteSaga } from './Favorite/sagas';
import { FindIdByAddressSaga, FindIdByPhoneSaga, FindIdByEmailSaga, ChangeSellerIdSaga, ChangePasswordSaga, ChangeShopAddressSaga, FindPasswordByPhoneSaga, FindPasswordByEmailSaga } from './FindInfo/sagas';
import { GetNoticeSaga } from './Notice/sagas';

/* Actions    */
import { SET_USER_STATUS, SET_LOCATION, SET_DEVICE_TOKEN, SET_CURRENT_SCREEN } from "./Config/types";
import { LOGIN, REGISTER, REGISTER_CEO_ONESIGNAL_ID } from './CeoAuth/types';
import {
  GET_SHOP_INFO,
  GET_BUSINESS_CATEGORY,
  UPDATE_SHOP_INFO,
  REGISTER_SHOP_INFO,
  UPDATE_MARK_IMAGE,
  REPORT_TO_CEO,
  GET_SHOP_INFO_BY_SHOPID,
  UPDATE_BUSINESS_INFO,
  UPDATE_PHONE_VERIFICATION, UPDATE_EMAIL_VERIFICATION
} from './Shop/types';
import {
  GET_NEWSEVENT_CATEGORY,
  REGISTER_NEWSEVENT,
  UPDATE_NEWSEVENT,
  GET_NEWSEVENT,
  DELETE_NEWSEVENT,
  REPORT_TO_NEWSEVENT_COMMENT,
  SEND_COMMENT_TO_NEWSEVENT, REPORT_TO_NEWSEVENT
} from "./NewsEvent/types";
import {
  GET_CEO_REPORT,
  UPDATE_CEO_REPORT,
  DELETE_CEO_REPORT,
  REPLY_CEO_REPORT,
  UPDATE_REPLY_BY_CEO,
  DELETE_REPLY_BY_CEO,
  REPORT_HOPE_TO_CEO,
  REPORT_HOPE_TO_CEO_BY_CUSTOMER
} from './CeoReport/types';
import { LOGIN_CUSTOMER, REGISTER_CUSTOMER_ONESIGNALID } from './CustomerAuth/types';
import {GET_FAVORITE_NEWS_EVENTS, GET_NEWS_EVENTS} from './Home/types';
import { SET_FAVORITE, DELETE_FAVORITE } from './Favorite/types';
import { FIND_ID_ADDRESS, FIND_ID_PHONE, FIND_ID_EMAIL, CHANGE_SELLER_ID, CHANGE_SELLER_PASSWORD, CHANGE_SHOP_ADDRESS, FIND_PASSWORD_PHONE, FIND_PASSWORD_EMAIL } from './FindInfo/types';
import { GET_NOTICE } from './Notice/types';
import { GET_BANNER_TEXT } from './Banner/types';
import { GetBannerTextSaga } from './Banner/sagas';

const rootReducer = combineReducers({
  userstatus,
  session,
  shop,
  newsevent,
  ceoreport,
  customer,
  home,
  favorite,
  findinfo,
  notification,
  mynotification,
  notice,
  banner
});

const sagaMiddleware = createSagaMiddleware();

function* watchAll() {
  yield all([
    // 셋팅정보

    takeEvery(SET_LOCATION, setMyLocationSaga),
    takeEvery(SET_DEVICE_TOKEN, setDeviceTokenSaga),
    takeEvery(SET_USER_STATUS, setUserStatusSaga),
    takeEvery(SET_CURRENT_SCREEN, setCurrentScreenSaga),


    // 소상공인
    takeEvery(LOGIN, loginSaga),
    takeEvery(REGISTER, registerSaga),
    takeEvery(GET_SHOP_INFO, getShopInfoSaga),
    takeEvery(UPDATE_SHOP_INFO, updateShopInfoSaga),
    takeEvery(UPDATE_MARK_IMAGE, updateMarkImageSaga),
    takeEvery(GET_BUSINESS_CATEGORY, getBusinessCategorySaga),
    takeEvery(GET_NEWSEVENT_CATEGORY, GetNewsEventCategorySaga),
    takeEvery(REGISTER_NEWSEVENT, RegisterNewsEventSaga),
    takeEvery(UPDATE_NEWSEVENT, UpdateNewsEventSaga),
    takeEvery(DELETE_NEWSEVENT, DeleteNewsEventSaga),
    takeEvery(GET_NEWSEVENT, GetNewsEventSaga),
    takeEvery(REGISTER_SHOP_INFO, registerShopInfoSaga),
    takeEvery(GET_CEO_REPORT, GetCeoReportSaga),
    takeEvery(UPDATE_CEO_REPORT, UpdateCeoReportSaga),
    takeEvery(DELETE_CEO_REPORT, DeleteCeoReportSaga),
    takeEvery(REPLY_CEO_REPORT, ReplyCeoReportSaga),
    takeEvery(UPDATE_REPLY_BY_CEO, UpdateReplyByCeoSaga),
    takeEvery(DELETE_REPLY_BY_CEO, DeleteReplyByCeoSaga),
    takeEvery(REGISTER_CEO_ONESIGNAL_ID, RegisterCeoOneSignalIdSaga),
    takeEvery(UPDATE_BUSINESS_INFO, UpdateBusinessInfoSaga),
    takeEvery(REPORT_HOPE_TO_CEO, ReportHopeToCeoByCeoSaga),
    takeEvery(UPDATE_PHONE_VERIFICATION, UpdatePhoneVerificationSaga),
    takeEvery(UPDATE_EMAIL_VERIFICATION, UpdateEmailVerificationSaga),

    // 지역소비자
    takeEvery(LOGIN_CUSTOMER, LoginCustomerSaga),
    takeEvery(GET_NEWS_EVENTS, GetNewsEventsSaga),
    takeEvery(GET_FAVORITE_NEWS_EVENTS, GetFavoriteNewsEventsSaga),
    takeEvery(SEND_COMMENT_TO_NEWSEVENT, SendCommentToNewsEventSaga),
    takeEvery(REPORT_TO_NEWSEVENT_COMMENT, ReportToNewsEventCommentSaga),
    takeEvery(REPORT_TO_NEWSEVENT, ReportToNewsEventSaga),
    takeEvery(REPORT_TO_CEO, ReportToCeoSaga),
    takeEvery(GET_SHOP_INFO_BY_SHOPID, getShopInfoByShopIdSaga),
    takeEvery(REGISTER_CUSTOMER_ONESIGNALID, RegisterCustomerOneSignalIdSaga),
    yield takeEvery(REPORT_HOPE_TO_CEO_BY_CUSTOMER, ReportHopeToCeoByCustomerSaga),

    // 관심가게
    takeEvery(SET_FAVORITE, SetFavoriteSaga),
    takeEvery(DELETE_FAVORITE, DeleteFavoriteSaga),

    // 아이디, 비번 찾기
    takeEvery(FIND_ID_ADDRESS, FindIdByAddressSaga),
    takeEvery(FIND_ID_EMAIL, FindIdByEmailSaga),
    takeEvery(FIND_ID_PHONE, FindIdByPhoneSaga),
    takeEvery(FIND_PASSWORD_PHONE, FindPasswordByPhoneSaga),
    takeEvery(FIND_PASSWORD_EMAIL, FindPasswordByEmailSaga),
    takeEvery(CHANGE_SELLER_ID, ChangeSellerIdSaga),
    takeEvery(CHANGE_SELLER_PASSWORD, ChangePasswordSaga),
    takeEvery(CHANGE_SHOP_ADDRESS, ChangeShopAddressSaga),

    // 공지
    takeEvery(GET_NOTICE, GetNoticeSaga),
    takeEvery(GET_BANNER_TEXT, GetBannerTextSaga)
  ]);
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const configureStore = () => {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(watchAll);
  return store;
};
