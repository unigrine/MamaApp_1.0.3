// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import { CommonStyle } from "../../constants/style";
import LoginHeader from "../../component/LoginHeader"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { checkDuplicatedId } from "../../utils/api";
import { ChangeSellerIdAction } from "../../store/FindInfo/action";
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SetUserStatusAction } from "../../store/Config/action";

class UpdateIDScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      oldID: "",
      newID: "",
      isModal: false,
      isChecked: true,
      loadingIdCheck: false,
      IdCheckResult: false,
    }
    this.onPressLeftIcon = this.onPressLeftIcon.bind(this)
  }
  
  
  componentDidMount () {

  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, err, seller_id } = this.props
    if (prevProps.isLoading != isLoading && isLoading == false) {
        this.setState({isModal: true })
    }
  }

  onPressLeftIcon () {
    this.setState({oldID: "", newID: "", IdCheckResult: false})
    this.props.navigation.goBack()
  }

  onChangeOldID (text) {
    this.setState({oldID: text})
  }

  onChangeNewID (text) {
    this.setState({newID: text, IdCheckResult: false})
  }

  onPressChange () {
    const { oldID, newID, IdCheckResult } = this.state
    const { token, seller_id } = this.props

    if(seller_id != oldID) {
      Toast.show("기존 아이디를 정확히 입력해주세요!")
      return
    }
    if( !IdCheckResult ) {
      Toast.show("중복확인을 해주세요!")
      return
    }

    const data = {
      origin_id: oldID,
      new_id: newID
    }
    const sendData = {
      data,
      token
    }
    this.props.ChangeSellerId(sendData)
  }

  onPressModalOk () {
    this.setState({isModal: false})

    const data = {
      status: "login"
    }
    this.props.setUserStatus(data)  // 로그인 다시 한다.
  }

  onPressCheckId () {
    const { newID } = this.state

    if( newID.length < 4 ){
      Toast.show("최소 4문자이상 이어야 합니다!")
      return
    }

    this.setState({loadingIdCheck: true})
    checkDuplicatedId(newID).then(response => {
      console.log(response)
      this.setState({ IdCheckResult: response?.data, loadingIdCheck: false})
      if(!response?.data)
        Toast.show("중복되었습니다. 다른 아이디를 입력해주세요!")
    })
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
                {!err ? language.CHANGED_ID : language.FAILED_ID}
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
    const { isChecked, isUpdating } = this.state
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
    const { oldID, newID, isModal, IdCheckResult, loadingIdCheck } = this.state
    const { isLoading } = this.props

    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />
        
        <LoginHeader leftIcon="angle-left" title={language.ID_CHANGE} navigation={this.props.navigation} onPressLeftIcon={this.onPressLeftIcon}/>
        
        { isLoading &&
          <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isLoading} size="large" color={theme.primary} />
        }

        <View style={styles.body}>
          <View style={CommonStyle.inputWrapper}>
              <Text style={CommonStyle.textTitle}>
                {language.OLD_ID}
              </Text>
              <View style={[CommonStyle.row_sb, CommonStyle.mt_10_ios]}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  multiline
                  maxLength={15}
                  value={oldID}
                  placeholder={language.INPUT_HERE}
                  onChangeText={(text) => this.onChangeOldID(text)}
                />
              </View>
          </View>
          <View style={CommonStyle.inputWrapper}>
            <Text style={CommonStyle.textTitle}>
              {language.NEW_ID}
            </Text>
            <View style={[styles.inputWrapper]}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  maxLength={12}
                  value={newID}
                  placeholder={language.INPUT_12_CHARACTER}
                  onChangeText={(text) => this.onChangeNewID(text)}
                />
              </View>
              { !IdCheckResult  ? 
                <TouchableOpacity style={[styles.btnCheck, {borderColor: newID.length > 3 ? theme.primaryDark: theme.grey1}]} onPress={()=>this.onPressCheckId()}>
                  { loadingIdCheck == true ?
                      <View style={CommonStyle.row}>
                        <ActivityIndicator size={theme.fontMedium} color={theme.primary} />
                          <Text style={styles.textDuplicatedCheck}>
                          {language.DUPLICATED_CHECK}
                        </Text>
                      </View>
                    :
                      <Text style={[styles.textDuplicatedCheck, {color: newID.length > 3 ? theme.primaryDark: theme.grey1}]}>
                        {language.DUPLICATED_CHECK}
                      </Text>
                  }
                </TouchableOpacity>
              :
                <Icon name={'check'} size={20} color={theme.primary}/>
              }
            </View>
          </View>
        </View>
        
        {this.bottomView()}
        
        {isModal && this.Modal()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.session.token,
    seller_id: state.session.seller_id,
    isLoading: state.findinfo.isLoading,
    err: state.findinfo.err
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ChangeSellerId: (data) => dispatch(ChangeSellerIdAction(data)),
    setUserStatus: (data) => dispatch(SetUserStatusAction(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateIDScreen);

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
  },
  textDuplicatedCheck: {
    color: theme.grey1,
    fontSize: theme.font14,
  },
  btnCheck: {
    borderColor: theme.grey1,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
});
