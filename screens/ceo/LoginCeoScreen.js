// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Platform
} from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import Header from "../../component/Header"
import {connect} from 'react-redux';
import {LoginAction} from "../../store/CeoAuth/action";
import {SetUserStatusAction} from "../../store/Config/action";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as globalStyles from '../../constants/style/global'
import {isEmptyCheck} from "../../utils/regex";
import {setSellerAuthData} from "../../utils/auth";

class LoginCeoScreen extends React.Component {

    state = {
        isModal: false,
        id: '',
        password: '',
        errorIdMsg: '',
        errorPasswordMsg: '',
        notifyText: ''
    }

    componentDidMount() {
        const {bannerlist} = this.props;

        this.setState({
            notifyText: bannerlist.find(banner => banner.type === 'seller-login').value,
        })
    }

    async componentDidUpdate(prevProps, prevState) {
        const {isLoading, token, seller_id, err} = this.props
        const {password} = this.state

        if (prevProps.isLoading !== isLoading && !isLoading) {
            if (isEmptyCheck(token)) {
                this.setState({isModal: true});
            }
            else {
                setSellerAuthData({
                    token,
                    seller_id,
                    password
                });

                this.props.setUserStatus({
                    status: "ceo_logged_in"
                });
            }
        }
    }

    onPressLogin = () => {
        const {id, password} = this.state

        if (id.length < 1) {
            this.setState({errorIdMsg: language.PLEASE_INPUT_ID});
            return;
        }

        if (password.length < 1) {
            this.setState({errorPasswordMsg: language.PLEASE_INPUT_PASSWORD});
            return;
        }

        let data = {
            email: id,
            password
        }

        this.props.login(data)
    }

    onChangeIDText(text) {
        this.setState({id: text, errorIdMsg: ''});
    }

    onChangePasswordText(text) {
        this.setState({password: text, errorPasswordMsg: ''});
    }

    NotifyComponent() {
        return (
            <View style={styles.noticeWrapper}>
                <Text style={styles.notice_title}>
                    {language.PLEASE_CHECK}
                </Text>
                {
                    this.state.notifyText.split('\n').map(
                        (item, index) => <Text key={index} style={styles.notice_message}>{item}</Text>
                    )
                }

            </View>
        )
    }

    InputComponent() {
        const {id, password} = this.state
        return (
            <View>
                <View style={{marginTop: 20}}>
                    <View style={[styles.inputWrapper]}>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <TextInput
                                style={styles.searchInput}
                                autoCapitalize="none"
                                value={id}
                                placeholder={language.ID}
                                onChangeText={(text) => this.onChangeIDText(text)}
                            />
                        </View>
                    </View>
                    {this.state.errorIdMsg.length > 0 ?
                        <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorIdMsg}</Text> : null}
                </View>

                <View style={{marginTop: 20}}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.searchInput}
                            autoCapitalize="none"
                            value={password}
                            secureTextEntry
                            placeholder={language.SECRET_NUMBER}
                            onChangeText={(text) => this.onChangePasswordText(text)}
                        />
                    </View>
                    {this.state.errorPasswordMsg.length > 0 ?
                        <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorPasswordMsg}</Text> : null}
                </View>
            </View>
        )
    }

    BottomComponent() {
        return (
            <View>
                <View style={{marginTop: 30}}>
                    <TouchableOpacity style={styles.btnLogin}
                                      onPress={() => this.onPressLogin()}
                    >
                        <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                            {language.LOGIN}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop: 30, flexDirection: "row", justifyContent: "space-around"}}>
                    <View style={styles.IDFindWrapper}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FindIDScreen')}>
                            <Text style={[styles.IDFind, styles.verticalBar]}>
                                {language.ID_FIND}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('FindSecretNumberScreen')}>
                            <Text style={styles.IDFind}>
                                {language.SECRET_NUMBER_FIND}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{marginTop: 30, flexDirection: "row", justifyContent: "space-around"}}>
                    <View style={styles.IDFindWrapper}>
                        <Text style={[styles.firstMaMa]}>
                            {language.FIRST_MAMA}
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('JoinCeoScreen')}>
                            <Text style={[styles.firstMaMa, {color: theme.primary}]}>
                                {language.MEMBER_JOIN}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    Modal() {
        return (
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{marginTop: 0, paddingTop: 0}}>
                        <View style={{alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={() => this.setState({isModal: false})}>
                                <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={{
                            textAlign: "center",
                            paddingHorizontal: 70,
                            fontSize: theme.font18,
                            color: theme.black
                        }}>
                            {language.ID_SECRET_WRONG}
                        </Text>

                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnLogin}
                                              onPress={() => this.setState({isModal: false})}
                            >
                                <Text
                                    style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                    {language.OK}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const {isModal} = this.state
        const {isLoading} = this.props

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={'transparent'}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <Header leftIcon="angle-left" title={language.LOGIN_CEO} navigation={this.props.navigation}/>

                {isLoading &&
                <ActivityIndicator style={styles.spinnerStyle} animating={isLoading} size="large"
                                   color={theme.primary}/>
                }

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false} bounces={false}>

                    {this.NotifyComponent()}

                    {this.InputComponent()}

                    {this.BottomComponent()}

                    <View style={{height: Platform.OS == "android" ? 300 : 350}}></View>
                </ScrollView>

                {isModal && this.Modal()}

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.session.token,
        isLoading: state.session.isLoading,
        seller_id: state.session.seller_id,
        err: state.session.err,
        bannerlist: state.banner.bannerlist,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (data) => dispatch(LoginAction(data)),
        setUserStatus: (data) => dispatch(SetUserStatusAction(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginCeoScreen);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },

    body: {
        flex: 1,
        marginHorizontal: 20,
    },

    inputWrapper: {
        flexDirection: "row",
        width: "100%",
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        alignItems: "center"
    },
    searchInput: {
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    btnLogin: {
        borderRadius: 2,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingVertical: 14,
        marginHorizontal: 40
    },
    IDFindWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    IDFind: {
        color: theme.grey2,
        fontSize: theme.font14,
        paddingHorizontal: 10,
    },
    verticalBar: {
        borderRightColor: theme.grey1,
        borderRightWidth: 0.5,
    },
    firstMaMa: {
        color: theme.black,
        fontSize: theme.font14,
        paddingHorizontal: 2
    },
    noticeWrapper: {
        paddingVertical: 10,
        backgroundColor: theme.primaryTinyLight,
        borderBottomColor: theme.white,
        borderBottomWidth: 10,

        borderLeftColor: theme.primaryTinyLight,
        borderLeftWidth: 10,
        marginTop: 10,
        paddingBottom: 20,
        borderRadius: 2,
    },
    notice_title: {
        color: theme.black,
        fontSize: theme.fontLarge,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    notice_message: {
        color: theme.black,
        fontSize: theme.fontSmall,
        // paddingBottom: 5,
    },

    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modal: {
        width: '80%',
        backgroundColor: '#fff',
        zIndex: 10,
        paddingBottom: 30,
    },
    spinnerStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        justifyContent: "center",
    },
});
