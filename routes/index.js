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

//  screens
import Splash from "../screens/Splash";
import Onboard from "../screens/Onboard";
import MainArea from "../screens/main/MainArea";
import MainScreen from "../screens/main/MainScreen";
import HomeScreen from "../screens/main/HomeScreen";
import LoginForReportScreen from "../screens/consumer/LoginForReportScreen";
import LoginForCommentScreen from "../screens/consumer/LoginForCommentScreen";
import LoginForHopeToCeoScreen from "../screens/consumer/LoginForHopeToCeoScreen";
import ReportScreen from "../screens/consumer/ReportScreen";
import MyAlertScreen from "../screens/consumer/MyAlertScreen";
import JoinConsumerMember from "../screens/consumer/JoinConsumerMember";
import MapScreen from "../screens/consumer/MapScreen";
import ShopScreen from "../screens/consumer/ShopScreen";
import CommentToCeoScreen from "../screens/consumer/CommentToCeoScreen";
import FindIDScreen from "../screens/member/FindIDScreen";
import FindSecretNumberScreen from "../screens/member/FindSecretNumberScreen";
import LoginCeoScreen from "../screens/ceo/LoginCeoScreen";
import JoinCeoScreen from "../screens/ceo/JoinCeoScreen";
import TermsScreen from "../screens/ceo/TermsScreen";
import CeoShopManagerScreen from "../screens/ceo/CeoShopManagerScreen";
import CeoAlertScreen from "../screens/ceo/CeoAlertScreen";
import RegisterShopInfoDetailScreen from "../screens/ceo/RegisterShopInfoDetailScreen";
import CommentToConsumerScreen from "../screens/ceo/CommentToConsumerScreen";
import RegisterNewsOrEventScreen from "../screens/ceo/RegisterNewsOrEventScreen";
import UpdatePasswordScreen from "../screens/ceo/UpdatePasswordScreen";
import UpdateIDScreen from "../screens/ceo/UpdateIDScreen";
import UpdateBusinessInfoScreen from "../screens/ceo/UpdateBusinessInfoScreen";
import NoticeScreen from "../screens/ceo/NoticeScreen";
import CeoRoute from "./CeoRoute";
import DetailArea from "../screens/main/DetailArea";
import CeoTermsScreen from "../screens/ceo/CeoTermsScreen";
import LoginForReportToAdminScreen from "../screens/consumer/LoginForReportToAdminScreen";

import OneSignal from "react-native-onesignal";
import {ONESIGNAL_KEY} from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SetDeviceTokenAction, SetOneSignalIdAction} from "../store/Config/action";
import DeviceInfo from "react-native-device-info";
import {isEmptyCheck} from "../utils/regex";
import {Fonts} from "../constants/style/fonts";
import ReportToAdminScreen from "../screens/consumer/ReportToAdminScreen";
import {addNotificationData} from "../utils/notification";
import {SetIsReadCeoNotificationAction} from "../store/CeoNotification/action";
import {SetIsReadMyNotificationAction} from "../store/MyNotification/action";
import {GetBannerTextAction} from "../store/Banner/action";
import AddressFindScreen from "../screens/ceo/AddressFindScreen";
import LoginForReportHopeToCeoScreen from "../screens/consumer/LoginForReportHopeToCeoScreen";
import ReportHopeToCeoByCustomerScreen from "../screens/consumer/ReportHopeToCeoByCustomerScreen";
import {RegisterOneSingalIdAction} from "../store/CustomerAuth/action";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// stack navigator
class Route extends Component {
    constructor(props) {
        super(props);

        this.initUUid();
        this.initOneSignal();

        this.navigationRef = React.createRef();
    }

    componentDidMount = async () => {
        // 배너 가져오기
        this.props.GetBannerText();
    };

    initUUid = async () => {
        let deviceid = await AsyncStorage.getItem("mama_uuid", '');
        if (isEmptyCheck(deviceid)) {
            deviceid = DeviceInfo.getUniqueId();
            await AsyncStorage.setItem("mama_uuid", deviceid);
        }

        this.props.SetDeviceToken(deviceid);
    }

