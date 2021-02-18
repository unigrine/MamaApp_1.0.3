
//HeaderSmall means with 2 icons and 1 title

import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ShadowPropTypesIOS,
    SafeAreaView,
} from "react-native";
import theme from '../constants/themes/theme'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CommonStyle } from "../constants/style";
import {getStatusBarHeight} from "react-native-status-bar-height";


const MaMaHeader = (props) => {
    return (
        <View style={[CommonStyle.headr_container, {paddingBottom: 0}]}>
            <View style={{flex: 1}}>
              {props?.leftIcon &&
                <TouchableOpacity onPress={()=> props?.navigation.goBack()}>
                  <Icon name={props.leftIcon} size={32} color={theme.black} />
                </TouchableOpacity>
              }
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Image source={theme.logo_mama_p} style={[styles.title, {tintColor: theme.primary}]} />
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                {
                    // props?.rightIcon &&
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

export default MaMaHeader;

const styles = StyleSheet.create({
    title: {
      height: 22,
      resizeMode: "contain"
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
      borderColor: theme.red,
      borderWidth: 3,
      borderRadius: 30,
    }
});
