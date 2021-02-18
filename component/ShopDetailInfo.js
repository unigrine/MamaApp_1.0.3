// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-26)

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import theme from "../constants/themes/theme";
import language from "../constants/language";
import {getNumberWithCommas, getPhoneFormat} from "../utils/text_format";

export default function ShopDetailInfo(props) {

  const shop_data = props?.props?.shop_data
  const [menuMore, setMenuMore] = useState(false)

  const renderMenuItem = (item) => {
    return (
      <View key={item.key} style={{flex: 1, flexDirection: 'row', paddingBottom: 10}}>
        <View>
          <Text style={styles.textContent} numberOfLines={1}>
            {item.menu_name}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.dotdot]} numberOfLines={1}>
            .............................................................................
          </Text>
        </View>
        <View>
          <Text style={[styles.textContent]} numberOfLines={1}>
            {item?.menu_price}
          </Text>
        </View>
        </View>
    )
  }

  const IntroduceView = () =>{
    return (
      <View style={styles.itemWraper}>
        <Text style={styles.introduce}>
          {language.GREETINGS}
        </Text>
        <Text numberOfLines={38}style={styles.textContent}>
          {shop_data?.introduce_text?.length > 200 ? shop_data?.introduce_text.substring(0, 200) : shop_data?.introduce_text}
        </Text>
      </View>
    )
  }

  const ServicTimeView = () =>{

    return (
      <View style={[styles.itemWraper, {marginTop: 10}]}>
        <Text style={styles.introduce}>
          {language.SERVICE_TIME}
        </Text>

        {Array.isArray(shop_data?.running_time) && shop_data?.running_time?.map((item, index) => {
          if (shop_data?.running_time?.length < 3 )
            return(
              <View key={index}>
                <Text style={styles.textContent}>
                  {item?.work_time}
                </Text>
              </View>
            )
          else
              if (index == 0)
                return(
                  <View key={index}>
                    <Text style={styles.textContent}>
                      {item?.work_time}
                    </Text>
                  </View>
                )
              else if (index == 1)
                return(
                  <View key={index} style={{flexDirection: "row", alignItems: "center", paddingTop: 5}}>
                    <Text style={styles.textContent}>
                      {item?.work_time}
                    </Text>
                    <TouchableOpacity style={styles.btnDropdown} onPress={()=> setMenuMore(!menuMore)}>
                      <Image
                        source={menuMore ? theme.ic_unfold_foc: theme.ic_unfold_nor}
                        style={{width: 24, height: 24}}
                      >
                      </Image>
                    </TouchableOpacity>
                  </View>
                )
              else  // >= 2
                if (menuMore)
                  return(
                    <View key={index}>
                      <Text style={styles.textContent}>
                        {item?.work_time}
                      </Text>
                    </View>
                  )
          }
        )}
      </View>
    )
  }

  const MenuListView = () =>{
    return (
      <View style={[styles.itemWraper, {marginTop: 10}]}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text style={styles.introduce}>
              {language.MENU}
            </Text>
            {Array.isArray(shop_data?.menu) && shop_data?.menu?.map((item, key) => {
                item.key = key
                return renderMenuItem(item);
              })
            }
          </ScrollView>
      </View>
    )
  }

  const TelNumberView = () =>{
    return (
      <View style={[styles.itemWraper, {marginTop: 10}]}>
        <Text style={styles.introduce}>
          {language.TEL_NUMBER}
        </Text>
        <Text style={[styles.textContent]}>
          {getPhoneFormat(shop_data?.phone)}
        </Text>
      </View>
    )
  }

  return (
    <ScrollView style={{ backgroundColor: theme.minigrey }} showsVerticalScrollIndicator={false}>
          {shop_data?.introduce_text?.length > 0 && IntroduceView()}
          {shop_data?.running_time?.length > 0 && ServicTimeView()}
          {shop_data?.phone?.length > 0 && TelNumberView()}
          {shop_data?.menu?.length > 0 && MenuListView()}
          <View style={{height: 90}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  itemWraper: {
    backgroundColor: theme.white,
    padding: 20,
    paddingBottom: 15,
  },
  introduce: {
    fontSize: theme.font14,
    color: theme.grey0_1,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  textContent: {
    fontSize: theme.font14,
    color: theme.black,
    paddingVertical: 2
  },
  dotdot: {
    color: theme.black,
    paddingHorizontal: 5
  },
  btnDropdown: {
    marginLeft: 10,
    width: 20,
    height: 20,
    borderRadius: 35,
    borderColor: theme.grey1,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  body: {
    flex: 7.5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "white",
  },
});
