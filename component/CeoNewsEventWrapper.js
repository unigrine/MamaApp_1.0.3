// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-26)

import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";

import CeoNewsEventEmpty from "./CeoNewsEventEmpty";
import CeoNewsEvent from "./CeoNewsEvent";

export default function CeoNewsEventWrapper(props) {
  const news_event_list = props?.props?.news_event_list
  const renderRow = (item) => {
    return (
      <View key={item.key}>
        <CeoNewsEvent
          navigation={props.navigation}
          onPressDelete={props.onPressDelete}
          newseventitem={item}
        />
    </View>
   )
  }

  return (
    <View style={styles.container}>
        { (!news_event_list || news_event_list?.length < 1 ) ? <CeoNewsEventEmpty props={props}/>
                      : <View style={styles.container}>
                          <ScrollView showsVerticalScrollIndicator={false}  nestedScrollEnabled={true}>
                              {Array.isArray(news_event_list) &&
                                news_event_list?.map((item, key) => {
                                  item.key = key
                                  return renderRow(item)
                                })
                              }
                          </ScrollView>
                          <View style={{marginBottom: 80}}/>
                        </View>
        }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
 