import React, {Component, useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput,
    ScrollView,
    ActivityIndicator
} from "react-native";

import {connect} from "react-redux";
import theme from "../constants/themes/theme";
import language from "../constants/language";
import {CommonStyle} from "../constants/style";
import {
    SendCommentToNewsEventAction,
    SetIsCommentLoadingAction,
    UpdateShopNewsEventReplyCntAction
} from "../store/NewsEvent/action";
import {isEmptyCheck} from "../utils/regex";
import {getDateFormat} from "../utils/text_format";
import {getCommentToNewsEvent, sendCommentToNewsEvent} from "../utils/api";
import {UpdateFavoriteNewsEventReplyCntAction, UpdateNewsEventReplyCntAction} from "../store/Home/action";

const Comments = (props) => {
    const [messages, setMessages] = useState([]);
    const [newtext, setMessage] = useState("");
    const [showLoginAlert, setLoginAlert] = useState(false);
    const [loginType, setLoginType] = useState('C');
    // const [token, setToken] = useState(null);

    const newsevent_id = props?.props.newseventitem?.newsId;
    const newseventitem = props?.props.newseventitem;
    const shop_name = props?.props.newseventitem?.shop_name;
    const shop_id = props?.props.newseventitem?.shop_id;
    const isNotMsgEmpty = Array.isArray(messages) && messages.length > 0 ? true : false;

    const scrollRef = useRef();

    useEffect(() => {
         let fetchData = async () => {
             props.SetIsCommentLoading(true);
             if (isEmptyCheck(newsevent_id)) {
                 return;
             }

             const response = await getCommentToNewsEvent({
                 newsId: newsevent_id,
                 token: props?.token
             });
             switch (props?.props.screen) {
                 case 'HOME':
                     props.UpdateNewsEventReplyCnt({
                         replyCnt: response.data.length,
                         newsId: newsevent_id
                     })
                     break;
                 case 'FAVORITE':
                     props.UpdateFavoriteNewsEventReplyCnt({
                         replyCnt: response.data.length,
                         newsId: newsevent_id
                     });
                     break;
                 case 'SHOP':
                     props.UpdateShopNewsEventReplyCnt({
                         replyCnt: response.data.length,
                         newsId: newsevent_id
                     });
                     break;
             }

             if (!response.err) {
                 setMessages(response.data);
             }

             props.SetIsCommentLoading(false);
        }

        // if (!isEmptyCheck(newtext) && !props?.isCommentLoading) {
        //     console.log('enter~ newnew');
        //     props.SetIsCommentLoading(false);
        //     console.log(scrollRef);
        //     setMessage("");
        //
        //     // fetchData();
        //     // setTimeout(() => {
        //     //     fetchData();
        //     // }, 1000)
        //
        //     return;
        // }

        fetchData();

        return () => {
            setMessage("");
            setMessages([]);
        }
    }, []);

    const sendComment = async () => {
        props.SetIsCommentLoading(true);

        if (isEmptyCheck(props?.customer_id)) {
            onPressToLoginForComment();
        }

        const reqData = {
            customer_id: props?.customer_id,
            newsevent_id: newsevent_id,
            content: newtext,
            screen: props?.props.screen,
        }

        const sendData = {
            token: props?.token,
            data: reqData,
        }

        const response = await sendCommentToNewsEvent(sendData);

        if (!response.err) {  // success
            setMessages(response.data);
            setMessage("");

            switch (props?.props.screen) {
                case 'HOME':
                    props.UpdateNewsEventReplyCnt({
                        newsId: sendData.data.newsevent_id,
                        replyCnt: response.data.length
                    })
                    break;
                case 'FAVORITE':
                    props.UpdateFavoriteNewsEventReplyCnt({
                        newsId: sendData.data.newsevent_id,
                        replyCnt: response.data.length
                    });
                    break;
                case 'SHOP':
                    props.UpdateShopNewsEventReplyCnt({
                        newsId: sendData.data.newsevent_id,
                        replyCnt: response.data.length
                    });
                    break;
            }
        }

        props.SetIsCommentLoading(false);
    }

    const onPressSendComment = () => {
        if (isEmptyCheck(props?.token)) {
            setLoginAlert(true);
            setLoginType('C');
        }
        else {
            if (newtext == "") {
                return;
            }

            sendComment();
        }
    }

    const onChangeMessage = (text) => {
        setMessage(text)
    }

    const onPressToLoginForComment = () => {
        setLoginAlert(false);
        props?.props.navigation.navigate('LoginForCommentScreen', {newseventitem, shop_name, shop_id})
    }

    const messageBox = (message) => {
        let received = 0

        const onPressReport = () => {
            const params = {
                newseventitem,
                shop_name,
                shop_id,
                comment_id: message?.id,
                customer_id: props?.customer_id,
            }

            if (isEmptyCheck(props?.token)) {
                props?.props.navigation.navigate('LoginForReportScreen', params);
            }
            else {
                props?.props.navigation.navigate('ReportScreen', params);
            }
        }

        return (
            <View
                key={message.key}
                style={{
                    // flex: 1,
                    marginTop: 10,
                    minHeight: 30,
                    alignSelf: received ? "flex-start" : "flex-end",
                }}
            >
                <View
                    style={{
                        padding: 10,
                        // backgroundColor: "#EBEBEB",

                        paddingRight: 10,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottomLeftRadius: 8,
                        backgroundColor: received ? '#f2f6f9' : theme.white,
                    }}
                >
                    <Text
                        style={{
                            textAlign: "left",
                            paddingHorizontal: 10,
                        }}
                    >
                        {message?.content}
                    </Text>
                </View>

                <View style={[CommonStyle.row, {flexDirection: "row-reverse", paddingVertical: 5}]}>
                    <Text style={CommonStyle.textSmall}>{getDateFormat(message?.created_at, 'YYYY-MM-DD HH:mm')}</Text>
                    <TouchableOpacity onPress={() => onPressReport()}>
                        <Text style={[CommonStyle.textSmall, {paddingHorizontal: 10}]}>{language.REPORTING}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{flex: 1}}>
            {props?.isCommentLoading &&
            <ActivityIndicator style={CommonStyle.spinnerStyle} animating={props?.isCommentLoading} size="large"
                               color={theme.primary}/>
            }

            <ScrollView style={{flex: 1, maxHeight: 200, backgroundColor: '#EBEBEB', paddingHorizontal: 20}}
                        nestedScrollEnabled={true}
                        ref={scrollRef}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            if (contentHeight > 0) {
                                scrollRef.current?.scrollTo({ y: contentHeight, animated: false })}
                            }

                        }
            >
                {Array.isArray(messages) && messages.map((item, key) => {
                    item.key = key
                    return messageBox(item)
                })
                }
            </ScrollView>

            {!showLoginAlert &&
            <View>
                {/* <View style={{flexDirection: "row-reverse", alignItems: "center", backgroundColor: isNotMsgEmpty ? '#EBEBEB' : theme.white }}>
                <TouchableOpacity
                  onPress={() => onPressReport() }
                >
                <Text style={styles.btnText1}>
                  {language.MOVE_TO_REPORTING}
                </Text>
              </TouchableOpacity>
              </View> */}

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderColor: "#e5e5e5",
                        borderWidth: 1,
                        marginTop: 4,
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        alignItems: "center",
                        backgroundColor: theme.white,
                        // paddingBottom: Platform.OS == "ios" ? 29+keyBoardheight : 10,
                    }}
                >
                    <View style={styles.inputBox}>
                        <TextInput
                            style={{
                                width: '100%',
                                paddingVertical: 0,
                            }}
                            autoCapitalize="none"
                            value={newtext}
                            placeholder={language.MAIN_WRITE_COMMENT_HINT}
                            onChangeText={(text) => onChangeMessage(text)}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => onPressSendComment()}
                    >
                        <Text style={styles.btnText}>
                            {language.INPUT}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            }

            {showLoginAlert &&
            <View style={styles.loginAlertWrapper}>
                <Text style={{color: theme.white, fontSize: theme.fontMedium}}>
                    {language.LOGIN_NEEDED}
                </Text>
                <TouchableOpacity style={styles.loginbtnWrapper}
                                  onPress={() => onPressToLoginForComment()}>
                    <Text style={{color: theme.white, fontSize: theme.fontMedium}}>
                        {language.LOGIN_DO}
                    </Text>
                </TouchableOpacity>
            </View>
            }
        </View>
    );
};

