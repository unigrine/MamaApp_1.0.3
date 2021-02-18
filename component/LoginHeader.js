
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
import Icon from 'react-native-vector-icons/FontAwesome'
import { CommonStyle } from "../constants/style";

const LoginHeader = (props) => {
    return (
        <View style={CommonStyle.headr_container}>
            <View style={{flex: 1}}>
              {props?.leftIcon &&
                <TouchableOpacity onPress={()=> props?.onPressLeftIcon()}>
                  <Icon name={props.leftIcon} size={32} color={theme.black} />
                  </TouchableOpacity>
              }
            </View>
            <View style={{flex: 12, alignItems: 'center'}}>
              {
                props?.title &&
                <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
              }
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              {
                props?.rightIcon &&
                <TouchableOpacity><Icon name={props.rightIcon} size={32} color={theme.black} /></TouchableOpacity>
              }
            </View>
        </View>
    );
}
export default LoginHeader;

const styles = StyleSheet.create({
    title: {
        color: theme.black,
        fontSize: theme.font18,
        fontWeight: 'bold'
    }
});