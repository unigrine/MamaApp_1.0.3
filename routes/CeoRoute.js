// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React, {Component} from "react";
import {View, TouchableOpacity, Image} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {connect} from "react-redux";
import DrawContent from './DrawerContent';

//  screens
import CeoShopManagerScreen from "../screens/ceo/CeoShopManagerScreen";
import RegisterShopInfoDetailScreen from "../screens/ceo/RegisterShopInfoDetailScreen";
import CommentToConsumerScreen from "../screens/ceo/CommentToConsumerScreen";
import RegisterNewsOrEventScreen from "../screens/ceo/RegisterNewsOrEventScreen";
import UpdatePasswordScreen from "../screens/ceo/UpdatePasswordScreen";
import UpdateIDScreen from "../screens/ceo/UpdateIDScreen";
import UpdateAddressScreen from "../screens/ceo/UpdateAddressScreen";
import UpdateBusinessInfoScreen from "../screens/ceo/UpdateBusinessInfoScreen";
import NoticeScreen from "../screens/ceo/NoticeScreen";
import theme from "../constants/themes/theme";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TermsScreen from "../screens/ceo/TermsScreen";
import CeoAlertScreen from "../screens/ceo/CeoAlertScreen";
import CeoTermsScreen from "../screens/ceo/CeoTermsScreen";
import ReportHopeToCeoByCeoScreen from "../screens/ceo/ReportHopeToCeoByCeoScreen";
import AddressFindScreen from "../screens/ceo/AddressFindScreen";
import UpdateVerificationScreen from "../screens/ceo/UpdateVerificationScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CeoShopManagerStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CeoShopManagerScreen"
                component={CeoShopManagerScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="CommentToConsumerScreen"
                component={CommentToConsumerScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="RegisterShopInfoDetailScreen"
                component={RegisterShopInfoDetailScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="RegisterNewsOrEventScreen"
                component={RegisterNewsOrEventScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="CeoAlertScreen"
                component={CeoAlertScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="ReportHopeToCeoByCeoScreen"
                component={ReportHopeToCeoByCeoScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="AddressFindScreen"
                component={AddressFindScreen}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="UpdateVerificationScreen"
                component={UpdateVerificationScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};


const UpdateIDStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdateIDScreen"
                component={UpdateIDScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const UpdatePasswordStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdatePasswordScreen"
                component={UpdatePasswordScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const UpdateAddressStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdateAddressScreen"
                component={UpdateAddressScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const UpdateBusinessInfoStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdateBusinessInfoScreen"
                component={UpdateBusinessInfoScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const UpdateVerificationStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdateVerificationScreen"
                component={UpdateVerificationScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const NoticeStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="NoticeScreen"
                component={NoticeScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

const SettingStackScreen = ({navigation}) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UpdateIDScreen"
                component={UpdateIDScreen}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    );
};

// stack navigator
class CeoRoute extends Component {
    render() {

        return (
            <View style={{flex: 1}}>
                {/* <GeneralStatusBarColor backgroundColor={themeData.colors.ba}
          barStyle={themeData.colors.StatusbarStyle}
        /> */}
                <Drawer.Navigator
                    initialRouteName="CeoShopManagerScreen"
                    drawerContent={props => <DrawContent {...props}
                                                         options={{headerShown: false}}
                    />
                    }
                >
                    <Drawer.Screen
                        name="CeoShopManagerScreen"
                        component={CeoShopManagerStackScreen}/>
                    <Drawer.Screen
                        name="UpdateIDScreen"
                        component={UpdateIDStackScreen}/>
                    <Drawer.Screen
                        name="UpdatePasswordScreen"
                        component={UpdatePasswordStackScreen}/>
                    <Drawer.Screen
                        name="UpdateAddressScreen"
                        component={UpdateAddressStackScreen}/>
                    <Drawer.Screen
                        name="UpdateVerificationScreen"
                        component={UpdateVerificationStackScreen}/>
                    <Drawer.Screen
                        name="UpdateBusinessInfoScreen"
                        component={UpdateBusinessInfoStackScreen}/>
                    <Drawer.Screen
                        name="NoticeScreen"
                        component={NoticeStackScreen}/>
                    <Drawer.Screen
                        name="CeoTermsScreen"
                        component={CeoTermsScreen}/>
                    <Drawer.Screen
                        name="SettingScreen"
                        component={SettingStackScreen}/>

                </Drawer.Navigator>

                {/* <Stack.Screen name="RegisterShopInfoDetailScreen" component={RegisterShopInfoDetailScreen} />
            <Stack.Screen name="CommentToConsumerScreen" component={CommentToConsumerScreen} />
            <Stack.Screen name="RegisterNewsOrEventScreen" component={RegisterNewsOrEventScreen} />
            <Stack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen} />
            <Stack.Screen name="UpdateIDScreen" component={UpdateIDScreen} />
            <Stack.Screen name="UpdateBusinessInfoScreen" component={UpdateBusinessInfoScreen} />
            <Stack.Screen name="NoticeScreen" component={NoticeScreen} />

            <Stack.Screen name="ReportScreen" component={ReportScreen} />
            <Stack.Screen name="MyAlertScreen" component={MyAlertScreen} />
            <Stack.Screen name="ShopScreen" component={ShopScreen} /> */}

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    // const { theme } = state.config;
    return {};
};

export default connect(
    mapStateToProps,
    {}
)(CeoRoute);
