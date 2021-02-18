// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-26)

import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";

import theme from "../constants/themes/theme";
import HopeToCeoEmpty from "./HopeToCeoEmpty";
import HopeToCeo from "./HopeToCeo";

export default function HopeToCeoWrapper(props) {
  const ceo_report_list = props?.props?.ceo_report_list
  return (
    <View style={styles.container}>
      {
        (!ceo_report_list || ceo_report_list?.length < 1)  ?
          <HopeToCeoEmpty props={props}/> :
          <HopeToCeo props={props?.props} onPressDelete={props.onPressCeoReportDelete}/>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
