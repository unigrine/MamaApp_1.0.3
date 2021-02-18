
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

const HeaderThreeView = (props) => {
    return (
        <View style={CommonStyle.headr_container}>
            <View style={{flex: 1}}>
              {props?.leftIcon &&
                <TouchableOpacity onPress={()=> props?.navigation.goBack()}>
                  <Icon name={props.leftIcon} size={32} color={theme.black} />
                  </TouchableOpacity>
              }
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              {
                props?.title &&
                <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
              }
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              {
                props?.rightText &&
                <TouchableOpacity onPress={()=> props.setModal()}>
                  <Text style={{color: theme.grey1, fontSize: theme.fontSmall}}>
                    {props?.rightText}
                  </Text>
                </TouchableOpacity>
              }
            </View>
        </View>
    );
}
export default HeaderThreeView;

const styles = StyleSheet.create({
    title: {
        color: theme.black,
        fontSize: theme.fontLarge,
        fontWeight: 'bold'
    }
});