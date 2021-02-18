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
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/EvilIcons'
import { connect } from "react-redux";
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";

class MapScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shop_data: this.props.route.params?.shop_data,
    }
  }

  componentDidUpdate(prevProps, prevState) {

  }

  render() {
    const { shop_data } = this.state
    
    let P0 = {latitude: shop_data?.latitude, longitude: shop_data?.longitude}

    return (
      <View style={styles.container}>
        <GeneralStatusBarColor backgroundColor={theme.white}
            hidden = {true}
            barStyle={'light-content'}
        />

        <Header leftIcon="angle-left" title={language.MAIN_MAP_SHOW} navigation={this.props.navigation}/>

        <View style={styles.titleWrapper}>
          <Text style={styles.shopname}>{shop_data?.shop_name}</Text>
          <View style={[CommonStyle.row_v_center, {paddingLeft: 5, paddingTop: 5, paddingBottom: 15}]}>
            <Image source={theme.ic_mapmark} style={{width: 15, height:20, resizeMode: "contain"}}>
            </Image>
            <Text style={styles.address}>{shop_data?.address}</Text>
          </View>
        </View>

        <View style={styles.mapWrapper}>
            <NaverMapView style={{width: '100%', height: '100%'}}
              showsMyLocationButton={true}
              center={{...P0, zoom: 16}}
            >
              <Marker coordinate={P0} pinColor="rgba(0,0,255,1)" caption={{text: shop_data?.shop_name, textSize: 18}}/>
            </NaverMapView>
          </View>

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  titleWrapper: {
    marginHorizontal: 20,
  },
  shopname: {
    color: theme.black,
    fontSize: theme.fontLarge,
    fontWeight: 'bold'
  },
  address: {
    color: theme.black,
    fontSize: theme.fontMedium,
    paddingLeft: 5
  },
});
