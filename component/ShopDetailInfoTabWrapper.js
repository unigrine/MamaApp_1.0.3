// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-26)

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
} from "react-native";

import ShopDetailInfoEmpty from "./ShopDetailInfoEmpty";
import ShopDetailInfo from "./ShopDetailInfo";

export default function ShopDetailInfoTabWrapper(props) {

  return (
    <View style={styles.container}>
      { props?.isRegister ? <ShopDetailInfoEmpty props={props}/>
                  : <ShopDetailInfo props={props.props} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
