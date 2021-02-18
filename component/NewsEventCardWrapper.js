// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-26)

import React, {useState} from "react";
import {
    View,
    StyleSheet,
    ScrollView, Text,
} from "react-native";

import NewsEventCard from "./NewsEventCard";
import theme from "../constants/themes/theme";
import language from "../constants/language";

export default function NewsEventCardWrapper(props) {
    let [listContentHeight, setListContentHeight] = useState(0) ;
    const news_event_list = props?.props?.news_event_list;
    const renderRow = (item) => {
        return (
            <View key={item.key}>
                <NewsEventCard
                    navigation={props?.props?.navigation}
                    newseventitem={{ ...item, shop_name: props?.props?.shop_data?.shop_name }}
                    token={props?.props?.token}
                    screen="SHOP"
                />
            </View>
        )
    }

    const renderEmptyContent = (parentHeight) => {
        return (
            <View style={{
                // flex:1,
                // flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // minHeight: parentHeight > 0 ? parentHeight : 0
                minHeight: listContentHeight + 280
            }}>
                <Text style={{
                    color: theme.grey1,
                    textAlign: 'center',
                    lineHeight: 20
                }}>
                    {language.NO_NEWSEVENT}
                </Text>
            </View>
        );
    }

    return (
        <View
            onLayout={ (e) => {
                if (listContentHeight < 1) {
                    setListContentHeight(e.nativeEvent.layout.height)
                }
            } }
            style={styles.container}>
            {
                (!news_event_list || news_event_list.length < 1) ?
                    renderEmptyContent()
                    :
                    <View style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                            {news_event_list?.map((item, key) => {
                                item.key = key
                                return renderRow(item)
                            })}
                        </ScrollView>
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
