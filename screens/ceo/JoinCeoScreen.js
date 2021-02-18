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
    Keyboard,
    TouchableWithoutFeedback
} from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {connect} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import {CommonStyle} from "../../constants/style";
import {checkDuplicatedId, checkDuplicatedShopName, getOtpCodebyEmail, requestVerificationCode} from "../../utils/api";
import {GetBusinessCategoryAction} from "../../store/Shop/action";
import {RegisterAction} from "../../store/CeoAuth/action";
import Toast from 'react-native-simple-toast';
import {setTermsAgreeAction} from "../../store/Config/action";
import {isEmptyCheck, regexEmail, regexMobilePhone} from "../../utils/regex";


class JoinCeoScreen extends React.Component {

    state = {
        verify_method: "phone",  // phone or email
        isModal: false,
        errorMsg: {},
        BIG_CATEGORY: [],
        SUB_CATEGORY: [],
        verify_code2: "", // got from server
        isOtpSendLoading: false,
        seller_id: "",
        password: "",
        password2: "",
        phone_number: "",
        email: "",
        verify_code: "",
        shop_name: "",
        shop_address1: "",
        shop_address2: "",
        latitude: 0,
        longitude: 0,
        isAddrSearchLoading: false,
        large_category_id: "",
        sub_category_id: "",
        business_number: "",
        business_image: {uri: "", type: "", name: ""},
        terms_flag: this.props.isAgree,
        loadingIdCheck: false,
        IdCheckResult: false,
        checkFindAddr: false, // 가게주소 검색 체크(경위도, 지번 혹은 도로명이 존재)
        sentMobile: false,  // firebase에 폰을 통해 otp요청을 보냈는가?
        sentEmail: false,  // 서버에 이메일을 통해 otp요청을 보냈는가?
        otpCodeChecked: false,
        loadingShopNameCheck: false,
        shopNameCheckResult: false,
        loadingEmailOrMobileSend: false,
        confirmation: null,
    }

    componentDidMount() {
        const errorMsg = {
            id12: 0,
            idwrong: 0,
            pwwrong: 0, // 0: 4자리이상 입력, 1: 허용
            pwwrong2: 0,  // 비번 확인
            mobilewrong: 0,
            emailwrong: 0,
            otpwrong: 0,
            shopnamewrong: 0,
            shopnameused: 0,  // 0: 중복검사 못함. 1: 중복됨, 2: 중복검사 한 결과 중복되지 않음
        }
        this.setState({errorMsg})

        this.props.GetBusinessCategory()

        // auth().settings.appVerificationDisabledForTesting = true
        // auth().languageCode = 'kr'
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            businessCategory,
            isJoinLoading,
            err,
            isAgree,
            selectedAddress
        } = this.props

        if (prevProps.businessCategory != businessCategory) {
            let big_category_list = []

            businessCategory?.map((item) => {

                let sub_category_list = []
                item?.subCategories.map((subItem) => {
                    let subCategory = {
                        label: subItem.name,
                        value: subItem.id
                    }
                    sub_category_list.push(subCategory)
                })

                let oneCategory = {
                    label: item.name,
                    value: item.id
                }

                big_category_list.push(oneCategory)
            })

            this.setState({BIG_CATEGORY: big_category_list})
        }
        if (prevProps.isJoinLoading != isJoinLoading && isJoinLoading == false) {
            if (err == false)
                this.setState({isModal: true})
            else
                Toast.show("회원가입이 실패했습니다.")
        }

        if (prevProps.isAgree != isAgree) {
            this.setState({terms_flag: isAgree})
        }

