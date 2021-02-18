// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-22)
// 소비자측, 소비자들이 올린 댓글, 및 소상공인 답글

import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from "../constants/themes/theme";
import language from "../constants/language";
import { CommonStyle } from "../constants/style";
import { connect } from "react-redux";
import {getDateFormat} from "../utils/text_format";
import {isEmptyCheck} from "../utils/regex";

const {width, height} = Dimensions.get("screen")
const maxLoadData = 10

const CommentToCeo = (props) => {
  // console.log(JSON.stringify(props));
  const ceo_report_list = props.props?.ceo_report_list
  const shop_data = props?.props?.shop_data

  const onPressChange = (item) => {
    if(isEmptyCheck(props?.token))
      props?.props?.navigation.navigate("LoginForHopeToCeoScreen", {report: item, shop_id: shop_data?.id})
    else
      props?.props?.navigation.navigate("CommentToCeoScreen", {report: item, shop_id: shop_data?.id})
  }

  const onPressReport = (item) => {
    const params = {
      customer_id: props?.props?.customer_id,
      report_id: item?.id,
      shop_name: item?.content,
      shop_id: item?.shop_id
    };

    if(isEmptyCheck(props?.token))
      props?.props?.navigation.navigate("LoginForReportHopeToCeoScreen", params);
    else
      props?.props?.navigation.navigate("ReportHopeToCeoByCustomerScreen", params);
  }

  const IntroduceComponent = () => {
    return (
      <View style={styles.itemtitleWraper}>
        <View style={{flex: 1}}>
          <Text style={styles.introduce}>
            {/* {language.CEO_WANT_TO_HEAR} */}
            {props?.bannerlist[3].value}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Image source={theme.img_bnn_ceo}
            style={{ width: '100%', resizeMode: 'contain'}}
          >
          </Image>
        </View>
      </View>
    )
  }

  const ceoCard = (item) => {
    return (
      <View style={styles.commentCardItemWrapper}>
        <View style={[CommonStyle.row_v_center, {paddingBottom: 10}]}>
          <Text style={styles.textSmall}>
            {getDateFormat(item?.created_at, 'YYYY-MM-DD HH:mm')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: "center"}}>
          <Image source={theme.ic_privacy}
            style={{width: 17, height: 17, resizeMode: "cover"}}
          >
          </Image>
          <Text style={[styles.textSmall, {paddingLeft: 5}]}>
            {language.COMMENT_CEO_ONLY_CAN_SEE}
          </Text>
        </View>

        {item?.reply?.id != undefined &&
          <View style={styles.commentCardItem}>
            <View style={[CommonStyle.row_v_center, {paddingBottom: 10}]}>
              <Text style={styles.textCeo}>
                {language.CEO}
              </Text>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>
                { item?.reply?.created_at && getDateFormat(item?.reply?.created_at, 'YYYY-MM-DD HH:mm')}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Image source={theme.ic_privacy}
                style={{width: 17, height: 17, resizeMode: "cover"}}
              >
              </Image>
              <Text style={[styles.textSmall, {paddingLeft: 5}]}>
                {language.COMMENT_CEO_ONLY_CAN_SEE}
              </Text>
            </View>
          </View>
        }
      </View>
    )
  }

  const userCard = (item) => {
    return (
      <View style={styles.commentCardItemWrapper}>
        <View style={[CommonStyle.row_v_center, {paddingBottom: 10}]}>
          <Text style={styles.textSmall}>
            {getDateFormat(item?.created_at, "YYYY-MM-DD HH:mm")}
          </Text>

            <TouchableOpacity style={{paddingHorizontal: 10}} onPress={()=> onPressReport(item)}>
                <Text style={styles.textSmall}>
                    {language.REPORTING}
                </Text>
            </TouchableOpacity>
          {props?.customer_id == item.customer_id &&
            <View style={CommonStyle.row_v_center}>
              <TouchableOpacity style={{paddingHorizontal: 10}} onPress={()=> onPressChange(item)}>
                <Text style={styles.textSmall}>
                  {language.CHANGE}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> props.onPressDelete(item)}>
                <Text style={styles.textSmall}>
                  {language.DELETE}
                </Text>
              </TouchableOpacity>
            </View>
          }
        </View>

        <Text style={styles.textMessage}>
          {item?.content}
        </Text>

        {item?.reply?.id != undefined &&
          <View style={styles.commentCardItem}>
            <View style={[CommonStyle.row_v_center, {paddingBottom: 10}]}>
              <Text style={styles.textCeo}>
                {language.CEO}
              </Text>
              <Text style={[styles.textSmall, {paddingLeft: 10}]}>
                { item?.created_at && getDateFormat(item?.reply?.created_at, "YYYY-MM-DD HH:mm")}
              </Text>
              {/*<View style={{paddingLeft: 10}}>*/}
              {/*  <Text style={styles.textSmall}>*/}
              {/*    {language.REPORTING}*/}
              {/*  </Text>*/}
              {/*</View>*/}
            </View>

            {item?.reply?.show_only_reporter && item?.customer_id != props?.customer_id ?
                <View style={{flexDirection: 'row', alignItems: "center"}}>
                  <Image source={theme.ic_privacy}
                    style={{width: 17, height: 17, resizeMode: "cover"}}
                  >
                  </Image>
                  <Text style={[styles.textSmall, {paddingLeft: 5}]}>
                    {language.COMMENT_CEO_ONLY_WRITE}
                  </Text>
                </View>
              :
              <Text style={styles.textMessage}>
                {item?.reply?.content}
              </Text>
            }

          </View>
        }
      </View>
    )
  }

  const renderItemCommentCard = (item) => {
    return (
      <View key={item.key} style={styles.container}>
        { (props?.customer_id == item.customer_id || item.hide_customers == 0) ?
            userCard(item)
          :
            ceoCard(item)
        }
      </View>
    )
  }

  return (
      <View style={{ flex: 1, backgroundColor: theme.white }}>

          {IntroduceComponent()}

          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {ceo_report_list?.map((item, key) => {
              item.key = key
              return renderItemCommentCard(item)
            })}
          </ScrollView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    customer_id: state.customer.customer_id,
    token: state.customer.token,
    isReportToCeoLoading: state.shop.isReportToCeoLoading,
    bannerlist: state.banner.bannerlist
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentToCeo)

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    borderBottomColor: theme.grey0,
    borderBottomWidth: 0.5
  },
  itemtitleWraper: {
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: theme.primaryTinyLight,
    height: 120,
    paddingHorizontal: 20,
  },
  textCeo: {
    fontSize: theme.font14,
    color: theme.black
  },
  textSmall: {
    fontSize: theme.fontSmall,
    color: theme.grey1,
  },
  textMessage: {
    fontSize: theme.font14,
    color: theme.black,
  },
  itemWraper: {
    backgroundColor: theme.primaryLight,
    padding: 20
  },
  introduce: {
    fontSize: theme.font18,
    color: theme.primaryBigDark,
    fontWeight: 'bold',
  },
  commentCardItemWrapper: {
    paddingHorizontal: 16,
  },
  commentCardItem: {
    paddingVertical: 15,
    backgroundColor: theme.minigrey,
    borderTopColor: theme.white,
    borderTopWidth: 10,
    borderLeftColor: theme.minigrey,
    borderLeftWidth: 10,
    marginTop: 16,
    paddingBottom: 20,
    paddingRight: 5,
  },
  btnWriter: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 80,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: 'center',
    overflow: "hidden"
  }
});
