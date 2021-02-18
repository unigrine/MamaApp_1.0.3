// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";

//importing images

const logo_hand = require("../../assets/images/image/logo_hand.png");
const logo_mama_w = require("../../assets/images/image/logo_w.png");
const logo_mama_p = require("../../assets/images/image/logo_p.png");
const logo_heart = require("../../assets/images/image/logo_heart.png");
const logo_heart_p = require("../../assets/images/image/logo_heart_p.png");
const mymarketplace = require("../../assets/images/text/mymarketplace.png");
const mymarketplace_thin = require("../../assets/images/text/mymarketplace_thin.png");
const consumer_ceo = require("../../assets/images/text/consumer_ceo.png");
const marketplace = require("../../assets/images/text/marketplace.png");
const ic_search_nor = require("../../assets/images/icon/ic_search_nor.png");
const ic_current_nor = require("../../assets/images/icon/ic_current_nor.png");
const ic_alert_w_nor = require("../../assets/images/icon/ic_alert_w_nor.png");
const btn_slider_nor = require("../../assets/images/icon/btn_slider_nor.png");
const btn_slider_nor_small = require("../../assets/images/icon/btn_slider_nor_small.png");
const ic_all_nor = require("../../assets/images/icon/ic_all_nor.png");
const ic_restaurant_nor = require("../../assets/images/icon/ic_restaurant_nor.png");
const ic_mart_nor = require("../../assets/images/icon/ic_mart_nor.png");
const ic_game_nor = require("../../assets/images/icon/ic_game_nor.png");
const ic_hospital_nor = require("../../assets/images/icon/ic_hospital_nor.png");
const ic_life_nor = require("../../assets/images/icon/ic_life_nor.png");
const ic_star_nor = require("../../assets/images/icon/ic_star_nor.png");
const favorite_nor = require("../../assets/images/icon/favorite_nor.png");
const favorite_dis = require("../../assets/images/icon/favorite_dis.png");
const ic_more_nor = require("../../assets/images/icon/ic_more_nor.png");
const ic_unfold_nor = require("../../assets/images/icon/ic_unfold_nor.png");
const ic_unfold_foc = require("../../assets/images/icon/ic_unfold_foc.png");
const ic_arrowup = require("../../assets/images/icon/ic_arrowup.png");
const ic_selectdown_nor = require("../../assets/images/icon/ic_selectdown_nor.png");
const ic_selectup_nor = require("../../assets/images/icon/ic_selectup_nor.png");
const ic_message_hint = require("../../assets/images/icon/ic_message_hint.png");
const img_alert = require("../../assets/images/image/img_alert.png");
const img_bnn_ceo = require("../../assets/images/image/img_bnn_ceo.png");
const ic_naver = require("../../assets/images/icon/ic_naver.png");
const ic_kakao = require("../../assets/images/icon/ic_kakao.png");
const ic_facebook = require("../../assets/images/icon/ic_facebook.png");
const ic_apple_black = require("../../assets/images/icon/ic_apple_black.png");
const ic_apple_white = require("../../assets/images/icon/ic_apple_white.png");
const ic_new = require("../../assets/images/icon/ic_new.png");
const ic_event = require("../../assets/images/icon/ic_event.png");
const ic_comment = require("../../assets/images/icon/ic_comment.png");
const ic_feed_foc = require("../../assets/images/icon/ic_feed_foc.png");
const ic_privacy = require("../../assets/images/icon/ic_privacy.png");
const ic_write_nor = require("../../assets/images/icon/ic_write_nor.png");
const ic_star = require("../../assets/images/icon/ic_star.png");
const ic_star_foc = require("../../assets/images/icon/ic_star_foc.png");
const ic_delete_nor = require("../../assets/images/icon/ic_delete_nor.png");
const ic_mapmark = require("../../assets/images/icon/ic_mapmark.png");
const img_store = require("../../assets/images/image/img_store.png");
const img_ceo = require("../../assets/images/image/img_ceo.png");
const img_profile = require("../../assets/images/image/img_profile.png");
const img_upload = require("../../assets/images/image/img_upload.png");
const ic_category0 = require("../../assets/images/icon/ic_all.png");
const ic_category1 = require("../../assets/images/icon/ic_dinning.png");
const ic_category2 = require("../../assets/images/icon/ic_cafe.png");
const ic_category3 = require("../../assets/images/icon/ic_shopping.png");
const ic_category4 = require("../../assets/images/icon/ic_accommodation.png");
const ic_category5 = require("../../assets/images/icon/ic_hospital.png");
const ic_category6 = require("../../assets/images/icon/ic_bank.png");
const ic_category7 = require("../../assets/images/icon/ic_oil.png");
const ic_category8 = require("../../assets/images/icon/ic_mart.png");
const ic_category9 = require("../../assets/images/icon/ic_store.png");
const ic_category10 = require("../../assets/images/icon/ic_convenience.png");
const ic_category11 = require("../../assets/images/icon/ic_sights.png");
const ic_category12 = require("../../assets/images/icon/ic_sport.png");
const ic_category13 = require("../../assets/images/icon/ic_cinema.png");
const ic_siren_gray = require("../../assets/images/icon/ic-siren-gray.png");
const ic_siren_red = require("../../assets/images/icon/ic-siren-red.png");

