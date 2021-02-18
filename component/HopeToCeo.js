// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-25)
// 소상공인측, 소비자들이 올린 댓글보기

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from "../constants/themes/theme";
import language from "../constants/language";
import {CommonStyle} from "../constants/style";
import {getDateFormat} from "../utils/text_format";
import {isEmptyCheck} from "../utils/regex";

export default function HopeToCeo(props) {
    const ceo_report_list = props?.props?.ceo_report_list

    const onPressChange = (item) => {
        props?.props?.navigation.navigate("CommentToConsumerScreen", {item})
    }

    const CeoCommentView = (item) => {
        return (
            <View style={styles.commentCardItem}>
                <View style={[CommonStyle.row_v_center, {paddingBottom: 10}]}>
                    <Text style={styles.textCeo}>
                        {language.CEO}
                    </Text>
                    <Text style={[styles.textSmall, {paddingLeft: 10}]}>
                        {getDateFormat(item.reply?.created_at, 'YYYY-MM-DD HH:mm')}
                    </Text>
                    <TouchableOpacity style={{paddingLeft: 10}} onPress={() => onPressChange(item)}>
                        <Text style={styles.textSmall}>
                            {language.CHANGE}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{paddingLeft: 10}} onPress={() => props.onPressDelete(item?.reply?.id)}>
                        <Text style={styles.textSmall}>
                            {language.DELETE}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textMessage}>
                        {item.reply?.content}
                    </Text>
                </View>
            </View>
        )
    }

    const EmptyCeoText = (item) => {
        return (
            <View style={styles.commentCardItem}>
                <Text style={styles.bigText}>
                    {language.CEO_CAN_REPLY_TO_CONSUMER}
                </Text>

                <TouchableOpacity style={styles.btnAnswerWrapper} onPress={() => onPressChange(item)}>
                    <Text style={styles.textAnswer}>
                        {language.COMMENT_WRITE}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    const CommentCard = (item) => {
        return (
            <View style={styles.commentCardItemWrapper}>

                <View style={[CommonStyle.row_v_center, {paddingTop: 0, paddingVertical: 15}]}>
                    <Text style={[styles.textSmall]}>
                        {getDateFormat(item?.created_at, 'YYYY-MM-DD HH:mm')}
                    </Text>
                    <TouchableOpacity style={{paddingLeft: 10}} onPress={()=> onPressReportHopeToCeo(item)}>
                      <Text style={styles.textSmall}>
                        {language.REPORTING}
                      </Text>
                    </TouchableOpacity>
                </View>

                {item?.hide_customers == 1 &&
                <View style={{flexDirection: 'row', alignItems: "center", paddingBottom: 10}}>
                    <Image source={theme.ic_privacy}
                           style={{width: 17, height: 17, resizeMode: "cover"}}
                    >
                    </Image>
                    <Text style={styles.textSmall}>
                        {language.WROTE_TO_SHOW_ONLY_CEO}
                    </Text>
                </View>
                }
                <Text style={styles.textMessage}>
                    {item?.content}
                </Text>

                {item?.reply?.id == undefined ? EmptyCeoText(item)
                    : CeoCommentView(item)
                }

            </View>
        )
    }

    const onPressReportHopeToCeo = (item) => {
        const { token, shop_data } = props?.props;

        const params = {
            customer_id: item?.customer_id,
            report_id: item?.id,
            shop_name: item?.content,
            shop_id: item?.shop_id
        };

        if (isEmptyCheck(token)) {
            props.props?.navigation.goBack();
        }
        else {
            props.props?.navigation.navigate('ReportHopeToCeoByCeoScreen', params);
        }
    }

    const renderItemCommentCard = (item) => {
        return (
            <View style={styles.container}>
                {CommentCard(item)}
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: theme.white}}>
            <FlatList
                data={ceo_report_list}
                renderItem={({item, index}) => {
                    return renderItemCommentCard(item);
                }}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={<View style={{height: 10}}></View>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        borderBottomColor: theme.minigrey,
        borderBottomWidth: 0.5
    },
    itemtitleWraper: {
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: theme.primaryLight,
        height: 120,
        paddingHorizontal: 20,
    },
    textCeo: {
        fontSize: theme.font14,
        color: theme.black
    },
    textSmall: {
        fontSize: theme.fontSmall,
        color: theme.grey1,
    },
    textMessage: {
        fontSize: theme.font14,
        color: theme.black,
    },
    itemWraper: {
        backgroundColor: theme.primaryLight,
        padding: 20
    },
    introduce: {
        fontSize: theme.font18,
        color: theme.primaryBigDark,
        fontWeight: 'bold',
    },
    commentCardItemWrapper: {
        paddingHorizontal: 16,
    },
    commentCardItem: {
        paddingVertical: 10,
        backgroundColor: theme.minigrey,
        borderTopColor: theme.white,
        borderTopWidth: 10,
        borderLeftColor: theme.minigrey,
        borderLeftWidth: 10,
        marginTop: 16,
        paddingBottom: 20,
    },
    bigText: {
        color: theme.black,
        fontSize: theme.fontMedium,
        textAlign: 'center',
        paddingVertical: 10
    },
    btnAnswerWrapper: {
        borderRadius: 100,
        width: "40%",
        backgroundColor: theme.white,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: 'center'
    },
    textAnswer: {
        color: theme.primary,
        fontSize: theme.fontMedium,
        paddingVertical: 10
    }
});