    initOneSignal = async () => {
        OneSignal.setLogLevel(6, 0);
        OneSignal.init(ONESIGNAL_KEY, {
            kOSSettingsKeyAutoPrompt: false,
            kOSSettingsKeyInAppLaunchURL: false,
            kOSSettingsKeyInFocusDisplayOption: 2
        });
        OneSignal.inFocusDisplaying(2);

        OneSignal.promptForPushNotificationsWithUserResponse(this.myiOSPromptCallback);

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        //OneSignal.addEventListener('inAppMessageClicked', this.onInAppMessageClicked);
    }

    // 서버에서 보낸 PUSH 받았을 때
    onReceived = (notification) => {
        console.log(`onReceived: ${JSON.stringify(notification)}`);
        const bigPicture = notification.payload.bigPicture;
        const body = notification.payload.body;
        const launchURL = notification.payload.launchURL;
        const title = notification.payload.title;
        const additionalData = notification.payload?.additionalData;

        const notificationData = {
            id: new Date().getTime(),
            title,
            body,
            bigPicture,
            launchURL,
            additionalData,
            type: "message",
            date: new Date(),
            check: false
        }

        const {type} = additionalData;
        switch (type) {
            case 'seller-news-register':
            case 'seller-event-register':
            case 'seller-report-register':
            case 'admin-seller-message':
                addNotificationData('CEO', notificationData);
                this.props.SetIsReadCeoNotification(false);
                break;
            case 'customer-news-register':
            case 'customer-event-register':
            case 'customer-report-reply':
            case 'admin-customer-message':
                addNotificationData('MY', notificationData);
                this.props.SetIsReadMyNotification(false);
                break;
        }
    }

    // 상단바 PUSH 눌렀을 때
    onOpened = (openResult) => {
        // console.log(`onOpened: ${JSON.stringify(openResult)}`);
        // console.log('Message: ', openResult.notification.payload.body);
        // console.log('Data: ', openResult.notification.payload.additionalData);
        // console.log('isActive: ', openResult.notification.isAppInFocus);

        // 알림 화면으로 이동
        const { type, body } = openResult.notification.payload.additionalData;
        switch (type) {
            case 'customer-news-register':
            case 'customer-event-register':
                this.navigationRef.current?.navigate('ShopScreen', { shop_id: body?.shop_id, type, event_id: body?.event_id });
                break;
            case 'customer-report-reply':
                this.navigationRef.current?.navigate('ShopScreen', { shop_id: body?.shop_id, type, report_id: body?.report_id });
                break;
            case 'admin-customer-message':
                break;
            case 'seller-news-register':
            case 'seller-event-register':
                this.navigationRef.current?.navigate('CeoShopManagerScreen', { type, event_id: body?.event_id });
                break;
            case 'seller-report-register':
                this.navigationRef.current?.navigate('CeoShopManagerScreen', { type, report_id: body?.report_id });
                break;
            case 'admin-seller-message':
                break;
        }
    }

    // 연결 완료
    onIds = async (device) => {
        console.log(`onIds: ${JSON.stringify(device)}`);

        const data = {
            uuid: this.props.deviceid,
            seller_uuid: this.props.deviceid,
            player_id: device?.userId
        }

        await AsyncStorage.setItem("mama_onesignal_id", device?.userId);

        // this.props.RegisterCeoOneSignalId(data);
        this.props.RegisterOneSignalId(data);
        this.props.SetOneSignalId(device?.userId);
    }

    onInAppMessageClicked = (actionResult) => {

    }

    componentWillUnmount = () => {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
        // OneSignal.removeEventListener('inAppMessageClicked', this.onInAppMessageClicked);
    }

    myiOSPromptCallback = (permission) => {
        // console.log(`myiOSPromptCallback: ${permission}`);
    }