export default {

  // colors
  white: "#fff",
  black: "#000",
  transparent: "#11ffee00",
  primaryTinyLight: "#FFEFF8",
  primaryLight: "#FFAECA",
  primary: "#F0568D",
  primaryMedium: "#E64693", // Splash
  primaryDark: "#E1007C",
  primaryBigDark: "#E1007C",
  primaryEventIcon: "#FF4BAE",
  primarySlider: "#FF8E9E",
  hintColor: "#3C6D7A",
  lightgreen: "#00B28A",
  green: "#1EC800",
  yello: "#FEE500",
  purple: "#B300E1",
  lightblue: "#068CFF",
  red: "#FF001F",

  minigrey: "#F5F2F4",
  greymenu: "#EBEBEB",
  grey0: "#CCCCCC",
  grey0_1: "#B5B5B5",
  grey1: "#8D8D8D",
  grey1_2: "#707070",
  grey1_3: "#979797",
  grey2: "#585858",


  // font
  font10: 10,
  fontSmall: 12,
  font12: 12,
  font13: 13,
  font14: 14,
  font15: 15,
  fontMedium: 16,
  font17: 17,
  font18: 18,
  fontLarge: 20,
  fontExtremly: 22,

  // poppins: I18nManager.isRTL ? "JFFlat-Regular" : "Poppins-Medium",
  // poppinsbold: I18nManager.isRTL ? "JFFlat-Regular" : "Poppins-SemiBold",

  //assets
  logo_hand,
  logo_mama_w,
  logo_mama_p,
  logo_heart,
  mymarketplace,
  mymarketplace_thin,
  consumer_ceo,
  marketplace,
  logo_heart_p,
  ic_search_nor,
  ic_current_nor,
  ic_alert_w_nor,
  btn_slider_nor,
  btn_slider_nor_small,
  ic_all_nor,
  ic_restaurant_nor,
  ic_game_nor,
  ic_life_nor,
  ic_mart_nor,
  ic_hospital_nor,
  ic_star_nor,
  favorite_nor,
  favorite_dis,
  ic_more_nor,
  ic_unfold_nor,
  ic_unfold_foc,
  ic_arrowup,
  ic_message_hint,
  img_alert,
  img_bnn_ceo,
  ic_naver,
  ic_kakao,
  ic_facebook,
  ic_apple_black,
  ic_apple_white,
  ic_new,
  ic_event,
  ic_comment,
  ic_feed_foc,
  ic_privacy,
  ic_write_nor,
  ic_star,
  ic_star_foc,
  ic_delete_nor,
  img_store,
  img_profile,
  img_ceo,
  ic_category0,
  ic_category1,
  ic_category2,
  ic_category3,
  ic_category4,
  ic_category5,
  ic_category6,
  ic_category7,
  ic_category8,
  ic_category9,
  ic_category10,
  ic_category11,
  ic_category12,
  ic_category13,
  img_upload,
  ic_selectdown_nor,
  ic_selectup_nor,
  ic_mapmark,
  ic_siren_gray,
  ic_siren_red
};
