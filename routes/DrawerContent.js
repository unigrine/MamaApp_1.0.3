import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Drawer, Text } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import language from '../constants/language';
import theme from '../constants/themes/theme';
import { connect } from 'react-redux';
import { SetUserStatusAction } from '../store/Config/action';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawContent = (props) => {

    useEffect (()=> {
    },[props.shop_data])

    const signOut = async () => {
        await AsyncStorage.setItem("mama_seller_id", "")
        await AsyncStorage.setItem("mama_seller_pw", "")
        const data = {
          status: "login"
        }
        props.setUserStatus(data)  // 로그인창으로 간다. 내부저장소에서는 지우고..
    }

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={{alignItems: "flex-end"}}>
                        <TouchableOpacity onPress = {()=> props.navigation.closeDrawer()}>
                            <Image source={theme.ic_delete_nor} style={{width: 40, height: 40, resizeMode: "stretch", tintColor: theme.grey1}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.userInfoSection}>
                        <View style={{ marginTop: 15 }}>
                            <View style = {styles.shopLogo}>
                            { !props?.shop_data?.mark_image ?
                                    <Image
                                        source={theme.img_profile}
                                        style={{width: "100%", height: "100%"}}>
                                    </Image>
                                    :
                                    <Image
                                        source={{uri: props?.shop_data?.mark_image}}
                                        style={{width: "100%", height: "100%", resizeMode: 'stretch'}}>
                                    </Image>
                            }
                            </View>
                            <View style={{ paddingTop: 10 }}>
                                <Text style={styles.title}>{props?.shop_data?.shop_name}</Text>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            label={language.ID_CHANGE}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('UpdateIDScreen') }}>
                        </DrawerItem>

                        <DrawerItem
                            label={language.PASSWORD_CHANGE}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('UpdatePasswordScreen') }}>
                        </DrawerItem>

                        <DrawerItem
                            label={language.ADDRESS_CHANGE}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('UpdateAddressScreen') }}>
                        </DrawerItem>

                        <DrawerItem
                            label={language.VERIFICATION_CHANGE}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('UpdateVerificationScreen') }}>
                        </DrawerItem>

                        <DrawerItem
                            label={language.BUSINESS_INFO_CHANGE}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('UpdateBusinessInfoScreen') }}>
                        </DrawerItem>

                        <DrawerItem
                            label={language.NOTICE_PERMISSION}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('NoticeScreen') }}>
                        </DrawerItem>

                        <DrawerItem
                            label={language.TERMS}
                            labelStyle={{color: theme.black, fontSize: theme.font14}}
                            onPress={() => {props.navigation.navigate('CeoTermsScreen') }}>
                        </DrawerItem>

                        {/* <DrawerItem
                            label={language.SETTING}
                            labelStyle={{color: theme.grey1, fontSize: theme.font14}}
                            onPress={() => console.log('pressed') }>
                        </DrawerItem> */}
                    </Drawer.Section>

                    <DrawerItem
                        label={language.LOGOUT}
                        labelStyle={{color: theme.black, fontSize: theme.font14}}
                        onPress={() => signOut() }>
                    </DrawerItem>

                </View>

            </DrawerContentScrollView>
        </View>
    )
}

const mapStateToProps = (state) => {
    return {
        shop_data: state.shop.shop_data
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
        setUserStatus: (data) => dispatch(SetUserStatusAction(data)),
    };
  };

// export default DrawContent
export default connect(mapStateToProps, mapDispatchToProps)(DrawContent);

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: theme.fontMedium,
        marginTop: 3,
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 20,
        borderTopColor: theme.grey0,
        borderTopWidth: 0.5,
        borderBottomWidth: 0
    },
    drawerSubSection: {
        marginLeft: 15,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    shopLogo: {
        width: 70,
        height: 70,
        borderRadius: 100,
        backgroundColor: '#D8D8D8',
        overflow: "hidden"
    },
});
