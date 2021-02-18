import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import theme from "../constants/themes/theme";
import language from "../constants/language";

export default function CeoNewsEventEmpty(props) {

  return (
    <View  style={styles.container}>
      <View style={{flex: 1, alignItems: "center", justifyContent: "flex-end"}}>
        <Text style={styles.title}>{language.CEO_SHOP_ALERT2}</Text>
      </View>
      <View style={{flex: 4, paddingHorizontal: 20, alignItems: "center", justifyContent: "flex-start"}}>
        <Image 
          source={theme.img_alert}
          style={{height: "60%", resizeMode: "contain"}}
          >
        </Image>
        <TouchableOpacity style={styles.btnWrapper} onPress={()=> props.props.navigation.navigate('RegisterNewsOrEventScreen')}>
          <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            <Image source={theme.ic_write_nor} style={{width: 30, height: 30}}/>
            <Text style={styles.btnText}>{language.NEWS_REGISTER}</Text>
          </View>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350,
    backgroundColor: theme.minigrey,
    paddingHorizontal: 50,
  },
  title: {
    color: theme.black,
    fontSize: theme.font18,
    textAlign: 'center',
  },
  btnWrapper: {
    backgroundColor: theme.primary,
    borderRadius: 100,
    width: "110%",
    padding: 10,
  },
  btnText: {
    color: theme.white,
    fontSize: theme.fontMedium,
    fontWeight: "bold"
  }
});
