// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from "react-native";
import {useNavigation, useTheme, TabRouter} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import { CommonStyle } from "../../constants/style";
import Header from "../../component/Header";
import { connect } from "react-redux";
import { GetNoticeAction } from "../../store/Notice/action";

class NoticeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isModal: false,
    }
  }

  componentDidMount () {
    this.props.GetNotice()
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, notice } = this.props
    if( prevProps.isLoading != isLoading && isLoading == false) {
      // this.setState({notice})
    }
  }

  onPressModalOk () {
    this.setState({isModal: false})
  }

  onPressLoadMore (item) {
    const { notice_data } = this.state

    let newList = []
    notice_data?.map(p => {
      let oneItem = {
        ...p
      }
      if( item.id == p.id ) {
        oneItem = {
          ...p,
          showmore: !item.showmore
        }
      }
      newList.push(oneItem)
    })
    this.setState({notice_data: newList})
  }

  renderItem (item) {
    return (
      <TouchableOpacity onPress={() => this.onPressLoadMore(item)}>
        <View style={[CommonStyle.bottomLine, CommonStyle.row_sb, {paddingVertical: 15, marginLeft: 20, paddingRight: 20}]}>
          <View style={{flex: 3}}>
            <Text style={{color: theme.black, fontSize: theme.font14}} numberOfLines={1}>
              [{item.type == "event" ? language.MAIN_EVENT: language.NOTICE}] {item.title}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: theme.grey1, fontSize: theme.font14}}>
              {item.created_at}
            </Text>
          </View>
          <View style={{flex: 0.2}}>
            <Image source={item.showmore == false ? theme.ic_unfold_nor : theme.ic_unfold_foc} style={{width: 20, height: 20}}/>
          </View>

        </View>
        { item.showmore == true &&
          <View style={{backgroundColor: theme.minigrey, paddingVertical: 15, paddingHorizontal: 20}}>
            <Text style={{color: theme.black, fontSize: theme.fontSmall}}>
              {item.content}
            </Text>
          </View>
        }

      </TouchableOpacity>
    )
  }

  render() {
    const { notice_data, isModal } = this.state
    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />

        <Header leftIcon="angle-left" title={language.NOTICE_PERMISSION} navigation={this.props.navigation}/>

        <View style={styles.body}>
          <FlatList
              data={notice_data}
              renderItem={({ item, index }) => this.renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
            />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.session.token,
    isLoading: state.notice.isLoading,
    err: state.notice.err,
    notices: state.notice.notices
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GetNotice: (data) => dispatch(GetNoticeAction(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoticeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },

  body: {
    flex: 1,
    marginHorizontal: 0,
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
