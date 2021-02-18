// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import {useNavigation, useTheme, TabRouter} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import { CommonStyle } from "../../constants/style";
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/EvilIcons'
import CheckBox from '@react-native-community/checkbox';

class JoinConsumerMember extends React.Component {

  state = {
    verificationMethod: 1,
    isChecked: true,
  }

  onPressMemberJoin = () => {
    this.props.navigation.navigate('CommentToCeoScreen')
  }

  onChangeText (text) {

  }

  onPressMobile () {
    this.setState({verificationMethod: 1})
  }

  onPressEmail () {
    this.setState({verificationMethod: 2})
  }

  render() {
    const { verificationMethod, isChecked } = this.state
    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />

        <Header leftIcon="angle-left" title={language.MEMBER_JOING_SET} navigation={this.props.navigation}/>

        <View style={styles.body}>
            <View style={{marginTop: 30}}>
              <Text style={CommonStyle.textTitle}>
                {language.ID}
              </Text>

              <View style={[styles.inputWrapper]}>
                <View style={{flex: 1, flexDirection: "row"}}>
                  <TextInput
                    style={CommonStyle.input}
                    autoCapitalize="none"
                    // value={newtext}
                    placeholder={language.INPUT_12_CHARACTER}
                    onChangeText={(text) => this.onChangeText(text)}
                  />
                </View>
                <View>
                  <TouchableOpacity style={{borderColor: theme.grey1, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4}}>
                    <Text style={styles.textDuplicatedCheck}>
                      {language.DUPLICATED_CHECK}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            <View style={{marginTop: 20}}>
              <Text style={CommonStyle.textTitle}>
                {language.SECRET_NUMBER}
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  // value={newtext}
                  placeholder={language.INPUT_4OVER_CHARACTER}
                  onChangeText={(text) => this.onChangeText(text)}
                />
              </View>
            </View>

            <View style={{marginTop: 30}}>
              <Text style={CommonStyle.textTitle}>
                {language.SELF_VERIFICATION_METHOD}
              </Text>
              <View style={styles.verificationMethodWrapper}>
                <View style={[styles.mobileVeifyWrapper, verificationMethod == 1 ? {backgroundColor: theme.primary}: null]}>
                  <TouchableOpacity onPress={()=> this.onPressMobile()}>
                    <Text style={[styles.textverify, verificationMethod == 1 ? {color: theme.white} : {color: theme.grey1}]}>
                      {language.MOBILE_VERIFICATION}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.mobileVeifyWrapper, verificationMethod == 2 ? {backgroundColor: theme.primary}: null]}>
                  <TouchableOpacity onPress={()=> this.onPressEmail()}>
                    <Text style={[styles.textverify, verificationMethod == 2 ? {color: theme.white} : {color: theme.grey1}]}>
                      {language.EMAIL_VERIFICATION}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.inputWrapper, {marginTop: 30}]}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  // value={newtext}
                  placeholder={language.EMAIL_ADDRESS}
                  onChangeText={(text) => this.onChangeText(text)}
                />
              </View>
              <View>
                <TouchableOpacity style={{borderColor: theme.grey1, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4}}>
                  <Text style={styles.textDuplicatedCheck}>
                    {language.OTP_CODE_SEND}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.inputWrapper]}>
              <View style={{flex: 1, flexDirection: "row"}}>
                <TextInput
                  style={CommonStyle.input}
                  autoCapitalize="none"
                  // value={newtext}
                  placeholder={language.OPT_CODE_INPUT}
                  onChangeText={(text) => this.onChangeText(text)}
                />
              </View>

            </View>


        </View>

        <View style={{ position: "absolute", width: "100%", bottom: 10 }}>
          <TouchableOpacity style={ styles.btnReport }
            onPress = {()=>this.onPressMemberJoin()}
            >
            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
              {language.MEMBER_JOIN}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default JoinConsumerMember;

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
    borderColor: theme.primary,
    borderWidth: 1,
    borderRadius: 4,
  },
  mobileVeifyWrapper: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: theme.white
  },
  mobileVeify: {
    color: theme.grey1,
    fontSize: theme.font14,
  },
  textverify: {
    fontSize: theme.font14,
    fontWeight: 'bold'
  },
  btnReport: {
    borderRadius: 6,
    backgroundColor: theme.grey1,
    justifyContent:'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: 'rgba(47, 47, 47, 1)',
    shadowOffset: { width: 6, height: 6 },
    shadowRadius: 5,
    elevation: 3,
  }
});