    render() {
        const {status} = this.props
        return (
            <View style={{flex: 1, fontFamily: Fonts.NotoSansRegularKr}}>
                {/* <GeneralStatusBarColor backgroundColor={themeData.colors.ba}
          barStyle={themeData.colors.StatusbarStyle}
        /> */}

                <NavigationContainer ref={this.navigationRef}>
                    {status != "ceo_logged_in" ?
                        <Stack.Navigator
                            initialRouteName="Splash"
                            screenOptions={{headerShown: false}}
                        >
                            <Stack.Screen name="Splash" component={Splash}/>
                            <Stack.Screen name="Onboard" component={Onboard}/>
                            <Stack.Screen name="MainArea" component={MainArea}/>
                            <Stack.Screen name="DetailArea" component={DetailArea}/>
                            <Stack.Screen name="MainScreen" component={MainScreen}/>
                            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                            <Stack.Screen name="LoginForReportToAdminScreen" component={LoginForReportToAdminScreen}/>
                            <Stack.Screen name="LoginForReportScreen" component={LoginForReportScreen}/>
                            <Stack.Screen name="LoginForCommentScreen" component={LoginForCommentScreen}/>
                            <Stack.Screen name="LoginForHopeToCeoScreen" component={LoginForHopeToCeoScreen}/>
                            <Stack.Screen name="JoinConsumerMember" component={JoinConsumerMember}/>
                            <Stack.Screen name="CommentToCeoScreen" component={CommentToCeoScreen}/>
                            <Stack.Screen name="FindIDScreen" component={FindIDScreen}/>
                            <Stack.Screen name="FindSecretNumberScreen" component={FindSecretNumberScreen}/>
                            <Stack.Screen name="LoginCeoScreen" component={LoginCeoScreen}/>
                            <Stack.Screen name="JoinCeoScreen" component={JoinCeoScreen}/>
                            <Stack.Screen name="TermsScreen" component={TermsScreen}/>
                            <Stack.Screen name="CeoShopManagerScreen" component={CeoShopManagerScreen}/>
                            <Stack.Screen name="CeoAlertScreen" component={CeoAlertScreen}/>
                            <Stack.Screen name="RegisterShopInfoDetailScreen" component={RegisterShopInfoDetailScreen}/>
                            <Stack.Screen name="CommentToConsumerScreen" component={CommentToConsumerScreen}/>
                            <Stack.Screen name="RegisterNewsOrEventScreen" component={RegisterNewsOrEventScreen}/>
                            <Stack.Screen name="UpdatePasswordScreen" component={UpdatePasswordScreen}/>
                            <Stack.Screen name="UpdateIDScreen" component={UpdateIDScreen}/>
                            <Stack.Screen name="UpdateBusinessInfoScreen" component={UpdateBusinessInfoScreen}/>
                            <Stack.Screen name="NoticeScreen" component={NoticeScreen}/>
                            <Stack.Screen name="ReportToAdminScreen" component={ReportToAdminScreen}/>
                            <Stack.Screen name="ReportScreen" component={ReportScreen}/>
                            <Stack.Screen name="MyAlertScreen" component={MyAlertScreen}/>
                            <Stack.Screen name="ShopScreen" component={ShopScreen}/>
                            <Stack.Screen name="MapScreen" component={MapScreen}/>
                            <Stack.Screen name="CeoTermsScreen" component={CeoTermsScreen}/>
                            <Stack.Screen name="AddressFindScreen" component={AddressFindScreen}/>
                            <Stack.Screen name="LoginForReportHopeToCeoScreen" component={LoginForReportHopeToCeoScreen}/>
                            <Stack.Screen name="ReportHopeToCeoByCustomerScreen" component={ReportHopeToCeoByCustomerScreen}/>
                        </Stack.Navigator>
                        :
                        <CeoRoute/>
                    }
                </NavigationContainer>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading: state.userstatus.isLoading,
        status: state.userstatus.status,
        deviceid: state.userstatus.deviceid,
        isOneSiganlLoading: state.customer.isLoadingOneSingalId,
        isReadNotification: state.mynotification.isReadNotification,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        SetOneSignalId: (data) => dispatch(SetOneSignalIdAction(data)),
        SetDeviceToken: (data) => dispatch(SetDeviceTokenAction(data)),
        SetIsReadCeoNotification: (data) => dispatch(SetIsReadCeoNotificationAction(data)),
        SetIsReadMyNotification: (data) => dispatch(SetIsReadMyNotificationAction(data)),
        GetBannerText: () => dispatch(GetBannerTextAction()),
        // RegisterCeoOneSignalId: (data) => dispatch(RegisterCeoOneSignalIdAction(data)),
        RegisterOneSignalId: (data) => dispatch(RegisterOneSingalIdAction(data)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Route);
