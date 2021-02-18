import React, { Component, useState, useEffect } from "react";
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

import { connect } from "react-redux";
import theme from "../constants/themes/theme";
import language from "../constants/language";
import { CommonStyle } from "../constants/style";
import {getDateFormat} from "../utils/text_format";
import {isEmptyCheck} from "../utils/regex";

const CommentForCeo = (props) => {
  const [newtext, setMessage] = useState("");
  const [showLoginAlert, setLoginAlert] = useState(false);

  const messages = props?.props.newseventitem?.comment
  const newsevent_id = props?.props.newseventitem?.id;
  const newseventitem = props?.props.newseventitem;
  const shop_name = props?.props?.shop_name;
  const shop_id = props?.props?.shop_id;
  const isNotMsgEmpty = Array.isArray(messages) && messages.length > 0 ? true: false

  useEffect(() => {

    // if (newtext != "" && props?.isReportLoading == false) {
    //   setMessage("")
    // }
  }, [props?.isReportLoading]);

  const sendComment = () => {
    const data = {
      customer_id: props?.customer_id,
      newsevent_id: newsevent_id,
      content: newtext,
    }

    const sendData = {
      token: props?.token,
      data,
    }

    props.ReportToNewsEvent(sendData)
  }

  const onPressSendMessage = async() => {
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

  const messageBox = (message) => {
    let received = 0

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
            {/*<Text style={[CommonStyle.textSmall, {paddingHorizontal: 10}]}>{language.REPORTING}</Text>*/}
          </View>
        </View>
    );
  };

  return (
    <View style={{flex: 1}}>
        { props?.isReportLoading &&
          <ActivityIndicator style={CommonStyle.spinnerStyle} animating={props?.isReportLoading} size="large" color={theme.primary} />
        }

        <ScrollView style={{ flex: 1, maxHeight: 200, backgroundColor: '#EBEBEB', paddingHorizontal: 20 }}
           nestedScrollEnabled={true}
           >
          {Array.isArray(messages) && messages.map((item, key) => {
              item.key = key
              return messageBox(item)
            })
          }
        </ScrollView>

        <View style={{height: 0, backgroundColor: theme.white }}>
        </View>
      </View>
    );
};

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentForCeo)

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
    width:'100%',
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
