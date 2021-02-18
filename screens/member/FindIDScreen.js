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
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {connect} from "react-redux";
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {getAddressByKeywordForNaver} from "../../utils/global";
import {FindIdByAddressAction, FindIdByEmailAction, FindIdByPhoneAction} from "../../store/FindInfo/action";
import {getOtpCodebyEmail, getOtpCodebyEmail2, requestVerificationCode} from "../../utils/api";
import Toast from 'react-native-simple-toast';
import {regexEmail, regexMobilePhone} from "../../utils/regex";

class FindIDScreen extends React.Component {
    state = {
        verificationMethod: 1,
        isModal: false,
        shop_address1: "",
        shop_address2: "",
        checkFindAddr: false,
        otpCodeChecked: false,  // 폰 인증
        otpCodeChecked2: false, // 이메일
        errorMsg: {},
        phone_number: "",
        email: "",
        verify_code: "",
        verify_code2: "", // got from server
        isOtpSendLoading: false,
        loadingEmailOrMobileSend: false,
        isAddrSearchLoading: false,
        confirmation: null,
    }

    componentDidMount() {
        const errorMsg = {
            id12: 0,
            idwrong: 0,
            pwwrong: 0, // 0: 4자리이상 입력, 1: 허용
            mobilewrong: 0,
            emailwrong: 0,
            otpwrong: 0,
            shopnamewrong: 0,
            shopnameused: 0,  // 0: 중복검사 못함. 1: 중복됨, 2: 중복검사 한 결과 중복되지 않음
        }
        this.setState({errorMsg})
    }

