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
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
} from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {connect} from 'react-redux';
import {CommonStyle} from "../../constants/style";
import {checkDuplicatedId, checkDuplicatedShopName, getOtpCodebyEmail2, requestVerificationCode} from "../../utils/api";
import {
    GetShopInfoAction,
    UpdateEmailVerificationAction,
    UpdatePhoneVerificationAction
} from "../../store/Shop/action";
import {validatePhoneNumber} from "../../utils/global";
import Toast from 'react-native-simple-toast';
import {isEmptyCheck, regexEmail, regexPhone} from "../../utils/regex";
import {getPhoneFormat} from "../../utils/text_format";


class UpdateVerificationScreen extends React.Component {

    state = {
        verify_method: "phone",  // phone or email
        isModal: false,
        errorMsg: {},
        verify_code: "",
        verify_code2: "", // got from server
        isOtpSendLoading: false,
        seller_id: "",
        phone_number: "",
        email: "",

        loadingIdCheck: false,
        sentMobile: false,  // firebase에 폰을 통해 otp요청을 보냈는가?
        sentEmail: false,  // 서버에 이메일을 통해 otp요청을 보냈는가?
        otpCodeChecked: false,
        loadingEmailOrMobileSend: false
    }

    componentDidMount() {
        const errorMsg = {
            mobilewrong: 0,
            emailwrong: 0,
            otpwrong: 0,
        }
        this.setState({errorMsg})
    }

    initShopInfo() {
        const {shop_data} = this.props

        this.setState({
                shop_name_org: shop_data?.shop_name,
                shop_name: shop_data?.shop_name,
                shop_address1: shop_data?.address,
                shop_address2: shop_data?.address1,
                latitude: shop_data?.latitude,
                longitude: shop_data?.longitude,
                large_category_id: shop_data?.large_category_id,
                sub_category_id: shop_data?.sub_category_id,
                business_number: shop_data?.business_number,
                business_image: {uri: shop_data?.business_image, type: "", name: ""},
            }
            , () => {
                this.isMyShopName()
                this.isValidateAddress()
            })

        const itemLargeCategroy = {value: shop_data?.large_category_id}
        const itemSubCategroy = {value: shop_data?.sub_category_id}
        this.onChangeBigCategory(itemLargeCategroy)
        if (itemSubCategroy.value > 0)
            this.onChangeSubCategory(itemSubCategroy)
    }

    handlerConfirm = async (phoneNumber) => {
        const {errorMsg} = this.state;

        try {
            const confirmation = await requestVerificationCode({ phoneNumber });
            // console.log(`confirmation: ${JSON.stringify(confirmation)}`);

            // 모바일본호로 보내는 인증코드 미리 얻기 api 호출, post여야 함. 입구: phonenumber, 출력: otpcode
            let errStatus = {
                ...errorMsg,
                mobilewrong: 0,
            }
            this.setState({confirmation, errorMsg: errStatus, sentMobile: true, loadingEmailOrMobileSend: false});
        } catch (error) {
            let errStatus = {
                ...errorMsg,
                mobilewrong: 1,
            }

            console.log(error)
            this.setState({confirmation: null, errorMsg: errStatus, sentMobile: false, loadingEmailOrMobileSend: false})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            isUpdating,
            err,
        } = this.props

        if (prevProps.isUpdating != isUpdating && isUpdating == false) {
            this.setState({isModal: true})
        }
    }

    onPressSendMobileNumber() {
        const {phone_number, errorMsg} = this.state

        this.setState({loadingEmailOrMobileSend: true});

        if (!regexMobilePhone(phone_number)) {
            let errStatus = {
                ...errorMsg,
                mobilewrong: 1,
            }
            this.setState({errorMsg: errStatus, sentMobile: false, loadingEmailOrMobileSend: false})
        } else {
            this.handlerConfirm(phone_number);
        }
    }

