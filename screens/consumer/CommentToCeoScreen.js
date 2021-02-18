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
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import {useNavigation, useTheme} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import {connect} from "react-redux";
import {ReportToCeoAction} from "../../store/Shop/action";
import {GetCeoReportInfoAction, UpdateCeoReportAction} from "../../store/CeoReport/action";
import {isEmptyCheck} from "../../utils/regex";
import {SetCurrentScreenAction} from "../../store/Config/action";

class CommentToCeoScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            defaultRating: 4,
            maxRating: [1, 2, 3, 4, 5],
            textMessage: "",
            isModal: false,
            report: this.props.route?.params?.report,
            shop_id: this.props.route?.params?.shop_id,
            isNewRegister: true
        }
    }

    componentDidMount() {
        const {token} = this.props
        if (isEmptyCheck(token)) {
            this.props.navigation.goBack();
            return;
        }

        if (this.props.route?.params?.report?.id == undefined) {// 새로운 사장님께 바란다 작성하기이면
            // 기정값 이용
        } else {  // 수정 이면
            const isChecked = this.props.route?.params?.report?.hide_customers == 1 ? true : false
            const defaultRating = this.props.route?.params?.report?.rating
            const textMessage = this.props.route?.params?.report?.content
            this.setState({isChecked, defaultRating, textMessage})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {isReportToCeoLoading, isGetCeoReportLoading, isUpdateLoading} = this.props
        const {shop_id} = this.state

        if (prevProps.isReportToCeoLoading !== isReportToCeoLoading && !isReportToCeoLoading) {
            this.setState({isNewRegister: true, isModal: true})
        }

        if (prevProps.isUpdateLoading !== isUpdateLoading && !isUpdateLoading) {
            this.setState({isNewRegister: false, isModal: true})
        }

        // if (prevProps.isGetCeoReportLoading != isGetCeoReportLoading && isGetCeoReportLoading == false) {
        //   this.setState({isModal: false})
        //   this.props.navigation.navigate("ShopScreen", {shop_id: shop_id, tabselect: 3})  // 사장님께 바란다 태브로 초기화
        // }
    }

    onPressModalOk() {
        this.props.SetCurrentScreen('CommentToCeoScreen');
        this.setState({isModal: false});
        // this.getCeoReport();
        const {shop_id} = this.state;
        const {report} = this.props.route.params;

        this.props.navigation.navigate('ShopScreen', {report, shop_id, selectedTab: 3, index: 2});
    }

    onPressRegister = () => {
        const {isChecked, defaultRating, textMessage, report, shop_id} = this.state
        const {token, customer_id} = this.props

        if (textMessage == "")
            return

        if (this.props.route?.params?.report?.id == undefined) { // 새로운 사장님께 바란다 작성하기이면
            const data = {
                customer_id: customer_id,
                shop_id: shop_id,
                content: textMessage,
                rating: defaultRating,
                hide_customers: isChecked,
            }
            const sendData = {
                data,
                token
            }
            this.props.ReportToCeo(sendData)
        } else { // 수정이면
            const data = {
                content: textMessage,
                rating: defaultRating,
                hide_customers: isChecked,
            }
            const sendData = {
                token,
                data,
                id: this.props.route?.params?.report?.id
            }
            this.props.UpdateCeoReport(sendData)
        }
    }

    onChangeText(text) {
        this.setState({textMessage: text})
    }

    _valueChanged(rating) {
        // console.log("Rating is: " + rating)
    }

    CustomRatingBar = () => {
        const {maxRating, defaultRating} = this.state

        return (
            <View style={styles.customRatingBarStyle}>
                {maxRating.map((item, key) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={item}
                            style={{paddingHorizontal: 10}}
                            onPress={
                                () => {
                                    if (this.props.route?.params?.report?.id == undefined) {
                                        this.setState({defaultRating: item})
                                    }
                                }}>
                            <Image
                                style={styles.starImageStyle}
                                source={
                                    item <= defaultRating
                                        ? theme.ic_star_foc
                                        : theme.ic_star
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    Modal() {
        const {isNewRegister} = this.state
        return (
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{marginTop: 0, paddingTop: 0}}>
                        <View style={{alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={() => this.onPressModalOk()}>
                                <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalText}>
                            {isNewRegister ? language.SUCCEED_REPORT_TO_CEO : language.UPDATED_REPORT_TO_CEO}
                        </Text>
                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnOK}
                                              onPress={() => this.onPressModalOk()}
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
        const {isChecked, textMessage, isModal} = this.state
        const {isReportToCeoLoading, isGetCeoReportLoading, isUpdateLoading} = this.props
        const flag = isReportToCeoLoading || isGetCeoReportLoading || isUpdateLoading

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <GeneralStatusBarColor backgroundColor={theme.white}
                                           hidden={true}
                                           barStyle={'light-content'}
                    />

                    <Header leftIcon="angle-left" title={language.WRITE_HOPE_CEO} navigation={this.props.navigation}/>

                    {flag &&
                    <ActivityIndicator style={CommonStyle.spinnerStyle} animating={flag} size="large"
                                       color={theme.primary}/>
                    }


                    <View style={styles.body}>

                        <View style={{alignItems: "center", marginHorizontal: 10}}>
                            <Text style={[styles.title]}>
                                {language.TO_BE_HELP_TO_CEO}
                            </Text>
                            <View style={{flexDirection: "row"}}>
                                <Text style={[styles.title, {fontWeight: "bold"}, {color: theme.primaryDark}]}>
                                    {language.MISTAKE_POINTS}
                                </Text>
                                <Text style={[styles.title]}>
                                    을
                                </Text>
                            </View>
                            <Text style={[styles.title]}>
                                {language.LEAVE}
                            </Text>
                        </View>


                        <View style={CommonStyle.inputWrapper}>
                            <Text style={CommonStyle.textTitle}>
                                {language.CONTENT}
                            </Text>
                            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                                <TextInput
                                    style={[CommonStyle.input, CommonStyle.mt_10_ios, {width: "90%"}]}
                                    autoCapitalize="none"
                                    multiline
                                    maxLength={80}
                                    value={textMessage}
                                    placeholder={language.INPUT_HERE}
                                    onChangeText={(text) => this.onChangeText(text)}
                                />
                                <Text style={{
                                    fontSize: theme.fontSmall,
                                    color: theme.grey1,
                                    alignSelf: "flex-end",
                                    paddingBottom: 5
                                }}>
                                    {textMessage.length}/80
                                </Text>
                            </View>
                        </View>

                        { this.props.route?.params?.report?.id == undefined ?
                            (
                                <>
                                    <View style={{marginTop: 30}}>
                                        <Text style={CommonStyle.textTitle}>
                                            {language.STAR_POINT}
                                        </Text>
                                    </View>
                                    {this.CustomRatingBar()}
                                </>
                            ) :
                            null
                        }


                        <View style={{flexDirection: "row", alignItems: "center", marginTop: 50}}>
                            <CheckBox
                                // hideBox
                                style={CommonStyle.checkbox}
                                value={isChecked}
                                onValueChange={() => this.setState({isChecked: !isChecked})}
                                boxType="square"
                                tintColor={theme.grey1}
                                onCheckColor={theme.white}
                                onFillColor={theme.primary}
                                onTintColor={theme.grey1}
                                tintColors={{true: theme.primary, false: theme.grey1}}
                            />
                            <Text
                                style={{
                                    color: theme.black,
                                    fontSize: theme.font14,
                                    paddingLeft: 5
                                }}
                            >
                                {language.COMMENT_ONLY_CEO}
                            </Text>
                            <Image source={theme.ic_privacy}
                                   style={{paddingLeft: 10, width: 18, height: 18, resizeMode: "contain"}}
                            >
                            </Image>
                        </View>

                    </View>

                    <View style={{position: "absolute", width: "100%", bottom: 10}}>
                        <TouchableOpacity
                            style={[styles.btnRegister, {backgroundColor: textMessage.length < 1 ? theme.grey1 : theme.primary}]}
                            onPress={() => this.onPressRegister()}
                        >
                            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                {language.REGISTER}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {isModal && this.Modal()}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customer_id: state.customer.customer_id,
        token: state.customer.token,
        isReportToCeoLoading: state.shop.isReportToCeoLoading,
        isGetCeoReportLoading: state.ceoreport.isLoading,
        isUpdateLoading: state.ceoreport.isUpdateLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ReportToCeo: (data) => dispatch(ReportToCeoAction(data)),
        GetCeoReportInfo: (data) => dispatch(GetCeoReportInfoAction(data)),
        UpdateCeoReport: (data) => dispatch(UpdateCeoReportAction(data)),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentToCeoScreen);

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
        textAlign: 'center',
        paddingVertical: 2,
    },
    btnRegister: {
        borderRadius: 6,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        // shadowColor: 'rgba(47, 47, 47, 1)',
        // shadowOffset: { width: 6, height: 6 },
        // shadowRadius: 5,
        // elevation: 3,
    },
    customRatingBarStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 20,
    },
    starImageStyle: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
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
    btnOK: {
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
});
