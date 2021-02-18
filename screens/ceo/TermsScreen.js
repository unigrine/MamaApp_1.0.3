// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import Header from "../../component/Header";
import { connect } from 'react-redux';
import { setTermsAgreeAction } from "../../store/Config/action";

class TermsScreen extends React.Component {
  
  state = {
    verificationMethod: 1,
    isModal: false,
  }

  onPressAgree () {
    this.props.setTermsAgree(true)
    this.props.navigation.navigate('JoinCeoScreen')
  }

  render() {
    const { verificationMethod, isModal } = this.state
    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />
        
        <Header leftIcon="angle-left" title={language.CEO_TERMS} navigation={this.props.navigation}/>

        <View style={styles.body}>
          <Text style={styles.title}>
            {language.TERMS_1_TITLE}
          </Text>
          <Text style={styles.title_1}>
            {language.TERMS_1_1_TITLE}
          </Text>
          <Text style={styles.text}>
            {language.TERMS_1_1_TEXT}
          </Text>

          <View style={{height: 30}}/>

          <Text style={styles.title}>
            {language.TERMS_2_TITLE}
          </Text>
          <Text style={styles.title_1}>
            {language.TERMS_2_2_TITLE}
          </Text>
          <Text style={styles.text}>
            {language.TERMS_2_2_TEXT}
          </Text>
        </View>
        <View style={{ position: "absolute", width: "100%", bottom: 10 }}>
          <TouchableOpacity style={ styles.btnAgree } 
            onPress = {()=>this.onPressAgree()}
            >
            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
              {language.ALL_AGREE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAgree: state.userstatus.isAgree
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTermsAgree: (data) => dispatch(setTermsAgreeAction(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  body: {
    marginHorizontal: 20,
  },
  title: {
    color: theme.bold,
    fontSize: theme.fontMedium,
    fontWeight: 'bold'
  },
  title_1: {
    color: theme.bold,
    fontSize: theme.fontMedium,
    paddingTop: 10,
    paddingBottom: 6,
    paddingLeft: 10,
  },
  text: {
    color: theme.bold,
    fontSize: theme.font14,
  },
  btnAgree: {
    borderRadius: 6,
    backgroundColor: theme.primary,
    justifyContent:'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  }
});