    onPressSendEmail() {
        const {email, errorMsg} = this.state

        if (!regexEmail(email.trim())) {
            let errStatus = {
                ...errorMsg,
                emailwrong: 1,
            }
            this.setState({errorMsg: errStatus, sentEmail: false})
        } else {
            // 이메일로 보내는 인증코드 미리 얻기 api 호출, post여야 함. 입구: phonenumber, 출력: otpcode
            this.setState({loadingEmailOrMobileSend: true})
            getOtpCodebyEmail2(email).then(response => {
                console.log(response)
                let errStatus = {
                    ...errorMsg,
                }
                if (response.err == false) {
                    errStatus = {
                        ...errorMsg,
                        emailwrong: 0,
                    }
                    this.setState({sentEmail: true, verify_code2: response.data})
                } else {
                    errStatus = {
                        ...errorMsg,
                        emailwrong: 1,
                    }
                }

                this.setState({errorMsg: errStatus, loadingEmailOrMobileSend: false})
            })

        }
    }

    onChangeText(text) {
        this.setState({seller_id: text})
    }

    onChangeMobileNumberText(text) {
        this.setState({phone_number: text, sentMobile: false, otpCodeChecked: false})
    }

    onChangeEmailText(text) {
        this.setState({email: text, sentEmail: false, verify_code2: ""})
    }

    onChangeOtpCodeWithPhone(text) {
        this.setState({verify_code: text})
    }

    onPressOtpVerify() {
        const {errorMsg, verify_code, confirmation} = this.state;

        if (confirmation === null) {
            Toast.show("인증번호 발송을 해주세요")
            return
        }

        if (confirmation.err) {
            Toast.show("인증번호 발송을 해주세요")
            return
        }

        this.setState({isOtpSendLoading: true});
        if (confirmation.data.toString() === verify_code.toString()) {
            let errStatus = {
                ...errorMsg,
                otpwrong: 2,
            }
            this.setState({errorMsg: errStatus, otpCodeChecked: true, isOtpSendLoading: false})
        }
        else {
            let errStatus = {
                ...errorMsg,
                otpwrong: 1,
            }
            this.setState({errorMsg: errStatus, otpCodeChecked: false, isOtpSendLoading: false})
        }
    }

    onPressOtpVerify2() {
        const {errorMsg, verify_code, verify_code2} = this.state
        if (verify_code2 != "" && verify_code == verify_code2) { // 서버에서 보내온 코드와 푸시로 날아온 otp번호 일치성검사, // 두개의 otp 코드가 같으면
            let errStatus = {
                ...errorMsg,
                otpwrong: 2,
            }
            this.setState({errorMsg: errStatus, otpCodeChecked: true})
        } else {
            let errStatus = {
                ...errorMsg,
                otpwrong: 1,
            }
            this.setState({errorMsg: errStatus, otpCodeChecked: false})
        }
    }

    onChangeOtpCodeText(text) {
        this.setState({verify_code: text})
    }

    onPressMobile() {
        this.setState({verify_method: "phone", verify_code: "", otpCodeChecked: false})
    }

    onPressEmail() {
        this.setState({verify_method: "email", verify_code: "", otpCodeChecked: false})
    }

    onPressChange() {
        const {shop_data, seller_id} = this.props
        const {
            phone_number,
            email,
            errorMsg,
            verify_method,
            otpCodeChecked,
        } = this.state

        if (verify_method == "phone") { // 폰인증
            if (isEmptyCheck(shop_data?.mobile_phone)) {
                if (phone_number?.length < 9 || !validatePhoneNumber(phone_number)) {
                    let errStatus = {
                        ...errorMsg,
                        mobilewrong: 1,
                    }
                    this.setState({errorMsg: errStatus})

                    return
                }
            }
        }

        if (verify_method == "email") { // 이메일인증
            if (isEmptyCheck(shop_data?.email)) {
                if (!regexEmail(email)) {
                    let errStatus = {
                        ...errorMsg,
                        emailwrong: 1,
                    }
                    this.setState({errorMsg: errStatus})

                    return
                }
            }

        }

        if (isEmptyCheck(shop_data?.email) && isEmptyCheck(shop_data?.mobile_phone)) {
            if (otpCodeChecked == false) {  //  OTP 인증 안됐으면
                Toast.show("전화번호/이메일 인증을 해주세요.")
                return
            }
        }

        let data = {
            seller_id: shop_data?.seller_id,
            shop_id: shop_data?.id,
            mobile_phone: '',
            email: ''
        };

        if (verify_method == "phone") {
            data.mobile_phone = phone_number;
        }
        else {  // email
            data.email = email;
        }

        let sendData = {
            token: this.props.token,
            data,
        }

        if (verify_method == "phone") {
            this.props.UpdatePhoneVerification(sendData);
        }
        else {
            this.props.UpdateEmailVerification(sendData);
        }
    }