const mapStateToProps = state => {
    return {
        customer_id: state.customer.customer_id,
        token: state.customer.token,
        isCommentLoading: state.newsevent.isCommentLoading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        SetIsCommentLoading: (data) => dispatch(SetIsCommentLoadingAction(data)),
        UpdateNewsEventReplyCnt: (data) => dispatch(UpdateNewsEventReplyCntAction(data)),
        UpdateFavoriteNewsEventReplyCnt: (data) => dispatch(UpdateFavoriteNewsEventReplyCntAction(data)),
        UpdateShopNewsEventReplyCnt: (data) => dispatch(UpdateShopNewsEventReplyCntAction(data)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Comments)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 24 : 0,
    },
    body: {
        flex: 7.5,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        backgroundColor: "white",
    },
    img: {
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    chatimg: {
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        width: 40,
        height: 40,
    },
    inputBox: {
        flex: 1,
        height: 40,
        borderColor: theme.grey1,
        borderWidth: 1,
        borderRadius: 20,
        flexDirection: "row",
        paddingHorizontal: 20,
        width: '100%',
        marginRight: 10
    },
    buttonSend: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "rgba(85,170,255,1)",
        justifyContent: "center",
        alignItems: "center",
    },
    loginAlertWrapper: {
        height: 60,
        backgroundColor: theme.grey1_2,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    spinnerStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        justifyContent: "center",
    },
    loginbtnWrapper: {
        borderRadius: 50,
        paddingVertical: 8,
        paddingHorizontal: 30,
        backgroundColor: theme.primary,
        justifyContent: 'center'
    },
    btnText: {
        color: theme.black,
        fontSize: 14,
        fontWeight: 'bold',
    },
    btnText1: {
        color: theme.grey2,
        fontSize: theme.font14,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontWeight: 'bold',
        textAlign: "right",
        textDecorationLine: "underline",
    }
});