    componentDidUpdate(prevProps, prevState) {
        const {isLoading, err, yourid} = this.props

        if (prevProps.isLoading != isLoading && isLoading == false) {
            this.setState({isModal: true})
        }
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

    onPressFinAddress() {
        const {shop_address1} = this.state

        let address_name = ""
        let road_address = ""
        let longitude = 0
        let latitude = 0

        if (shop_address1.length < 2) return
        this.setState({isAddrSearchLoading: true})
        getAddressByKeywordForNaver(shop_address1).then(result => {
            if (Array.isArray(result?.addresses)) {
                result?.addresses?.map((item, index) => {
                    if (index == 0) {
                        address_name = item?.jibunAddress
                        road_address = item?.roadAddress
                        longitude = item?.x
                        latitude = item?.y
                    }
                })
            }
            this.setState({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                shop_address1: address_name,
                shop_address2: road_address,
            })

            let checkFindAddr = false
            if (latitude != 0 && longitude != 0 && (address_name != "" || road_address != ""))
                checkFindAddr = true

            this.setState({isAddrSearchLoading: false, checkFindAddr})
        })
    }

    onPressSendMobileNumber() {
        const {phone_number, errorMsg} = this.state

        this.setState({loadingEmailOrMobileSend: true})

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
            this.setState({errorMsg: errStatus, otpCodeChecked2: true})
        } else {
            let errStatus = {
                ...errorMsg,
                otpwrong: 1,
            }
            this.setState({errorMsg: errStatus, otpCodeChecked2: false})
        }
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

    onChangeOtpCodeText(text) {
        this.setState({verify_code: text})
    }

    onChangeShopAddressText(text) {
        this.setState({shop_address1: text, checkFindAddr: false})

    }

    onChangeShopAddress2Text(text) {
        this.setState({shop_address2: text, checkFindAddr: false})
    }

    onPressMobile() {
        this.setState({verificationMethod: 1})
    }

    onPressEmail() {
        this.setState({verificationMethod: 2})
    }

    onPressShopAddress() {
        this.setState({verificationMethod: 3})
    }

    onPressNext() {
        const {
            verificationMethod, shop_address1, shop_address2, email, verify_code, phone_number,
            otpCodeChecked, otpCodeChecked2, sentEmail, errorMsg, checkFindAddr
        } = this.state

        if (verificationMethod == 1) {
            if (phone_number == "" || !regexMobilePhone(phone_number)) {
                let errStatus = {
                    ...errorMsg,
                    mobilewrong: 1,
                }
                this.setState({errorMsg: errStatus})
                return
            } else if (otpCodeChecked == false) {
                Toast.show("인증번호 확인을 해주세요")
                return
            }
            const data = {
                phone_number: phone_number,
            }
            this.props.FindIdByPhone(data)
        } else if (verificationMethod == 2) {
            console.log('hihi');
            if (!regexEmail(email.trim())) { // 이메일인증
                let errStatus = {
                    ...errorMsg,
                    emailwrong: 1,
                }
                this.setState({errorMsg: errStatus})
                return
            }
            if (sentEmail == false) {  //  OTP 인증 안됐으면
                Toast.show("인증번호를 발송해주세요.")
                return
            }
            if (otpCodeChecked2 == false) {  //  OTP 인증 안됐으면
                Toast.show("정확한 인증번호를 입력해주세요")
                return
            }
            const data = {
                email: email,
                code: verify_code
            }

            this.props.FindIdByEmail(data)
        } else if (verificationMethod == 3) {
            if (!checkFindAddr) {
                Toast.show("주소찾기를 눌러 정확한 주소를 검색해주세요.")
                return
            }

            const data = {
                shop_address1: shop_address1,
                shop_address2: shop_address2
            }

            this.props.FindIdByAddress(data)
        }
    }

    onPressOk() {
        const {err} = this.props

        this.setState({isModal: false})

        if (err == false)
            this.props.navigation.navigate('LoginCeoScreen')  // 로그창으로 간다
    }

    MobileComponent() {
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
                    style={[styles.inputWrapper, {marginTop: 30}, errorMsg.mobilewrong ? {borderBottomColor: theme.primary} : null]}>
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
                {errorMsg.mobilewrong ?
                    <Text style={styles.errText}> {language.INPUT_AGAIN_MOBILE_NUMBER} </Text> : null}

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

    EmailComponent() {
        const {
            errorMsg,
            otpCodeChecked2,
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

                    {otpCodeChecked2 ? <Icon name={'check'} size={20} color={theme.primary}/>
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

    // ShopAddressComponent () {
    //   const { address1, address2 } = this.state
    //   return (
    //     <View>
    //       <View style={[styles.inputWrapper, {marginTop: 30}]}>
    //         <View style={{flex: 1, flexDirection: "row"}}>
    //           <TextInput
    //             style={CommonStyle.input}
    //             autoCapitalize="none"
    //             value={address1}
    //             placeholder={language.ADDRESS}
    //             onChangeText={(text) => this.onChangeAddress1Text(text)}
    //           />
    //         </View>
    //         <View>
    //           <TouchableOpacity style={{borderColor: theme.grey1, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4}}
    //             onPress = {() => this.onPressFindAddress()}>
    //             <Text style={styles.textDuplicatedCheck}>
    //               {language.FIND_ADDRESS}
    //             </Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //       <View style={[styles.inputWrapper]}>
    //       <View style={{flex: 1, flexDirection: "row"}}>
    //         <TextInput
    //           style={CommonStyle.input}
    //           autoCapitalize="none"
    //           value={address2}
    //           placeholder={language.DETAIL_ADDRESS}
    //           onChangeText={(text) => this.onChangeAddress2Text(text)}
    //         />
    //       </View>
    //     </View>
    //     </View>
    //   )
    // }
    ShopAddressComponent() {
        const {shop_address1, shop_address2, isAddrSearchLoading} = this.state
        return (
            <View style={{marginTop: 30}}>
                <View style={[styles.inputWrapper]}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <TextInput
                            style={CommonStyle.input}
                            autoCapitalize="none"
                            value={shop_address1}
                            maxLength={50}
                            placeholder={language.ADDRESS}
                            onChangeText={(text) => this.onChangeShopAddressText(text)}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btnCheck, {borderColor: shop_address1.length > 1 ? theme.primaryDark : theme.grey1}]}
                        onPress={() => this.onPressFinAddress()}>
                        {isAddrSearchLoading == true ?
                            <View style={CommonStyle.row}>
                                <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                <Text
                                    style={[styles.textDuplicatedCheck, {color: shop_address1.length > 1 ? theme.primaryDark : theme.grey1}]}>
                                    {language.FIND_ADDRESS}
                                </Text>
                            </View>
                            :
                            <Text
                                style={[styles.textDuplicatedCheck, {color: shop_address1.length > 1 ? theme.primaryDark : theme.grey1}]}>
                                {language.FIND_ADDRESS}
                            </Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={CommonStyle.input}
                        autoCapitalize="none"
                        value={shop_address2}
                        maxLength={50}
                        placeholder={language.DETAIL_ADDRESS}
                        onChangeText={(text) => this.onChangeShopAddress2Text(text)}
                    />
                </View>
            </View>
        )
    }

    onPressSendEmail() {
        const {email, errorMsg} = this.state

        if (!regexEmail(email.trim())) {
            let errStatus = {
                ...errorMsg,
                emailwrong: 1,
            }
            this.setState({errorMsg: errStatus, sentEmail: false})
            return
        } else {
            // 이메일로 보내는 인증코드 미리 얻기 api 호출, post여야 함. 입구: phonenumber, 출력: otpcode
            this.setState({loadingEmailOrMobileSend: true})
            console.log('getOtpCodebyEmail2');
            getOtpCodebyEmail2(email).then(response => {
                console.log(JSON.stringify(response));
                let errStatus = {
                    ...errorMsg,
                }
                if (response.err == false) {
                    errStatus = {
                        ...errorMsg,
                        emailwrong: 0,
                    }
                    console.log(response.data)

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

    Modal() {
        const {yourid, err} = this.props

        return (
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{marginTop: 0, paddingTop: 0}}>
                        <View style={{alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={() => this.onPressOk()}>
                                <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>

                        {err == false ?
                            <View>
                                <Text style={styles.modalText}>
                                    {language.MEMBER_ID}
                                </Text>
                                <Text style={styles.modalText}>
                                    {
                                        yourid?.map((item, index) => `${item.seller_id}${yourid?.length - 1 === index ? '' : ', '}`)
                                    }
                                </Text>
                                <Text style={styles.modalText}>
                                    {language.IS}
                                </Text>
                            </View>
                            :
                            <View>
                                <Text style={styles.modalText}>
                                    {language.MEMBER_ID1}
                                </Text>
                                <Text style={styles.modalText}>
                                    {language.CANNOT_FIND}
                                </Text>
                            </View>
                        }
                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnLogin}
                                              onPress={() => this.onPressOk()}
                            >
                                <Text style={{
                                    textAlign: "center",
                                    fontSize: theme.fontMedium,
                                    color: theme.white,
                                    fontWeight: 'bold'
                                }}>
                                    {err == false ? language.GO_TO_LOGIN : language.OK}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    headerTab() {
        const {verificationMethod} = this.state
        return (
            <View style={{marginTop: 0}}>
                <View style={styles.verificationMethodWrapper}>
                    <View
                        style={[styles.mobileVeifyWrapper, styles.leftRadius, verificationMethod == 1 ? {backgroundColor: theme.primary} : null]}>
                        <TouchableOpacity onPress={() => this.onPressMobile()}>
                            <Text
                                style={[styles.textverify, verificationMethod == 1 ? {color: theme.white} : {color: theme.grey1}]}>
                                {language.MOBILE_VERIFICATION}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[styles.mobileVeifyWrapper, verificationMethod == 2 ? {backgroundColor: theme.primary} : null]}>
                        <TouchableOpacity onPress={() => this.onPressEmail()}>
                            <Text
                                style={[styles.textverify, verificationMethod == 2 ? {color: theme.white} : {color: theme.grey1}]}>
                                {language.EMAIL_VERIFICATION}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ID 주소로 찾기 */}
                    {/*<View*/}
                    {/*    style={[styles.mobileVeifyWrapper, styles.rightRadius, verificationMethod == 3 ? {backgroundColor: theme.primary} : null]}>*/}
                    {/*    <TouchableOpacity onPress={() => this.onPressShopAddress()}>*/}
                    {/*        <Text*/}
                    {/*            style={[styles.textverify, verificationMethod == 3 ? {color: theme.white} : {color: theme.grey1}]}>*/}
                    {/*            {language.FIND_BY_SHOP_ADDR}*/}
                    {/*        </Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                </View>
            </View>
        )
    }

    bottomComponent() {
        return (
            <View>
                <View style={{marginTop: 30}}>
                    <TouchableOpacity style={styles.btnNext}
                                      onPress={() => this.onPressNext()}
                    >
                        <Text style={{
                            textAlign: "center",
                            fontSize: theme.fontMedium,
                            color: theme.white,
                            fontWeight: 'bold'
                        }}>
                            {language.NEXT}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{marginTop: 30, flexDirection: "row", justifyContent: "space-around"}}>
                    <View style={styles.IDFindWrapper}>
                        <Text style={[styles.firstMaMa]}>
                            {language.FIRST_MAMA}
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("JoinCeoScreen")}>
                            <Text style={[styles.firstMaMa, {color: theme.primary}]}>
                                {language.MEMBER_JOIN}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const {verificationMethod, isModal} = this.state
        const {isLoading} = this.props

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <GeneralStatusBarColor backgroundColor={theme.white}
                                           hidden={true}
                                           barStyle={'light-content'}
                    />

                    <Header leftIcon="angle-left" title={language.ID_FIND} navigation={this.props.navigation}/>

                    {isLoading &&
                    <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isLoading} size="large"
                                       color={theme.primary}/>
                    }

                    <View style={styles.body}>
                        {this.headerTab()}
                        {verificationMethod == 1 && this.MobileComponent()}
                        {verificationMethod == 2 && this.EmailComponent()}
                        {verificationMethod == 3 && this.ShopAddressComponent()}
                        {this.bottomComponent()}
                    </View>
                    {isModal && this.Modal()}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        yourid: state.findinfo.yourid,
        isLoading: state.findinfo.isLoading,
        err: state.findinfo.err
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        FindIdByAddress: (data) => dispatch(FindIdByAddressAction(data)),
        FindIdByEmail: (data) => dispatch(FindIdByEmailAction(data)),
        FindIdByPhone: (data) => dispatch(FindIdByPhoneAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FindIDScreen);

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
    btnNext: {
        borderRadius: 2,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingVertical: 14,
    },
    firstMaMa: {
        color: theme.black,
        fontSize: theme.font14,
        paddingHorizontal: 2
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
        paddingHorizontal: 70,
        fontSize: theme.font18,
        color: theme.black
    },
    textverify: {
        fontSize: theme.font14,
        fontWeight: 'bold'
    },
    btnCheck: {
        borderColor: theme.grey1,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    errText: {
        color: theme.red,
        fontSize: theme.fontSmall
    },
});
