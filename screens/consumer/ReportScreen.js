// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator} from "react-native";
import {useNavigation, useTheme} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import LoginHeader from "../../component/LoginHeader"
import Icon from 'react-native-vector-icons/EvilIcons'
import CheckBox from '@react-native-community/checkbox';
import {connect} from "react-redux";
import {ReportToNewsEventCommentAction} from "../../store/NewsEvent/action";
import {isEmptyCheck} from "../../utils/regex";

class ReportScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newseventitem: this.props.route.params.newseventitem,
            shop_name: this.props.route.params.shop_name,
            shop_id: this.props.route.params.shop_id,
            comment_id: this.props.route.params.comment_id,
            isChecked: false,
            isChecked2: false,
            textMsg: "",
            isModal: false,
            modalMsg: ''
        }

        this.onPressLeftIcon = this.onPressLeftIcon.bind(this)
    }

    componentDidMount() {
        const {token} = this.props
        if (isEmptyCheck(token)) {
            this.props.navigation.goBack();
            return;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {isReportLoading, errCode, errMsg} = this.props

        if (prevProps.isReportLoading != isReportLoading && isReportLoading == false) {
            if (errCode && errMsg === 'Duplicate Data') {
                this.setState({ isModal: true, modalMsg: language.REPORTED_ALREADY })
            }
            else {
                this.setState({ isModal: true, modalMsg: language.SUCCEED_REPORT })
            }
        }
    }

    onPressReport = () => {
        const {newseventitem, textMsg, isChecked, isChecked2, comment_id} = this.state
        const {isLoading, token, customer_id} = this.props
        let reason = []

        if (textMsg.length < 1) return

        if (isChecked && isChecked2) {
            reason.push(1)
            reason.push(2)
        } else if (isChecked) {
            reason.push(1)
        } else if (isChecked2) {
            reason.push(2)
        }

        const data = {
            customer_id,
            comment_id,
            // newsevent_id: newseventitem.id,
            content: textMsg,
            reason
        }

        const sendData = {
            token,
            data,
        }

        this.props.ReportToNewsEventComment(sendData)
    }

    onPressModalOk() {
        const {shop_id} = this.state
        const {currentscreen} = this.props
        this.setState({isModal: false})

        if (currentscreen === "ShopScreen") {
            this.props.navigation.navigate("ShopScreen", {shop_id, tabselect: 2})  //  뉴스/이벤트 태브로 초기화
        } else
            this.props.navigation.navigate("MainScreen")  //  뉴스/이벤트 태브로 초기화
    }

    onChangeText(text) {
        this.setState({textMsg: text})
    }

    Modal() {
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
                            {this.state.modalMsg}
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

    onPressLeftIcon() {
        this.props.navigation.goBack()
    }

    render() {
        const {isChecked, isChecked2, textMsg, shop_name, newseventitem, isModal} = this.state
        const {isReportLoading} = this.props

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <LoginHeader leftIcon="angle-left" title={language.REPORTING} navigation={this.props.navigation}
                             onPressLeftIcon={this.onPressLeftIcon}/>

                {isReportLoading &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isReportLoading} size="large"
                                   color={theme.primary}/>
                }

                <View style={styles.body}>
                    <View style={{alignItems: "center", marginHorizontal: 10}}>
                        <Text style={[styles.title, {fontWeight: "bold", fontSize: theme.font18}]}>
                            {shop_name}
                        </Text>
                        <Text style={[styles.title, {fontWeight: "bold"}]}>
                            {newseventitem?.title}
                        </Text>
                        <Text style={[styles.title, {color: theme.primaryDark}]}>
                            {language.REPORT_FOR}
                        </Text>
                    </View>

                    <View style={{marginTop: 30}}>
                        <Text style={CommonStyle.textTitle}>
                            {language.CONTENT}
                        </Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[CommonStyle.input]}
                                autoCapitalize="none"
                                value={textMsg}
                                multiline
                                maxLength={80}
                                placeholder={language.INPUT_HERE}
                                onChangeText={(text) => this.onChangeText(text)}
                            />
                        </View>
                    </View>

                    <View style={{marginTop: 40}}>
                        <Text style={CommonStyle.textTitle}>
                            {language.REPORT_REASON}
                        </Text>

                        <View style={{marginTop: 20}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
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
                                    {language.PROFANITY_CONDEMNATION}
                                </Text>
                            </View>
                            <View style={{flexDirection: "row", alignItems: "center", marginTop: 10}}>
                                <CheckBox
                                    // hideBox
                                    style={CommonStyle.checkbox}
                                    value={isChecked2}
                                    onValueChange={() => this.setState({isChecked2: !isChecked2})}
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
                                    {language.OBSCENE_YOUTH}
                                </Text>
                            </View>
                        </View>

                    </View>

                </View>

                <View style={{position: "absolute", width: "100%", bottom: 10}}>
                    <TouchableOpacity
                        style={[styles.btnReport, {backgroundColor: textMsg.length < 1 ? theme.grey1 : theme.primary}]}
                        onPress={() => this.onPressReport()}
                    >
                        <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                            {language.REPORTING}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isModal && this.Modal()}

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customer_id: state.customer.customer_id,
        token: state.customer.token,
        currentscreen: state.userstatus.currentscreen,
        isLoading: state.customer.isLoading,
        isReportLoading: state.newsevent.isReportLoading,
        errCode: state.newsevent.err,
        errMsg: state.newsevent.message,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        ReportToNewsEventComment: (data) => dispatch(ReportToNewsEventCommentAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);

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
    btnReport: {
        borderRadius: 6,
        backgroundColor: theme.grey1,
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        shadowColor: 'rgba(47, 47, 47, 1)',
        shadowOffset: {width: 6, height: 6},
        shadowRadius: 5,
        elevation: 3,
    },
    inputWrapper: {
        flexDirection: "row",
        width: "100%",
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        alignItems: "center"
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
        fontSize: theme.fontMedium,
        color: theme.black
    },
});
