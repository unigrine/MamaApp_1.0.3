// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard} from "react-native";
import {useNavigation, useTheme} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import CheckBox from '@react-native-community/checkbox';
import {connect} from 'react-redux';
import {GetCeoReportInfoAction, ReplyCeoReportAction, UpdateReplyByCeoAction} from "../../store/CeoReport/action"
import {getDateFormat} from "../../utils/text_format";

class CommentToConsumerScreen extends React.Component {

    state = {
        isChecked: false,
        item: this.props?.route?.params?.item,
        commentMessage: ""
    }

    componentDidMount() {
        const {item} = this.state
        if (item?.reply?.id != undefined)
            this.setState({commentMessage: item?.reply?.content})
        if (item?.reply?.show_only_reporter == 1)
            this.setState({isChecked: true})
        else
            this.setState({isChecked: false})
    }

    componentDidUpdate(prevProps, prevState) {
        const {isUpdateReplyLoading, isReplyLoading} = this.props
        if (prevProps.isReplyLoading != isReplyLoading && isReplyLoading == false) {
            this.getCeoReport()
            this.props.navigation.goBack()
        }

        if (prevProps.isUpdateReplyLoading != isUpdateReplyLoading && isUpdateReplyLoading == false) {
            this.getCeoReport()
            this.props.navigation.goBack()
        }
    }

    getCeoReport() {
        const {shop_data, token} = this.props
        const shop_id = shop_data?.id
        const data = {shop_id, token}

        this.props.GetCeoReportInfo(data)  // 사장님께 바란다 리스트 불러오기
    }

    onPressUpdate = () => {
        const {item, commentMessage, isChecked} = this.state
        const {token} = this.props

        let data = {
            content: commentMessage,
            show_only_reporter: isChecked
        }

        if (item?.reply?.id == undefined) { // register {
            let data = {
                report_id: item?.id,
                content: commentMessage,
                show_only_reporter: isChecked
            }
            let sendData = {
                token,
                data
            }
            this.props.ReplyCeoReport(sendData)
        } else {
            let sendData = {
                token,
                data,
                id: item?.reply?.id
            }
            this.props.UpdateReplyByCeo(sendData)
        }
    }

    onChangeText(text) {
        this.setState({commentMessage: text})
    }

    CommentCard = () => {
        const {item} = this.state
        return (
            <View style={styles.commentCardItem}>
                <Text style={[styles.textSmall]}>
                    {getDateFormat(item?.created_at, 'YYYY-MM-DD HH:mm')}
                </Text>
                <Text style={styles.textMessage}>
                    {item?.content}
                </Text>
            </View>
        )
    }

    render() {
        const {isChecked, commentMessage} = this.state
        const {isUpdateReplyLoading, isReplyLoading} = this.props
        const flag = isUpdateReplyLoading || isReplyLoading

        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <GeneralStatusBarColor backgroundColor={theme.white}
                                           hidden={true}
                                           barStyle={'light-content'}
                    />

                    <Header leftIcon="angle-left" title={language.COMMENT_WRITE} navigation={this.props.navigation}/>

                    {flag &&
                    <ActivityIndicator style={CommonStyle.spinnerStyle} animating={flag} size="large"
                                       color={theme.primary}/>
                    }

                    <View style={styles.body}>

                        {this.CommentCard()}

                        <View style={CommonStyle.inputWrapper}>
                            <Text style={CommonStyle.textTitle}>
                                {language.COMMENT}
                            </Text>
                            <View style={{flexDirection: "row", marginTop: 5, justifyContent: "space-between"}}>
                                <TextInput
                                    style={[CommonStyle.input, {width: '90%'}]}
                                    autoCapitalize="none"
                                    multiline
                                    maxLength={80}
                                    value={commentMessage}
                                    placeholder={language.INPUT_HERE}
                                    onChangeText={(text) => this.onChangeText(text)}
                                />
                                <Text style={{
                                    fontSize: theme.fontSmall,
                                    color: theme.grey1,
                                    alignSelf: "flex-end",
                                    paddingBottom: 5
                                }}>
                                    {commentMessage.length}/80
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.btnWrapper}>
                        <View style={styles.checkboxWrapper}>
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
                                style={styles.checkText}
                            >
                                {language.COMMENT_ONLY_WRITER}
                            </Text>
                            <Image source={theme.ic_privacy}
                                   style={styles.imgPrivacy}
                            >
                            </Image>
                        </View>

                        <TouchableOpacity style={styles.btnRegister}
                                          onPress={() => this.onPressUpdate()}
                        >
                            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                {language.FINISH}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.session.token,
        shop_data: state.shop.shop_data,
        isUpdateReplyLoading: state.ceoreport.isUpdateReplyLoading,
        isReplyLoading: state.ceoreport.isReplyLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetCeoReportInfo: (data) => dispatch(GetCeoReportInfoAction(data)),
        ReplyCeoReport: (data) => dispatch(ReplyCeoReportAction(data)),
        UpdateReplyByCeo: (data) => dispatch(UpdateReplyByCeoAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentToConsumerScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },
    body: {
        marginHorizontal: 20,
    },
    checkText: {
        color: theme.black,
        fontSize: theme.font14,
        paddingLeft: 5
    },
    btnRegister: {
        borderRadius: 6,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 16,
    },
    commentCardItem: {
        backgroundColor: theme.minigrey,
        borderBottomColor: theme.white,
        borderBottomWidth: 10,
        borderLeftColor: theme.minigrey,
        borderLeftWidth: 10,
        marginTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    textSmall: {
        fontSize: theme.fontSmall,
        color: theme.grey1,
        paddingVertical: 5
    },
    textMessage: {
        fontSize: theme.font14,
        color: theme.black,
    },
    imgPrivacy: {
        paddingLeft: 10,
        width: 20,
        height: 20
    },
    btnWrapper: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        paddingHorizontal: 20,
    },
    checkboxWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    }
});
