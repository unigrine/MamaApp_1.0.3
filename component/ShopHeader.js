
//HeaderSmall means with 2 icons and 1 title

import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform
} from "react-native";
import theme from '../constants/themes/theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { CommonStyle } from "../constants/style";

const ShopHeader = (props) => {
    return (
        <View style={CommonStyle.headr_detail_container}>
            <View style={{flex: 1}}>
              {props?.leftIcon &&
                <TouchableOpacity
                    onPress={()=> props?.onPressLeftButton()}
                    hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}>
                  <Icon name={props.leftIcon} size={32} color={props?.textColor == "black" ? theme.black : theme.white} />
                </TouchableOpacity>
              }
            </View>
            <View style={{flex: 12, alignItems: 'center', paddingHorizontal: 10}}>
              {
                props?.title &&
                <Text style={[styles.title, {color: props?.textColor == "black" ? theme.black : theme.white}]} numberOfLines={1}>{props.title}</Text>
              }
            </View>
            <View style={{flex: 1}}>
              {
                props?.rightIcon &&
                <View>
                  <TouchableOpacity
                      onPress={()=> props?.onPressRightButton()}
                      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}>
                  <Icon name={props.rightIcon} size={26} color={props?.textColor == "black" ? theme.black : theme.white} />
                  </TouchableOpacity>
                </View>
              }
            </View>
        </View>
    );
}
export default ShopHeader;

const styles = StyleSheet.create({
    title: {
        color: theme.white,
        fontSize: theme.fontLarge,
        fontWeight: 'bold'
    }
});
