
//HeaderSmall means with 2 icons and 1 title

import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import theme from '../constants/themes/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { CommonStyle } from "../constants/style";

const CeoShopHeader = (props) => {
    return (
        <View style={CommonStyle.headr_container}>
            <View style={{flex: 1}}>
              {props?.leftIcon &&
                <TouchableOpacity onPress={()=> props?.navigation.openDrawer()}>
                  <Icon name={props.leftIcon} size={30} color={props?.textColor == "black" ? theme.black : theme.white} />
                  </TouchableOpacity>
              }
            </View>
            <View style={{flex: 12, alignItems: 'center'}}>
              {
                props?.title &&
                <Text style={[styles.title, {color: props?.textColor == "black" ? theme.black : theme.white}]} numberOfLines={1}>{props.title}</Text>
              }
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              {
                props?.rightIcon &&
                <View>
                  <TouchableOpacity onPress={()=> props?.onPressRightButton()}>
                    <Image source={theme.ic_alert_w_nor} style={[styles.rightIcon, {tintColor: props?.textColor == "black" ? theme.black : theme.white}]} />
                  </TouchableOpacity>
                  {props?.notify && <View style={styles.circle}/> }
                </View>
              }
            </View>
        </View>
    );
}
export default CeoShopHeader;

const styles = StyleSheet.create({
    title: {
        color: theme.white,
        fontSize: theme.fontLarge,
        fontWeight: 'bold'
    },
    rightIcon: {
      height: 25,
      tintColor: theme.white,
      aspectRatio: 1,
      resizeMode: "contain"
    },
    circle: {
      position: 'absolute',
      right: 0,
      top: -3,
      width: 2,
      borderColor: 'red',
      borderWidth: 3,
      borderRadius: 30,
    }
});