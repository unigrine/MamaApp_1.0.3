
//HeaderSmall means with 2 icons and 1 title

import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform, ScrollView
} from "react-native";
import theme from '../constants/themes/theme'
import Icon from 'react-native-vector-icons/FontAwesome'
import { CommonStyle } from "../constants/style";
import language from "../constants/language";

const Header = (props) => {
    return (
        <View style={CommonStyle.headr_container}>
            <View style={{flex: 1}}>
              {props?.leftIcon &&
                <TouchableOpacity onPress={()=> props?.navigation.goBack()}>
                  <Icon name={props.leftIcon} size={32} color={theme.black} />
                  </TouchableOpacity>
              }
            </View>
            <View style={{flex: props?.isShowTerm ? 15 : 12, alignItems: 'center'}}>
              {
                props?.title &&
                <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
              }
            </View>
            {
                props?.rightIcon &&
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity><Icon name={props.rightIcon} size={32} color={theme.black} /></TouchableOpacity>
                </View>

            }
            {
                props?.isShowTerm &&
                <View style={{flex: 1, position: 'absolute', right: 20, top: 10}}>
                    <TouchableOpacity onPress={() => props?.navigation.navigate('CeoTermsScreen')}>
                        <Text style={{
                            fontSize: theme.fontSmall,
                            color: theme.grey1,
                        }}>{language.TERMS}</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}
export default Header;

const styles = StyleSheet.create({
    title: {
        color: theme.black,
        fontSize: theme.font18,
        fontWeight: 'bold'
    }
});
