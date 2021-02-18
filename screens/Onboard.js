// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator} from "react-native";
import theme from "../constants/themes/theme";
import language from "../constants/language"
import {CommonStyle} from "../constants/style";
import {connect} from "react-redux";
import {LoginCustomerAction} from "../store/CustomerAuth/action";
import {LoginAction} from "../store/CeoAuth/action";
import {SetCurrentScreenAction, SetUserStatusAction} from "../store/Config/action";
import {getSellerAuthData, setCustomerAuthData, setSellerAuthData} from "../utils/auth";
import {isEmptyCheck} from "../utils/regex";
import {Fonts} from "../constants/style/fonts";
import {GetNewsEventsAction} from "../store/Home/action";

class Onboard extends React.Component {

    state = {
        token: '',
        userid: '',
        userpw: '',
        user_type: '',
        deviceid: '',
        onesignal_id: '',
        mainTitle: ''
    }

    async componentDidMount() {
        const {bannerlist} = this.props;
        const data = await getSellerAuthData();
        const deviceid = this.props.deviceid;
        const onesignal_id = this.props.onesignal_id;

        this.setState({
            mainTitle: bannerlist.find(banner => banner.type === 'main').value,
            token: data.token,
            userid: data.seller_id,
            userpw: data.password,
            user_type: data.user_type,
            onesignal_id,
            deviceid
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            isLoading,
            token,
            seller_id,
            isLoading2,
            token2,
            social_type,
            social_id
        } = this.props;
        const { userpw } = this.state

        if (prevProps.isLoading != isLoading && isLoading == false) {
            if (token == null) {
                this.props.navigation.navigate('LoginCeoScreen')
            }
            else {
                if (userpw && userpw != undefined && userpw != "") { // 첫 로그인 시 로그인 스크린과 여기에 둘 다 들어옴. 여기서는 할 필요 없음. 로그인에서는 undefined가 아니다.
                    setSellerAuthData({
                        token,
                        seller_id,
                        password: userpw
                    });

                    this.props.setUserStatus({
                        status: "ceo_logged_in"
                    });
                }
            }
        }

        if (prevProps.isLoading2 != isLoading2 && isLoading2 == false) {
            if (!isEmptyCheck(token2)) {
                setCustomerAuthData({
                    token: token2,
                    social_id,
                    social_type
                });
            }

            this.props.SetCurrentScreen('Onboard');
            this.onPressSearch();
            setTimeout(() => {
                this.props.navigation.navigate('MainScreen')  // 성공이던 실패이던 화면 넘어간다.
            }, 700)

        }
    }

    onPressSearch = (isResetPage = false) => {
        const {deviceid, location} = this.props

        const latitude = !location ? null : parseFloat(location?.latitude)
        const longitude = !location ? null : parseFloat(location?.longitude)

        const data = {
            "uuid": deviceid,
            "region_name": location?.region_name,
            "latitude": latitude,
            "longitude": longitude,
            "large_category_id": -1,  // -1: 전체, 1 ~ 13, 음식점 ~ 영화공연
            "first_type": -1, //새소식/이벤트 전체, 1: 새소식, 2: 이벤트,
            "address1": "",
            "road_name": "",
            "building_name": "",
            "distance": 1000 / 1000, // km
            "shop_name": "",
            "keywords": "",
            "favorite": false,    // false: 비관심/관심 모두, true: 관심가게만
        }

        const sendData = {
            data,
            screen: 'Home'
        }

        this.props.GetNewsEvents(sendData);
    }

    onPressConsumer = async () => {
        if (this.props.isSearchLoading) return;

        const {token, userid, user_type, onesignal_id, deviceid} = this.state

        if ((user_type === "facebook" || user_type === "naver" || user_type === "kakao") &&
            token && token != undefined && token != "" &&
            userid && userid != undefined && userid != "") {

            let data = {
                "social_id": userid,
                "name": "",
                "email": "",
                "picture": "",
                "social_type": user_type,
                "uuid": deviceid,
                "player_id": onesignal_id,
            }

            this.props.LoginCustomer(data)  //  성공/실패시 아무튼 MainScreen으로 넘어간다
        }
        else {
            this.props.SetCurrentScreen('Onboard');
            this.onPressSearch();
            setTimeout(() => {
                this.props.navigation.navigate('MainScreen')
            }, 700)
        }
    }

    onPressCeo = () => {
        const {userid, userpw, user_type} = this.state

        if (!isEmptyCheck(userid) && !isEmptyCheck(userpw)) {

            let data = {
                email: userid,
                password: userpw
            }

            this.props.login(data)
        }
        else {
            this.props.navigation.navigate('LoginCeoScreen')
        }
    }

    render() {
        const {isLoading, isLoading2} = this.props
        const {mainTitle} = this.state
        let flag = isLoading || isLoading2

        return (
            <View style={styles.container}>
                {/* <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        /> */}
                {flag &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={flag} size="large"
                                   color={theme.primary}/>
                }

                <View style={styles.layout}>
                    <Image source={theme.logo_heart_p} style={[styles.logoheart, {marginBottom: 30}]}/>
                    {
                        mainTitle.split('\n').map(
                            (item, index) => <Text key={index} numberOfLines={1} style={styles.textnews}>{item}</Text>
                        )
                    }
                </View>

                <View style={styles.layout2}>
                    <View style={{flex: 1, justifyContent: "center"}}>
                        <Text numberOfLines={1} style={styles.texthowto}>
                            {language.HOW_TO_START}
                        </Text>
                    </View>

                    <View style={{flex: 3}}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.onPressConsumer()}
                            activeOpacity={0.3}
                        >
                            <View style={{alignContent: "center"}}>
                                <Text style={[styles.textconsumer]}>
                                    {language.CONSUMER}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => this.onPressCeo()}
                        >
                            <View style={{alignContent: "center"}}>
                                <Text style={[styles.texthowto, {color: theme.white}]}>
                                    {language.COOL_CEO}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        deviceid: state.userstatus.deviceid,
        onesignal_id: state.userstatus.onesignal_id,
        token: state.session.token,
        isLoading: state.session.isLoading,
        seller_id: state.session.seller_id,
        err: state.session.err,
        customer_id: state.customer.customer_id,
        token2: state.customer.token,
        social_id: state.customer.social_id,
        social_type: state.customer.social_type,
        isLoading2: state.customer.isLoading,
        bannerlist: state.banner.bannerlist,
        location: state.userstatus.location,
        isSearchLoading: state.home.isSearchLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (data) => dispatch(LoginAction(data)),
        setUserStatus: (data) => dispatch(SetUserStatusAction(data)),
        LoginCustomer: (data) => dispatch(LoginCustomerAction(data)),
        GetNewsEvents: (data) => dispatch(GetNewsEventsAction(data)),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboard);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },
    layout: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    layout2: {
        flex: 1,
        justifyContent: "center",
    },
    logoheart: {
        height: "26%",
        resizeMode: "contain",
    },
    textnews: {
        fontSize: theme.fontExtremly,
        color: theme.black,
        fontWeight: "700",
        textShadowOffset: {
            width: 1, height: 1
        },
        textShadowColor: theme.grey0,
        textShadowRadius: 4,
        fontFamily: Fonts.NotoSansBoldKr,
        lineHeight: 32
        // textAlign: 'center',
    },
    texthowto: {
        fontSize: theme.fontLarge,
        color: theme.grey1,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textconsumer: {
        fontSize: theme.fontExtremly,
        color: theme.white,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    btn: {
        backgroundColor: theme.primary,
        marginHorizontal: 50,
        marginVertical: 15,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 50,
        justifyContent: "center",
    },
    logomama: {
        marginTop: 30,
        height: "11%",
        resizeMode: "contain",
    },
    logomarketplace: {
        height: "10%",
        resizeMode: "contain",
    },
});
