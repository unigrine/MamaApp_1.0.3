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
import { ChangeShopAddressAction } from "../../store/FindInfo/action";
import { connect } from "react-redux";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAddressByKeywordForNaver } from "../../utils/global";

class UpdateAddressScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shop_address1: "",
      shop_address2: "",
      latitude: 0,
      longitude: 0,
      checkFindAddr: false,
      isAddrSearchLoading: false,


      isModal: false,
      isChecked: true,
      loadingIdCheck: false,
      IdCheckResult: false,
    }
    this.onPressLeftIcon = this.onPressLeftIcon.bind(this)
  }


  componentDidMount () {
    this.initShopInfo()
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, err, seller_id } = this.props
    if (prevProps.isLoading != isLoading && isLoading == false) {
        this.setState({isModal: true })
    }
  }

  initShopInfo () {
    const { shop_data } = this.props
    this.setState({
      shop_address1: shop_data?.address,
      shop_address2: shop_data?.address1,
      latitude: shop_data?.latitude,
      longitude: shop_data?.longitude,
    }
    ,() => {
      this.isValidateAddress()
    })
  }

  isValidateAddress() {
    const { latitude, longitude, shop_address1, shop_address2 } = this.state

    let checkFindAddr = false
    if( latitude != 0 && longitude != 0 && (shop_address1 != "" || shop_address2 != "") )
      checkFindAddr = true

    this.setState({ isAddrSearchLoading: false, checkFindAddr })
  }

  onPressLeftIcon () {
    this.setState({shop_address1: "", shop_address2: "", checkFindAddr: false})
    this.props.navigation.goBack()
  }

  onPressChange () {
    const { shop_address1, shop_address2, latitude, longitude, checkFindAddr } = this.state
    const { token, shop_id, shop_data } = this.props

    if( !checkFindAddr ) {
      Toast.show("주소찾기를 눌러 정확한 주소를 검색해주세요.")
      return
    }

    const data = {
      shop_id,
      address1: shop_address1,
      address2: shop_address2,
      latitude,
      longitude
    }
    const sendData = {
      data,
      token
    }

    this.props.ChangeShopAddress(sendData)
  }

  onPressModalOk () {
    this.setState({isModal: false})
    this.props.navigation.goBack();
  }

  onChangeShopAddressText (text) {
    this.setState({shop_address1: text, checkFindAddr: false})
  }

  onChangeShopAddress2Text (text) {
    this.setState({shop_address2: text, checkFindAddr: false})
  }

  onPressFinAddress () {
    const {shop_address1} = this.state

    let address_name = ""
    let road_address = ""
    let longitude = 0
    let latitude = 0

    if (shop_address1.length < 2) return
    this.setState({ isAddrSearchLoading: true })
    getAddressByKeywordForNaver(shop_address1).then( result => {
      if(Array.isArray(result?.addresses)) {
        result?.addresses?.map((item, index) => {
          if( index == 0 ) {
            address_name = item?.jibunAddress
            road_address = item?.roadAddress
            longitude = item?.x
            latitude = item?.y
          }
        } )
      }
      this.setState({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        shop_address1: address_name,
        shop_address2: road_address,
      })

      let checkFindAddr = false
      if( latitude != 0 && longitude != 0 && (address_name != "" || road_address != "") )
        checkFindAddr = true

      this.setState({ isAddrSearchLoading: false, checkFindAddr })
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
                {!err ? language.CHANGED_ADDRESS : language.FAILED_ADDRESS}
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
    // const { oldID, newID, isModal, IdCheckResult, loadingIdCheck } = this.state
    const { isModal, errorMsg, shop_name, shop_address1, shop_address2, shopNameCheckResult, loadingShopNameCheck, isAddrSearchLoading } = this.state

    const { isLoading } = this.props

    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />

        <LoginHeader leftIcon="angle-left" title={language.ADDRESS_CHANGE} navigation={this.props.navigation} onPressLeftIcon={this.onPressLeftIcon}/>

        { isLoading &&
          <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isLoading} size="large" color={theme.primary} />
        }

        <View style={styles.body}>
          <View style={CommonStyle.inputWrapper}>
            <Text style={CommonStyle.textTitle}>
              {language.SHOP_ADDRESS}
            </Text>
            <View style={[styles.inputWrapper]}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  value={shop_address1}
                  maxLength={50}
                  placeholder={language.INPUT_HERE}
                  onChangeText={(text) => this.onChangeShopAddressText(text)}
                />
              </View>
              <TouchableOpacity style={[styles.btnCheck, {borderColor: shop_address1.length > 1 ? theme.primaryDark: theme.grey1}]} onPress={() => this.onPressFinAddress()}>
              { isAddrSearchLoading == true ?
                  <View style={CommonStyle.row}>
                    <ActivityIndicator size={theme.fontMedium} color={theme.primary} />
                    <Text style={[styles.textDuplicatedCheck, {color: shop_address1.length > 1 ? theme.primaryDark: theme.grey1}]}>
                      {language.FIND_ADDRESS}
                    </Text>
                  </View>
                  :
                  <Text style={[styles.textDuplicatedCheck, {color: shop_address1.length > 1 ? theme.primaryDark: theme.grey1}]}>
                    {language.FIND_ADDRESS}
                  </Text>
              }
            </TouchableOpacity>
            </View>
          </View>

          <View style={CommonStyle.inputWrapper}>
            <Text style={CommonStyle.textTitle}>
              {language.DETAIL_ADDRESS}
            </Text>
            <View style={[styles.inputWrapper]}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  value={shop_address2}
                  maxLength={50}
                  // placeholder={language.DETAIL_ADDRESS}
                  onChangeText={(text) => this.onChangeShopAddress2Text(text)}
                />
              </View>
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
    shop_id: state.shop?.shop_data?.id,
    shop_data: state.shop?.shop_data,
    isLoading: state.findinfo.isLoading,
    err: state.findinfo.err
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ChangeShopAddress: (data) => dispatch(ChangeShopAddressAction(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAddressScreen);

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
