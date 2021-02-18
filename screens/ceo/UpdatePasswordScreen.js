// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import { CommonStyle } from "../../constants/style";
import LoginHeader from "../../component/LoginHeader"
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChangePasswordAction } from "../../store/FindInfo/action";
import { SetUserStatusAction } from "../../store/Config/action";

class UpdatePasswordScreen extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      storePassword: "",
      isModal: false,
      isChecked: false
    }
    this.onPressLeftIcon = this.onPressLeftIcon.bind(this)
  }

  async componentDidMount () {
    let storePassword =  await AsyncStorage.getItem("mama_seller_pw")
    this.setState({storePassword})
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, err } = this.props
    if (prevProps.isLoading != isLoading && isLoading == false) {
        this.setState({isModal: true })
    }
  }

  onPressLeftIcon () {
    this.setState({oldPassword: "", newPassword: "", confirmPassword: ""})
    this.props.navigation.goBack()
  }

  onChangeOldPasswordText (text) {
    this.setState(
      {oldPassword: text},
      () => this.checkAll()
    )
  }

  onChangeNewPasswordText (text) {
    this.setState(
      {newPassword: text},
      () => this.checkAll()
    )
  }

  onChangeConfirmPasswordText (text) {
    this.setState(
      {confirmPassword: text},
      () => this.checkAll()
    )
  }

  checkAll () {
    const { storePassword, oldPassword, newPassword, confirmPassword } = this.state

    let isChecked = false

    if( oldPassword.length < 4 || oldPassword != storePassword )
      isChecked = false
    else if( newPassword.length < 4 || newPassword != confirmPassword )
      isChecked = false
    else
      isChecked = true

    this.setState({isChecked})
  }

  onPressChange () {
    const { storePassword, oldPassword, newPassword, confirmPassword } = this.state
    const { token, seller_id } = this.props

    if( oldPassword.length < 4 ) return

    if( oldPassword != storePassword ) {
      Toast.show("기존 비밀번호를 다시 입력해주세요.")
      return
    }

    if( newPassword != confirmPassword ) {
      Toast.show("비밀번호 확인을 다시 입력해주세요.")
      return
    }

    const data = {
      seller_id: seller_id,
      origin_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }
    const sendData = {
      data,
      token
    }
    this.props.ChangeSellerPassword(sendData)
  }

  onPressModalOk () {
    this.setState({isModal: false})

    const data = {
      status: "login"
    }
    this.props.setUserStatus(data)  // 로그인 다시 한다.
  }

  Modal () {
    const { err } = this.props

    return (
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style = {{ marginTop: 0, paddingTop: 0 }}>
              <View style={{alignItems: "flex-end"}}>
                <TouchableOpacity onPress = {()=>this.onPressModalOk()}>
                  <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalText}>
                {!err ? language.CHANGED_PASSWORD : language.FAILED_PASSWORD}
              </Text>
              <View style={{ marginTop: 30 }}>
                <TouchableOpacity style={ styles.btnLogin }
                  onPress = {()=>this.onPressModalOk()}
                  >
                  <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                    {language.OK}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </View>
    )
  }

  bottomView () {
    const { isChecked } = this.state
    return (
        <View style={{ marginHorizontal: 20,}}>
          <View style={{ marginTop: 50 }}>
          <TouchableOpacity style={ [CommonStyle.submitbutton, {position: "absolute", width: "100%", bottom: 30}, isChecked ? {backgroundColor: theme.primary} : null] }
            onPress = {()=>this.onPressChange()}
            >
            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
              {language.FINISH_CHANGE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const { oldPassword, newPassword, confirmPassword, isModal } = this.state
    const { isLoading } = this.props

    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />

        <LoginHeader leftIcon="angle-left" title={language.PASSWORD_CHANGE} navigation={this.props.navigation} onPressLeftIcon={this.onPressLeftIcon}/>

        { isLoading &&
          <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isLoading} size="large" color={theme.primary} />
        }

        <KeyboardAvoidingView style={styles.body} behavior="padding">
          <View>
            <View style={CommonStyle.inputWrapper}>
                <Text style={CommonStyle.textTitle}>
                  {language.OLD_PASSWORD}
                </Text>
                <View style={[CommonStyle.row_sb, CommonStyle.mt_10_ios]}>
                  <TextInput
                    style={CommonStyle.input}
                    autoCapitalize="none"
                    maxLength={20}
                    value={oldPassword}
                    secureTextEntry
                    placeholder={language.INPUT_4OVER_CHARACTER}
                    onChangeText={(text) => this.onChangeOldPasswordText(text)}
                  />
                </View>
            </View>
            <View style={CommonStyle.inputWrapper}>
                <Text style={CommonStyle.textTitle}>
                  {language.NEW_PASSWORD}
                </Text>
                <View style={[CommonStyle.row_sb, CommonStyle.mt_10_ios]}>
                  <TextInput
                    style={CommonStyle.input}
                    autoCapitalize="none"
                    maxLength={20}
                    value={newPassword}
                    secureTextEntry
                    placeholder={language.INPUT_4OVER_CHARACTER}
                    onChangeText={(text) => this.onChangeNewPasswordText(text)}
                  />
                </View>
            </View>
            <View style={CommonStyle.inputWrapper}>
                <Text style={CommonStyle.textTitle}>
                  {language.NEW_PASSWORD_CONFIRM}
                </Text>
                <View style={[CommonStyle.row_sb, CommonStyle.mt_10_ios]}>
                  <TextInput
                    style={CommonStyle.input}
                    autoCapitalize="none"
                    maxLength={20}
                    value={confirmPassword}
                    secureTextEntry
                    placeholder={language.INPUT_4OVER_CHARACTER}
                    onChangeText={(text) => this.onChangeConfirmPasswordText(text)}
                  />
                </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {this.bottomView()}

        {isModal && this.Modal()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    seller_id: state.session.seller_id,
    token: state.session.token,
    isLoading: state.findinfo.isLoading,
    err: state.findinfo.err
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ChangeSellerPassword: (data) => dispatch(ChangePasswordAction(data)),
    setUserStatus: (data) => dispatch(SetUserStatusAction(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },

  body: {
    flex: 1,
    marginHorizontal: 20,
  },

  serviceTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  addTimeBtn: {
    borderRadius: 100,
    borderColor: theme.grey1,
    borderWidth: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  itemTitle: {
    fontSize: theme.font14,
    fontWeight: 'bold'
  },
  characterCountCheck: {
    color: theme.grey1,
    fontSize: theme.font14,
  },
  textGeneral: {
    fontSize: theme.font14,
  },

  title: {
    color: theme.black,
    fontSize: theme.fontLarge,
    textAlign: 'center'
  },

  inputWrapper: {
    flexDirection: "row",
    width: "100%",
    borderBottomColor: theme.grey1,
    borderBottomWidth: 0.5,
    alignItems: "center"
  },
  searchInput: {
    width: "80%",
    paddingHorizontal: 10
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
    justifyContent:'center',
    paddingVertical: 14,
    marginHorizontal: 40
  },
  modalText: {
    textAlign: "center",
    paddingHorizontal: 40,
    fontSize: theme.font18,
    color: theme.black
  },

  placeholder: {
    fontSize: theme.font14,
    color: theme.grey1
  },
  dropDownPickerStyle: {
    marginTop: 10,
    height: 50,
    width: "50%",
    borderWidth: 0
  },
  labelStyle: {
    fontSize: theme.font14,
    textAlign: 'left',
    color: theme.black
  },
  businessImage: {
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
  }
});
