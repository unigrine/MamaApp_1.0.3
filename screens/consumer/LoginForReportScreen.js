// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, ActivityIndicator} from "react-native";
import {useNavigation, useTheme} from '@react-navigation/native';
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {connect} from "react-redux";
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import {iosKeys, androidKeys} from "../../utils/config";
import {FacebookSignin, getPublicProfile} from "../../utils/global";
import KakaoLogins, {KAKAO_AUTH_TYPES} from '@react-native-seoul/kakao-login';
import {NaverLogin, getProfile} from "@react-native-seoul/naver-login";
import {LoginCustomerAction} from "../../store/CustomerAuth/action";
import {setCustomerAuthData} from "../../utils/auth";
import {appleAuth} from "@invertase/react-native-apple-authentication";
import {isEmptyCheck} from "../../utils/regex";
import Toast from "react-native-simple-toast";

const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

class LoginForReportScreen extends React.Component {

    componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState) {
        const {isLoading, token, social_id, social_type, status, customer_id} = this.props
        const {newseventitem, shop_name, shop_id} = this.props.route.params

        if (prevProps.isLoading !== isLoading && !isLoading) {
            await setCustomerAuthData({
                token,
                social_id,
                social_type,
                status,
                customer_id
            });

            this.props.navigation.navigate('ReportScreen', {newseventitem, shop_name, shop_id})
        }
    }

    onNaverLogin = () => {
        this.naverLogin(initials)
    }

    onKakaoTokLogin = () => {
        this.kakaoLogin()
    }

    onAppleLogin = async () => {
        {
            try {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [
                        appleAuth.Scope.EMAIL,
                        appleAuth.Scope.FULL_NAME,
                    ],
                });

                // console.log('appleAuthRequestResponse', JSON.stringify(appleAuthRequestResponse));
                this.getAppleProfile(appleAuthRequestResponse);

                // this.fetchAndUpdateCredentialState()
                //     .then(res => this.setState({credentialStateForUser: res}))
                //     .catch(error =>
                //         this.setState({credentialStateForUser: `Error: ${error.code}`}),
                //     );


            } catch (error) {
                if (error.code === appleAuth.Error.CANCELED) {
                    console.warn('User canceled Apple Sign in.');
                } else {
                    console.error(error);
                }
            }
        }
    }

    getAppleProfile = (data) => {
        // console.log(`getAppleProfile ${JSON.stringify(data)}`);
        const {onesignal_id, deviceid} = this.props;

        const {
            user,
            email,
            // nonce,
            identityToken,
            // realUserStatus /* etc */,
        } = data;

        if (identityToken) {
            const name = `${isEmptyCheck(data?.fullName?.familyName) ? '' : data?.fullName?.familyName}${isEmptyCheck(data?.fullName?.givenName) ? '' : data?.fullName?.givenName}`
            let reqData = {
                "social_id": user,
                name,
                "email": isEmptyCheck(email) ? '' : email,
                // "picture": result?.profile_image_url,
                "social_type": "apple",
                "uuid": deviceid,
                "player_id": onesignal_id,
            }

            this.setState({isLoading: true});
            this.props.LoginCustomer(reqData)
        } else {
            // no token - failed sign-in?
            Toast.show('로그인할 수 없습니다. 다른 방법으로 로그인해주세요.')
        }
    };

    onFBLogin = async () => {
        const result = await FacebookSignin()
        if (result == null)
            return

        await this.getPublicProfile()
    }

    getPublicProfile = async () => {
        const {onesignal_id, deviceid} = this.props

        const infoRequest = new GraphRequest(
            '/me?fields=id,name,email,picture.type(large)',
            null,
            (error, result) => {
                if (error) {
                    console.log('Error fetching data: ' + error.toString());
                    return null
                } else {
                    console.log('facebook login succeed!')
                    console.log(result)

                    let data = {
                        "social_id": result.id,
                        "name": result.name,
                        "email": result.email,
                        "picture": result.picture.data.url,
                        "social_type": "facebook",
                        "uuid": deviceid,
                        "player_id": onesignal_id,
                    }

                    this.setState({isLoading: true});
                    this.props.LoginCustomer(data)
                }
            }
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    // 카카오 로그인 하기
    kakaoLogin = () => {
        KakaoLogins.login([KAKAO_AUTH_TYPES.Talk, KAKAO_AUTH_TYPES.Account])
            .then(result => {
                console.log(result)
                this.getKakaoProfile()
            })
            .catch(err => {
                if (err.code === 'E_CANCELLED_OPERATION') {
                    console.log(`Login Cancelled:${err.message}`)
                } else {
                    console.log(`Login Failed:${err.code} ${err.message}`)
                }
            });
    };

    kakaoLogout = () => {
        KakaoLogins.logout()
            .then(result => {
                // setToken(TOKEN_EMPTY);
                // setProfile(PROFILE_EMPTY);
                // logCallback(`Logout Finished:${result}`, setLogoutLoading(false));
            })
            .catch(err => {

            });
    };

    getKakaoProfile = () => {
        const {onesignal_id, deviceid} = this.props

        KakaoLogins.getProfile()
            .then(result => {
                console.log(result)
                let data = {
                    "social_id": result?.id,
                    "name": result?.nickname,
                    "email": result?.email,
                    "picture": result?.profile_image_url,
                    "social_type": "kakao",
                    "uuid": deviceid,
                    "player_id": onesignal_id,
                }

                this.setState({isLoading: true});
                this.props.LoginCustomer(data)
            })
            .catch(err => {
                console.log(`Get Profile Failed:${err.code} ${err.message}`)
            });
    };

    naverLogin = props => {
        return new Promise((resolve, reject) => {
            NaverLogin.login(props, (err, token) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    // console.log(token)
                    this.getNaverUserProfile(token)
                }
                resolve(token);
            });
        });
    };

    naverLogout = () => {
        NaverLogin.logout();
    };

    getNaverUserProfile = async (naverToken) => {
        const {onesignal_id, deviceid} = this.props

        const profileResult = await getProfile(naverToken.accessToken);
        if (profileResult.resultcode === "024") {
            console.log('login failed')
            return;
        }
        console.log("profileResult", profileResult);

        let data = {
            "social_id": profileResult.response.id,
            "name": "",
            "email": "",
            "picture": "",
            "social_type": "naver",
            "uuid": deviceid,
            "player_id": onesignal_id,
        }

        this.setState({isLoading: true});
        this.props.LoginCustomer(data)
    };

    render() {
        const {isLoading} = this.props
        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <Header leftIcon="angle-left" title={language.REPORTING} navigation={this.props.navigation}/>

                {isLoading &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isLoading} size="large"
                                   color={theme.primary}/>
                }

                <View style={{flex: 3}}>
                    <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={[styles.title, {color: theme.primaryDark}]}>
                                {language.REPORTING}
                            </Text>
                            <Text style={styles.title}>
                                는
                            </Text>
                        </View>
                        <Text style={styles.title}>
                            {language.SERVICE_FOR_CEO}
                        </Text>
                    </View>


                    <View style={{position: "relative", flex: 1, alignSelf: 'center'}}>
                        <Image source={theme.img_alert}
                               style={{
                                   position: "absolute",
                                   bottom: 0,
                                   height: "100%",
                                   resizeMode: "contain",
                                   alignSelf: 'center'
                               }}
                        >
                        </Image>
                    </View>

                    {/* Social login buttons */}
                    <View style={{flex: 2, marginHorizontal: 20}}>
                        {/* 네이버 로그인 */}
                        <TouchableOpacity style={[styles.socialBtn, {backgroundColor: theme.green}]}
                                          onPress={() => this.onNaverLogin()}
                        >
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Image source={theme.ic_naver} style={{marginLeft: 20, width: 24, height: 24}}/>
                                <Text style={{
                                    flex: 1,
                                    textAlign: "center",
                                    fontSize: 16,
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>
                                    {language.LOGIN_NAVER}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* 키키오 로그인 */}
                        <TouchableOpacity style={[styles.socialBtn, {backgroundColor: '#FEE500'}]}
                                          onPress={() => this.onKakaoTokLogin()}
                        >
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Image source={theme.ic_kakao} style={{marginLeft: 20, width: 24, height: 24}}/>
                                <Text style={{
                                    flex: 1,
                                    textAlign: "center",
                                    fontSize: 16,
                                    color: theme.black,
                                    fontWeight: 'bold'
                                }}>
                                    {language.LOGIN_KAKAOTOK}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* 페이스북 로그인 */}
                        <TouchableOpacity style={[styles.socialBtn, {backgroundColor: '#3f569e'}]}
                                          onPress={() => this.onFBLogin()}
                        >
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Image source={theme.ic_facebook} style={{marginLeft: 20, width: 24, height: 24}}/>
                                <Text style={{
                                    flex: 1,
                                    textAlign: "center",
                                    fontSize: 16,
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}>
                                    {language.LOGIN_FACEBOOK}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* 애플 로그인 */}
                        {
                            appleAuth.isSupported &&
                            <TouchableOpacity style={[styles.socialBtn,
                                {backgroundColor: theme.black}]}
                                              onPress={() => this.onAppleLogin()}
                            >
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <Image source={theme.ic_apple_white}
                                           style={{marginLeft: 20, width: 24, height: 24}}/>
                                    <Text style={{
                                        flex: 1,
                                        textAlign: "center",
                                        fontSize: 16,
                                        color: theme.white,
                                        fontWeight: 'bold'
                                    }}>
                                        {language.LOGIN_APPLE}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity style={{justifyContent: 'flex-start', alignItems: 'center'}}
                                          onPress={() => this.props.navigation.navigate('CeoTermsScreen')}>
                            <Text style={{
                                fontSize: theme.fontSmall,
                                color: theme.grey1,
                            }}>{language.TERMS}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customer_id: state.customer.customer_id,
        social_id: state.customer.social_id,
        token: state.customer.token,
        social_type: state.customer.social_type,
        isLoading: state.customer.isLoading,
        onesignal_id: state.userstatus.onesignal_id,
        deviceid: state.userstatus.deviceid
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        LoginCustomer: (data) => dispatch(LoginCustomerAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForReportScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },
    title: {
        color: theme.black,
        fontSize: theme.fontExtremly,
    },
    socialBtn: {
        borderRadius: 6,
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 16,
        shadowColor: 'rgba(47, 47, 47, 1)',
        shadowOffset: {width: 6, height: 6},
        shadowRadius: 5,
        elevation: 3,
    }
});