    onPressModalOk(err) {
        this.setState({isModal: false})
        if (!err) {
            this.props.navigation.goBack();
        }
        // this.props.navigation.navigate("LoginCeoScreen")
    }

    MobileView() {
        const {
            errorMsg,
            otpCodeChecked,
            phone_number,
            verify_code,
            sentMobile,
            loadingEmailOrMobileSend,
            isOtpSendLoading
        } = this.state

        return (
            <View>
                <View
                    style={[styles.inputWrapper, {marginTop: 20}, errorMsg.mobilewrong ? {borderBottomColor: theme.primary} : null]}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <TextInput
                            style={CommonStyle.input}
                            autoCapitalize="none"
                            value={phone_number}
                            placeholder={language.MOBILE_NUMBER}
                            keyboardType={'phone-pad'}
                            maxLength={12}
                            onChangeText={(text) => this.onChangeMobileNumberText(text)}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.btnCheck} onPress={() => this.onPressSendMobileNumber()}>
                            {loadingEmailOrMobileSend == true ?
                                <View style={CommonStyle.row}>
                                    <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                    <Text style={styles.textDuplicatedCheck}>
                                        {sentMobile ? language.OTP_CODE_SENT : language.OTP_CODE_SEND}
                                    </Text>
                                </View>
                                :
                                <Text style={styles.textDuplicatedCheck}>
                                    {sentMobile ? language.OTP_CODE_SENT : language.OTP_CODE_SEND}
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                {errorMsg.mobilewrong ? <Text style={styles.errText}> {language.INPUT_AGAIN_MOBILE_NUMBER} </Text> : null}

                <View style={[styles.inputWrapper, errorMsg.otpwrong == 1 ? {borderBottomColor: theme.primary} : null]}>
                    <View style={[CommonStyle.row, {flex: 1, justifyContent: "space-between"}]}>
                        <TextInput
                            style={CommonStyle.input}
                            autoCapitalize="none"
                            value={verify_code}
                            maxLength={6}
                            placeholder={language.OPT_CODE_INPUT}
                            onChangeText={(text) => this.onChangeOtpCodeWithPhone(text)}
                        />
                    </View>

                    {otpCodeChecked ? <Icon name={'check'} size={20} color={theme.primary}/>
                        :
                        <View>
                            <TouchableOpacity style={styles.btnCheck} onPress={() => this.onPressOtpVerify()}>
                                {isOtpSendLoading == true ?
                                    <View style={CommonStyle.row}>
                                        <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                        <Text style={styles.textDuplicatedCheck}>
                                            {language.OTP_CODE_CHECK}
                                        </Text>
                                    </View>
                                    :
                                    <Text style={styles.textDuplicatedCheck}>
                                        {language.OTP_CODE_CHECK}
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {errorMsg.otpwrong == 1 ? <Text style={styles.errText}> {language.INPUT_AGAIN_OTP} </Text> : null}
            </View>
        )
    }

    ReadOnlyMobileView() {
        const { mobile_phone } = this.props.shop_data;

        return (
            <View>
                <View style={styles.inputWrapper}>
                    <Text style={[CommonStyle.input, {paddingVertical: 15, color: theme.grey1}]}>
                        {getPhoneFormat(mobile_phone)}
                    </Text>
                </View>
                <Text style={styles.errText}> {language.ALREADY_MOBILE_VERIFICATION} </Text>
            </View>
        )
    }

    EmailView() {
        const {
            errorMsg,
            otpCodeChecked,
            email,
            verify_code,
            sentEmail,
            loadingEmailOrMobileSend,
            isOtpSendLoading
        } = this.state
        return (
            <View>
                <View
                    style={[styles.inputWrapper, {marginTop: 20}, errorMsg.emailwrong ? {borderBottomColor: theme.primary} : null]}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <TextInput
                            style={CommonStyle.input}
                            autoCapitalize="none"
                            value={email}
                            placeholder={language.EMAIL_ADDRESS}
                            maxLength={50}
                            onChangeText={(text) => this.onChangeEmailText(text)}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.btnCheck} onPress={() => this.onPressSendEmail()}>
                            {loadingEmailOrMobileSend == true ?
                                <View style={CommonStyle.row}>
                                    <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                    <Text style={styles.textDuplicatedCheck}>
                                        {sentEmail ? language.OTP_CODE_SENT : language.OTP_CODE_SEND}
                                    </Text>
                                </View>
                                :
                                <Text style={styles.textDuplicatedCheck}>
                                    {sentEmail ? language.OTP_CODE_SENT : language.OTP_CODE_SEND}
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                {errorMsg.emailwrong ? <Text style={styles.errText}> {language.INPUT_AGAIN_EMAIL} </Text> : null}

                <View style={[styles.inputWrapper, errorMsg.otpwrong == 1 ? {borderBottomColor: theme.primary} : null]}>
                    <View style={[CommonStyle.row, {flex: 1, justifyContent: "space-between"}]}>
                        <TextInput
                            style={CommonStyle.input}
                            autoCapitalize="none"
                            value={verify_code}
                            maxLength={6}
                            placeholder={language.OPT_CODE_INPUT}
                            onChangeText={(text) => this.onChangeOtpCodeText(text)}
                        />
                    </View>

                    {otpCodeChecked ? <Icon name={'check'} size={20} color={theme.primary}/>
                        :
                        <View>
                            <TouchableOpacity style={styles.btnCheck} onPress={() => this.onPressOtpVerify2()}>
                                {isOtpSendLoading == true ?
                                    <View style={CommonStyle.row}>
                                        <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                        <Text style={styles.textDuplicatedCheck}>
                                            {language.OTP_CODE_CHECK}
                                        </Text>
                                    </View>
                                    :
                                    <Text style={styles.textDuplicatedCheck}>
                                        {language.OTP_CODE_CHECK}
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {errorMsg.otpwrong == 1 ? <Text style={styles.errText}> {language.INPUT_AGAIN_OTP} </Text> : null}
            </View>
        )
    }

    ReadOnlyEmailView() {
        const { email } = this.props.shop_data;

        return (
            <View>
                <View style={styles.inputWrapper}>
                    <Text style={[CommonStyle.input, {paddingVertical: 15, color: theme.grey1}]}>
                        {email}
                    </Text>
                </View>
                <Text style={styles.errText}> {language.ALREADY_EMAIL_VERIFICATION} </Text>
            </View>
        )
    }

    Modal() {
        const {err} = this.props
        return (
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{marginTop: 0, paddingTop: 0}}>
                        <View style={{alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={() => this.setState({isModal: false})}>
                                <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalText}>
                            {err ? language.VERIFICATION_FAILED : language.VERIFICATION_CHANGED}
                        </Text>
                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnLogin}
                                              onPress={() => this.onPressModalOk(err)}
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

    SelfVerifyMethod() {
        const {verify_method} = this.state
        return (
            <View>
                <View style={styles.verificationMethodWrapper}>
                    <View
                        style={[styles.mobileVeifyWrapper, styles.leftRadius, verify_method == "phone" ? {backgroundColor: theme.primary} : null]}>
                        <TouchableOpacity onPress={() => this.onPressMobile()}>
                            <Text
                                style={[styles.textverify, verify_method == "phone" ? {color: theme.white} : {color: theme.grey1_2}]}>
                                {language.MOBILE_VERIFICATION}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[styles.mobileVeifyWrapper, styles.rightRadius, verify_method == "email" ? {backgroundColor: theme.primary} : null]}>
                        <TouchableOpacity onPress={() => this.onPressEmail()}>
                            <Text
                                style={[styles.textverify, verify_method == "email" ? {color: theme.white} : {color: theme.grey1_2}]}>
                                {language.EMAIL_VERIFICATION}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    bottomView() {
        const {terms_flag} = this.state
        return (
            <View>
                <View style={{marginTop: 30}}>
                    <TouchableOpacity style={[styles.btnJoin, {backgroundColor: theme.primary}]}
                                      onPress={() => this.onPressChange()}
                    >
                        <Text style={styles.textJoin}>
                            {language.FINISH_VERIFICATION}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 50}}/>
            </View>
        )
    }

    render() {
        const {verify_method, isModal} = this.state
        const {isUpdating} = this.props
        const { mobile_phone, email } = this.props.shop_data;

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <Header leftIcon="angle-left" title={language.VERIFICATION_CHANGE} navigation={this.props.navigation}/>

                {isUpdating &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isUpdating} size="large"
                                   color={theme.primary}/>
                }
                <ScrollView style={styles.body}
                            showsVerticalScrollIndicator={false}
                >
                    {this.SelfVerifyMethod()}
                    {verify_method === "phone" && isEmptyCheck(mobile_phone) && this.MobileView()}
                    {verify_method === "phone" && !isEmptyCheck(mobile_phone) && this.ReadOnlyMobileView()}
                    {verify_method === "email" && isEmptyCheck(email) && this.EmailView()}
                    {verify_method === "email" && !isEmptyCheck(email) && this.ReadOnlyEmailView()}

                    {verify_method === "phone" && isEmptyCheck(mobile_phone) && this.bottomView()}
                    {verify_method === "email" && isEmptyCheck(email) && this.bottomView()}
                </ScrollView>
                {isModal && this.Modal()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.session.token,
        shop_data: state.shop.shop_data,
        isUpdating: state.shop.isUpdateVerificationLoading,
        err: state.shop.err,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        UpdatePhoneVerification: (data) => dispatch(UpdatePhoneVerificationAction(data)),
        UpdateEmailVerification: (data) => dispatch(UpdateEmailVerificationAction(data)),
        GetShopInfo: (data) => dispatch(GetShopInfoAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateVerificationScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },

    body: {
        marginHorizontal: 20,
    },

    title: {
        color: theme.black,
        fontSize: theme.fontLarge,
        textAlign: 'center'
    },
    textDuplicatedCheck: {
        color: theme.grey1,
        fontSize: theme.font14,
    },
    inputWrapper: {
        flexDirection: "row",
        width: "100%",
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        alignItems: "center"
    },
    verificationMethodWrapper: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',

    },
    mobileVeifyWrapper: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: theme.white,
        borderColor: theme.primary,
        borderWidth: 1,
    },
    mobileVeify: {
        color: theme.grey1,
        fontSize: theme.font14,
    },
    leftRadius: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    rightRadius: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    textverify: {
        fontSize: theme.font14,
        fontWeight: 'bold'
    },
    btnJoin: {
        borderRadius: 2,
        backgroundColor: theme.grey1,
        justifyContent: 'center',
        paddingVertical: 14,
    },
    textJoin: {
        textAlign: "center",
        fontSize: 16,
        color: theme.white,
        fontWeight: 'bold'
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
    btnLogin: {
        borderRadius: 2,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingVertical: 14,
        marginHorizontal: 40
    },
    modalText: {
        textAlign: "center",
        paddingHorizontal: 40,
        fontSize: theme.font18,
        color: theme.black
    },
    itemTitle: {
        fontSize: theme.font14,
        fontWeight: 'bold'
    },
    placeholder: {
        fontSize: theme.font14,
        color: theme.grey1
    },
    dropDownPickerStyle: {
        marginTop: 10,
        height: 50,
        width: "100%",
        borderWidth: 0
    },
    labelStyle: {
        fontSize: theme.font14,
        textAlign: 'left',
        color: theme.black
    },
    business_image: {
        marginTop: 20,
        width: "100%",
        height: 200,
        backgroundColor: theme.grey0
    },
    textBase: {
        color: theme.black,
        fontSize: theme.font14,
        paddingLeft: 5
    },
    detailTerms: {
        color: theme.grey1,
        fontSize: theme.fontSmall
    },
    errText: {
        color: theme.red,
        fontSize: theme.fontSmall
    },
    businessTypeWrapper: {
        marginTop: 20,
        ...(Platform.OS !== 'android' && {
            zIndex: 10
        })
    },
    btnCheck: {
        borderColor: theme.grey1,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
});