        if ((prevProps.selectedAddress !== selectedAddress) && !isEmptyCheck(selectedAddress)) {
            const {
                longitude,
                latitude,
                address_name,
                road_address_name
            } = selectedAddress;

            this.setState({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                shop_address1: address_name,
                shop_address2: road_address_name,
                // isAddrSearchLoading: false,
                checkFindAddr: true
            })
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

    onPressCheckId() {
        const {seller_id, errorMsg} = this.state

        if (seller_id == "") {
            let errStatus = {
                ...errorMsg,
                id12: 1,
            }
            this.setState({errorMsg: errStatus})
            return
        }
        if (seller_id.length < 3) {
            Toast.show("최소 3자이상이어야 합니다.")
            return
        } else {
            this.setState({loadingIdCheck: true})
            checkDuplicatedId(seller_id).then(response => {
                console.log(response)
                let errStatus = {
                    ...errorMsg
                }
                if (response?.data == true) {
                    errStatus = {
                        ...errorMsg,
                        id12: 0,
                        idwrong: 2,
                    }
                } else {
                    errStatus = {
                        ...errorMsg,
                        id12: 0,
                        idwrong: 1,
                    }
                }
                this.setState({errorMsg: errStatus, IdCheckResult: response?.data, loadingIdCheck: false})
            })
            return
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
        }
        else {
            // 이메일로 보내는 인증코드 미리 얻기 api 호출, post여야 함. 입구: phonenumber, 출력: otpcode
            this.setState({loadingEmailOrMobileSend: true})
            getOtpCodebyEmail(email).then(response => {
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

    // 가게 상호명 중복검사
    onPressCheckShopName() {
        const {shop_name, errorMsg} = this.state

        if (shop_name == "") {
            let errStatus = {
                ...errorMsg,
                shopnamewrong: 1,
            }
            this.setState({errorMsg: errStatus})
            return
        } else {
            this.setState({loadingShopNameCheck: true})
            checkDuplicatedShopName(shop_name).then(response => {
                let errStatus = {
                    ...errorMsg
                }
                if (response?.data == true) {
                    errStatus = {
                        ...errorMsg,
                        shopnamewrong: 0,
                        shopnameused: 2,
                    }
                } else {
                    errStatus = {
                        ...errorMsg,
                        shopnamewrong: 0,
                        shopnameused: 1,
                    }
                }
                this.setState({errorMsg: errStatus, shopNameCheckResult: response?.data, loadingShopNameCheck: false})
            })
            return
        }
    }

    onChangeShopAddressText(text) {
        if (isEmptyCheck(text)) {
            this.setState({ shop_address1: text, checkFindAddr: false })
        }
        else {
            this.setState({shop_address1: text})
        }
    }

    onChangeShopAddress2Text(text) {
        if (isEmptyCheck(text)) {
            this.setState({ shop_address2: text, checkFindAddr: false })
        }
        else {
            this.setState({shop_address2: text})
        }
    }

    onChangeText(text) {
        this.setState({seller_id: text})
    }

    onChangeBusinessAuthNumberText(text) {
        this.setState({business_number: text})
    }

    onChangeIdText(text) {
        this.setState({seller_id: text, IdCheckResult: false})
    }

    onChangePasswordText(text) {
        const {errorMsg} = this.state

        this.setState({password: text})
        let errStatus = {
            ...errorMsg,
            pwwrong: 0,
        }

        if (text.length < 4) {
            errStatus = {
                ...errorMsg,
                pwwrong: 1,
            }
        }

        this.setState({errorMsg: errStatus})
    }

    onChangePasswordText2(text) {
        const {errorMsg, password} = this.state

        this.setState({password2: text})
        let errStatus = {
            ...errorMsg,
            pwwrong2: 0,
        }

        if (text != password) {
            errStatus = {
                ...errorMsg,
                pwwrong2: 1,
            }
        } else if (text == password) {
            errStatus = {
                ...errorMsg,
                pwwrong2: 2,
            }
        }

        this.setState({errorMsg: errStatus})
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

    onChangeShopNameText(text) {
        this.setState({shop_name: text, shopNameCheckResult: false})
    }

    onPressMobile() {
        this.setState({verify_method: "phone", verify_code: "", otpCodeChecked: false})
    }

    onPressEmail() {
        this.setState({verify_method: "email", verify_code: "", otpCodeChecked: false})
    }

    onPressJoin() {
        const {
            seller_id,
            password,
            password2,
            phone_number,
            email,
            verify_code,
            shop_name,
            shop_address1,
            shop_address2,
            latitude,
            longitude,
            large_category_id,
            sub_category_id,
            business_number,
            business_image,
            terms_flag,
            errorMsg,
            verify_method,
            otpCodeChecked,
            checkFindAddr,
            IdCheckResult,
            shopNameCheckResult
        } = this.state

        if (seller_id?.length < 2) {
            Toast.show("아이디를 입력해주세요")
            return
        }
        if (!IdCheckResult) { // 아이디가 없거나 중복검사 안됐으면
            Toast.show("아이디 중복확인을 해주세요")
            return
        }
        if (errorMsg.idwrong != 2) { // 아이디가 없거나 중복검사 안됐으면
            Toast.show("아이디 중복확인을 해주세요")
            return
        }
        if (password?.length < 4) {
            let errStatus = {
                ...errorMsg,
                pwwrong: 1,
            }
            this.setState({errorMsg: errStatus})
            return
        }

        if (password != password2) { // 암호가 일치하지 않으면
            Toast.show(language.PASSORD_INCORRECT)
            return
        }

        if (verify_method == "phone" && !regexMobilePhone(phone_number)) { // 폰인증
            let errStatus = {
                ...errorMsg,
                mobilewrong: 1,
            }
            this.setState({errorMsg: errStatus})
            return
        }
        if (verify_method == "email" && !regexEmail(email)) { // 이메일인증
            let errStatus = {
                ...errorMsg,
                emailwrong: 1,
            }
            this.setState({errorMsg: errStatus})
            return
        }

        if (!otpCodeChecked) {  //  OTP 인증 안됐으면
            Toast.show("전화번호/이메일 인증을 해주세요.")
            return
        }
        if (shop_name?.length < 2 || errorMsg.shopnameused != 2 || !shopNameCheckResult) { // 가게상호명 체크 안됐으면
            Toast.show("가게상호명을 중복확인 해주세요.")
            return
        }
        if (!checkFindAddr) {
            Toast.show("주소입력이 잘못되었습니다.")
            return
        }
        if (large_category_id == "") { // 대 카테고리 선택안했으면, 대 카테고리 선택시, 중 카테고리 자동적으로 첫번째것으 선택됨.
            Toast.show("가게 업종을 선택해주세요.")
            return
        }

        // if (business_number === '') {
        //     Toast.show("사업자 등록번호를 입력해주세요.")
        //     return
        // }
        // else {
        //     if (business_number?.length < 10) {
        //         Toast.show("사업자 등록번호를 다시 확인해주세요.")
        //         return
        //     }
        // }
        //
        // if (business_image?.uri?.length < 1) {
        //     Toast.show("등록증을 업로드해주세요")
        //     return
        // }

        let data = new FormData();
        data.append('seller_id', seller_id)
        data.append('password', password)
        data.append('verify_method', verify_method)

        if (verify_method == "phone") {
            data.append('phone_number', phone_number)
            data.append('email', "")
        } else {  // email
            data.append('phone_number', "")
            data.append('email', email)
        }

        data.append('verify_code', verify_code)
        data.append('shop_name', shop_name)
        data.append('shop_address1', shop_address1)
        data.append('shop_address2', shop_address2)
        data.append('latitude', latitude)
        data.append('longitude', longitude)
        data.append('large_category_id', large_category_id)
        data.append('sub_category_id', sub_category_id)
        data.append('business_number', business_number)
        data.append('business_image', business_image)
        data.append('terms_flag', terms_flag)

        this.props.JoinCeo(data)
    }

    onPressModalOk() {
        this.setState({isModal: false})
        this.props.navigation.navigate("LoginCeoScreen")
    }

    onChangeBigCategory(selItem) {
        const {businessCategory} = this.props

        const sub_category = businessCategory.find((item) => item.id == selItem.value)

        let sub_category_list = []
        sub_category?.subCategories.map((subItem) => {
            let subCategory = {
                label: subItem.name,
                value: subItem.id
            }
            sub_category_list.push(subCategory)
        })

        if (sub_category_list.length < 1) {
            let subCategory = {
                label: "",
                value: "",
            }
            sub_category_list.push(subCategory)
        }
        this.setState({
            SUB_CATEGORY: sub_category_list,
            sub_category_id: sub_category_list[0].value,
            large_category_id: selItem.value
        })
    }

    onChangeSubCategory(selItem) {
        this.setState({sub_category_id: selItem.value})
    }

    onPressFindAddress() {
        const {checkFindAddr, shop_address1} = this.state;
        if (!checkFindAddr && isEmptyCheck(shop_address1)) {
            this.props.navigation.navigate('AddressFindScreen');
        }
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

                        <Text style={styles.modalText}>
                            {language.MEMBER_JOIN_DONE}
                        </Text>
                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnLogin}
                                              onPress={() => this.onPressModalOk()}
                            >
                                <Text
                                    style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                    {language.GO_TO_LOGIN}
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
            <View style={{marginTop: 20}}>
                <Text style={styles.itemTitle}>
                    {language.SELF_VERIFICATION_METHOD}
                </Text>
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
                    <TouchableOpacity style={[styles.btnJoin, terms_flag ? {backgroundColor: theme.primary} : null]}
                                      onPress={() => terms_flag ? this.onPressJoin() : Toast.show('약관에 동의를 체크해 주세요.')}
                    >
                        <Text style={styles.textJoin}>
                            {language.MEMBER_JOIN}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 50}}/>
            </View>
        )
    }

    IdPasswordView() {
        const {errorMsg, seller_id, password, IdCheckResult, loadingIdCheck, password2} = this.state
        return (
            <>
                {/* 아이디 */}
                <View>
                    <Text style={styles.itemTitle}>{language.ID}</Text>
                    <View
                        style={[styles.inputWrapper, (errorMsg.id12 || errorMsg.idwrong == 1) ? {borderBottomColor: theme.primary} : null]}>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <TextInput
                                style={CommonStyle.input}
                                autoCapitalize="none"
                                value={seller_id}
                                maxLength={12}
                                placeholder={language.INPUT_12_CHARACTER}
                                onChangeText={(text) => this.onChangeIdText(text)}
                            />
                        </View>
                        {/* 중복체크 - true: check icon 표시, false: 중복확인 버튼 */}
                        {!IdCheckResult ?
                            <TouchableOpacity
                                style={[styles.btnCheck, {borderColor: seller_id.length > 3 ? theme.primaryDark : theme.grey1}]}
                                onPress={() => this.onPressCheckId()}>
                                {loadingIdCheck == true ?
                                    <View style={CommonStyle.row}>
                                        <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                        <Text style={styles.textDuplicatedCheck}>
                                            {language.DUPLICATED_CHECK}
                                        </Text>
                                    </View>
                                    :
                                    <Text
                                        style={[styles.textDuplicatedCheck, {color: seller_id.length > 3 ? theme.primaryDark : theme.grey1}]}>
                                        {language.DUPLICATED_CHECK}
                                    </Text>
                                }
                            </TouchableOpacity>
                            :
                            <Icon name={'check'} size={20} color={theme.primary}/>
                        }
                    </View>
                    {errorMsg.id12 ? <Text style={styles.errText}> {language.INPUT_12_CHARACTER} </Text> : null}
                    {errorMsg.idwrong == 1 ? <Text style={styles.errText}> {language.ID_ALREADY_EXIST} </Text> : null}
                </View>

                {/* 비밀번호 */}
                <View style={{marginTop: 20}}>
                    <Text style={styles.itemTitle}>
                        {language.SECRET_NUMBER}
                    </Text>
                    <View style={[styles.inputWrapper, (errorMsg.pwwrong) ? {borderBottomColor: theme.primary} : null]}>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <TextInput
                                style={CommonStyle.input}
                                autoCapitalize="none"
                                value={password}
                                minLength={4}
                                maxLength={50}
                                secureTextEntry={true}
                                placeholder={language.PASSORD_INPUT}
                                onChangeText={(text) => this.onChangePasswordText(text)}
                            />
                        </View>
                    </View>
                    {errorMsg.pwwrong ? <Text style={styles.errText}> {language.INPUT_4OVER_CHARACTER} </Text> : null}
                </View>

                {/* 비밀번호 확인*/}
                <View style={{marginTop: 20}}>
                    <Text style={styles.itemTitle}>
                        {language.PASSORD_CONFIRM}
                    </Text>
                    <View
                        style={[styles.inputWrapper, (password2.length > 0 && errorMsg.pwwrong2 != 2) ? {borderBottomColor: theme.primary} : null]}>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <TextInput
                                style={CommonStyle.input}
                                autoCapitalize="none"
                                value={password2}
                                minLength={4}
                                maxLength={50}
                                secureTextEntry={true}
                                placeholder={language.PASSORD_INPUT}
                                onChangeText={(text) => this.onChangePasswordText2(text)}
                            />
                        </View>
                    </View>
                    {errorMsg.pwwrong2 == 1 ? <Text style={styles.errText}> {language.PASSORD_INCORRECT} </Text> : null}
                </View>
            </>
        )
    }

    ShopNameView() {
        const {
            errorMsg,
            shop_name,
            shop_address1,
            shop_address2,
            shopNameCheckResult,
            loadingShopNameCheck,
            isAddrSearchLoading,
            checkFindAddr
        } = this.state
        return (
            <View style={{marginTop: 20}}>
                <View>
                    <Text style={styles.itemTitle}>
                        {language.SHOP_BUSINESS_NAME}
                    </Text>

                    <View style={[styles.inputWrapper]}>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <TextInput
                                style={CommonStyle.input}
                                autoCapitalize="none"
                                value={shop_name}
                                maxLength={50}
                                placeholder={language.BUSINESS_NAME}
                                onChangeText={(text) => this.onChangeShopNameText(text)}
                            />
                        </View>

                        {!shopNameCheckResult ?
                            <TouchableOpacity
                                style={[styles.btnCheck, {borderColor: shop_name.length > 1 ? theme.primaryDark : theme.grey1}]}
                                onPress={() => this.onPressCheckShopName()}>
                                {loadingShopNameCheck == true ?
                                    <View style={CommonStyle.row}>
                                        <ActivityIndicator size={theme.fontMedium} color={theme.primary}/>
                                        <Text style={styles.textDuplicatedCheck}>
                                            {language.DUPLICATED_CHECK}
                                        </Text>
                                    </View>
                                    :
                                    <Text
                                        style={[styles.textDuplicatedCheck, {color: shop_name.length > 1 ? theme.primaryDark : theme.grey1}]}>
                                        {language.DUPLICATED_CHECK}
                                    </Text>
                                }
                            </TouchableOpacity>
                            :
                            <Icon name={'check'} size={20} color={theme.primary}/>
                        }

                    </View>
                    {errorMsg.shopnamewrong ?
                        <Text style={styles.errText}> {language.INPUT_AGAIN_SHOP_BUSINESS_NAME} </Text> : null}
                    {errorMsg.shopnameused == 1 ?
                        <Text style={styles.errText}> {language.SHOP_NAME_ALREADY_EXIST} </Text> : null}
                </View>

                <View style={{marginTop: 20}}>
                    <Text style={styles.itemTitle}>
                        {language.SHOP_ADDRESS}
                    </Text>

                    <View style={[styles.inputWrapper]}>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            {checkFindAddr ?
                                <TextInput
                                    style={CommonStyle.input}
                                    autoCapitalize="none"
                                    value={shop_address1}
                                    maxLength={50}
                                    placeholder={language.ADDRESS}
                                    onChangeText={(text) => this.onChangeShopAddressText(text)}
                                /> :
                                <TouchableOpacity style={{width: '100%'}} onPress={() => this.onPressFindAddress()}>
                                    <Text style={[CommonStyle.input, {paddingVertical: 15, color: theme.grey1}]}>
                                        {language.ADDRESS}
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>

                        <TouchableOpacity
                            style={[styles.btnCheck, {borderColor: shop_address1.length > 1 ? theme.primaryDark : theme.grey1}]}
                            onPress={() => this.props.navigation.navigate('AddressFindScreen')}>
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
                        {checkFindAddr ?
                            <TextInput
                                style={CommonStyle.input}
                                autoCapitalize="none"
                                value={shop_address2}
                                maxLength={50}
                                placeholder={language.DETAIL_ADDRESS}
                                onChangeText={(text) => this.onChangeShopAddress2Text(text)}
                            /> :
                            <TouchableOpacity style={{width: '100%'}} onPress={() => this.onPressFindAddress()}>
                                <Text style={[CommonStyle.input, {paddingVertical: 15, color: theme.grey1}]}>
                                    {language.DETAIL_ADDRESS}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>
        )
    }

    BusinessTypeView() {
        const {BIG_CATEGORY, SUB_CATEGORY, sub_category_id} = this.state

        return (
            <View style={styles.businessTypeWrapper}>
                <Text style={styles.itemTitle}>
                    {language.SHOP_BUSINESS_TYPE}
                </Text>

                <View style={{width: "100%", flexDirection: "row"}}>
                    {BIG_CATEGORY.length > 0 &&
                    <View style={{width: "50%", paddingRight: 5}}>
                        <DropDownPicker
                            items={BIG_CATEGORY}
                            placeholder={language.BUSINESS_TYPE}
                            placeholderStyle={styles.placeholder}
                            containerStyle={styles.dropDownPickerStyle}
                            itemStyle={{justifyContent: 'flex-start'}}
                            labelStyle={styles.labelStyle}
                            onChangeItem={item => this.onChangeBigCategory(item)}
                        />
                    </View>
                    }
                    {SUB_CATEGORY.length > 0 &&
                    <View style={{width: "50%", paddingLeft: 5}}>
                        <DropDownPicker
                            items={SUB_CATEGORY}
                            placeholder={language.SUBCATEGORY_TYPE}
                            placeholderStyle={styles.placeholder}
                            containerStyle={styles.dropDownPickerStyle}
                            itemStyle={{justifyContent: 'flex-start'}}
                            labelStyle={styles.labelStyle}
                            defaultValue={sub_category_id}
                            onChangeItem={item => this.onChangeSubCategory(item)}
                        />
                    </View>
                    }

                    {BIG_CATEGORY.length < 1 &&
                    <View style={{width: "50%", paddingRight: 5}}>
                        <DropDownPicker
                            items={BIG_CATEGORY}
                            placeholder={language.BUSINESS_TYPE}
                            placeholderStyle={styles.placeholder}
                            containerStyle={styles.dropDownPickerStyle}
                            itemStyle={{justifyContent: 'flex-start'}}
                            labelStyle={styles.labelStyle}
                            onChangeItem={item => this.onChangeBigCategory(item)}
                        />
                    </View>
                    }
                    {SUB_CATEGORY.length < 1 &&
                    <View style={{width: "50%", paddingLeft: 5}}>
                        <DropDownPicker
                            items={SUB_CATEGORY}
                            placeholder={language.SUBCATEGORY_TYPE}
                            placeholderStyle={styles.placeholder}
                            containerStyle={styles.dropDownPickerStyle}
                            itemStyle={{justifyContent: 'flex-start'}}
                            labelStyle={styles.labelStyle}
                            onChangeItem={item => this.onChangeSubCategory(item)}
                        />
                    </View>
                    }
                </View>
            </View>
        )
    }

    openCamera() {
        // this.RBSheet.close()

        ImagePicker.openCamera({
            // width: 300,
            // height: 300,
            cropping: true
        }).then(image => {
            const filename = image.path.replace(/^.*[\\\/]/, '')
            const source = {
                uri: Platform.OS == 'android' ? image.path : image.path.replace('file://', ''),
                type: image.mime,
                name: `${filename}`
            };
            this.setState({business_image: source})

        }).catch(err => {
            console.log(err)
        });
    }

    openGallery() {
        // this.RBSheet.close()

        ImagePicker.openPicker({
            // width: 300,
            // height: 300,
            cropping: true
        }).then(image => {
            const filename = image.path.replace(/^.*[\\\/]/, '')
            const source = {
                uri: Platform.OS == 'android' ? image.path : image.path.replace('file://', ''),
                type: image.mime,
                name: `${filename}`
            };
            this.setState({business_image: source})

        }).catch(err => {
            console.log(err)
        });
    }

    onPressedPhoto = () => {
        this.RBSheet.open()
    }

    BusinessRegistrationNumberView() {
        const {business_number, business_image} = this.state

        return (
            <View style={{marginTop: 20}}>
                <Text style={styles.itemTitle}>
                    {language.BUSINESS_REGISTRATION_NUMBER}
                </Text>

                <View style={[styles.inputWrapper]}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <TextInput
                            style={CommonStyle.input}
                            autoCapitalize="none"
                            value={business_number}
                            placeholder={"000-000-00000"}
                            onChangeText={(text) => this.onChangeBusinessAuthNumberText(text)}
                        />
                    </View>

                    <View>
                        <TouchableOpacity
                            style={[styles.btnCheck, {color: !isEmptyCheck(business_number) ? theme.primaryDark : theme.grey1}]}
                            onPress={() => this.onPressedPhoto()}
                        >
                            <Text
                                style={[styles.textDuplicatedCheck, {color: !isEmptyCheck(business_number) ? theme.primaryDark : theme.grey1}]}>
                                {language.REGISTRATION_UPLOAD}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {!isEmptyCheck(business_image?.uri) &&
                <View style={styles.business_image}>
                    <Image source={{uri: business_image.uri}} style={{width: "100%", height: "100%"}}/>
                </View>
                }
            </View>
        )
    }

    TermsView() {
        const {terms_flag} = this.state

        return (
            <View style={{flexDirection: "row", alignItems: "center", marginTop: 20}}>
                <CheckBox
                    // hideBox
                    style={CommonStyle.checkbox}
                    value={terms_flag}
                    onValueChange={() => this.setState({terms_flag: !terms_flag})}
                    boxType="square"
                    tintColor={theme.grey1}
                    onCheckColor={theme.white}
                    onFillColor={theme.primary}
                    onTintColor={theme.grey1}
                    tintColors={{true: theme.primary, false: theme.grey1}}
                />
                <Text
                    style={styles.textBase}
                >
                    {language.ARE_YOU_AGREE}
                </Text>
                <TouchableOpacity style={{paddingLeft: 10}}
                                  onPress={() => this.props.navigation.navigate("TermsScreen")}>
                    <Text style={styles.detailTerms}>
                        {language.TERMS_DETAIL_SHOW}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    BottomSheet() {
        return (
            <RBSheet
                closeOnDragDown={true}
                closeOnPressMask={false}
                ref={ref => {
                    this.RBSheet = ref;
                }}
                height={200}
                openDuration={250}
                customStyles={{
                    container: {
                        alignItems: "center",
                        borderTopRightRadius: 35,
                        borderTopLeftRadius: 35,
                        justifyContent: 'space-evenly',
                        backgroundColor: theme.white,
                    }
                }}
            >
                <View style={{width: '100%', padding: 20, alignItems: "center"}}>
                    <TouchableOpacity onPress={() => this.openCamera()} style={CommonStyle.applybtn}>
                        <Text style={CommonStyle.btntext}>사진 촬영</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openGallery()} style={CommonStyle.applybtn}>
                        <Text style={CommonStyle.btntext}>앨범 선택</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.RBSheet.close()} style={CommonStyle.applybtn}>
                        <Text style={CommonStyle.btntext}>취소</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        )
    }

    render() {
        const {verify_method, isModal} = this.state
        const {isJoinLoading} = this.props

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <GeneralStatusBarColor backgroundColor={theme.white}
                                           hidden={true}
                                           barStyle={'light-content'}
                    />

                    <Header leftIcon="angle-left" title={language.REGISTER_CEO} navigation={this.props.navigation}/>

                    {isJoinLoading &&
                    <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isJoinLoading} size="large"
                                       color={theme.primary}/>
                    }
                    <ScrollView style={styles.body}
                                showsVerticalScrollIndicator={false}
                    >
                        {this.IdPasswordView()}
                        {this.SelfVerifyMethod()}
                        {verify_method == "phone" && this.MobileView()}
                        {verify_method == "email" && this.EmailView()}
                        {this.ShopNameView()}
                        {this.BusinessTypeView()}
                        {this.BusinessRegistrationNumberView()}
                        {this.TermsView()}
                        {this.bottomView()}

                    </ScrollView>
                    {this.BottomSheet()}
                    {isModal && this.Modal()}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isJoinLoading: state.session.isJoinLoading,
        err: state.session.err,
        businessCategory: state.shop.businessCategory,
        isAgree: state.userstatus.isAgree,
        selectedAddress: state.shop.selectedAddress
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetBusinessCategory: () => dispatch(GetBusinessCategoryAction()),
        JoinCeo: (data) => dispatch(RegisterAction(data)),
        setTermsAgree: (data) => dispatch(setTermsAgreeAction(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinCeoScreen);

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
