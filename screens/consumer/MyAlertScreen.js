// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView} from "react-native";
import {useNavigation, useTheme} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import {connect} from "react-redux"
import {
    SetIsReadMyNotificationAction,
    SetMyNotificationAction,
} from "../../store/MyNotification/action";
import moment from "moment";
import {getDateFormat} from "../../utils/text_format";
import {setReadNotificationData} from "../../utils/notification";
import {SetCurrentScreenAction} from "../../store/Config/action";

class MyAlertScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isChecked: false,
            isChecked2: false,
            todayNotifyData: [],
            yesterdayNotifyData: [],
            beforeNotifyData: [],
        }
    }

    async componentDidMount() {
        this.props.SetMyNotification(await setReadNotificationData('MY'));
        this.props.SetIsReadMyNotification(true);
        this.props.SetCurrentScreen('MyAlertScreen');
    }

    componentDidUpdate(prevProps, prevState) {
        const {notificationData} = this.props
        if (prevProps?.notificationData != notificationData) {
            this.initNotifyData()
        }
    }

    componentWillUnmount() {
        this.props.SetCurrentScreen('MainScreen');
    }

    initNotifyData() {
        const {notificationData} = this.props

        let todayNotifyData = []
        let yesterdayNotifyData = []
        let beforeNotifyData = []

        Array.isArray(notificationData) && notificationData?.map((item, key) => {
            const days = this.distance(item)
            if (days == 0) {  // 오늘
                todayNotifyData.push(item)
            } else if (days == 1) {  // 어제
                yesterdayNotifyData.push(item)
            } else {
                beforeNotifyData.push(item)
            }
        })

        // 최신순으로 반전
        // todayNotifyData.reverse()
        // yesterdayNotifyData.reverse()
        // beforeNotifyData.reverse()

        this.setState({
            todayNotifyData,
            yesterdayNotifyData,
            beforeNotifyData
        });
    }

    onPressItem = (item) => {
        const { body, type } = item?.additionalData;
        const shop_id = body?.shop_id;

        this.props.SetCurrentScreen('MyAlertScreen');

        switch (type) {
            case 'customer-news-register':
            case 'customer-event-register':
                const event_id = body?.event_id
                this.props.navigation.navigate('ShopScreen', { shop_id, type, event_id });
                break;
            case 'customer-report-reply':
                const report_id = body?.report_id
                this.props.navigation.navigate('ShopScreen', { shop_id, type, report_id });
                break;
            case 'admin-customer-message':
                break;
        }
    }

    distance(item) {
        const date1 = new Date(moment(item.date).format("YYYY-MM-DD"))
        const date2 = new Date(moment(new Date()).format("YYYY-MM-DD"))

        const difference = date2.getTime() - date1.getTime()
        const days = Math.ceil(difference / (1000 * 3600 * 24))

        return days
    }

    HeaderToday() {
        return (
            <View style={styles.itemheader}>
                <Text style={styles.itemheadertext}>
                    {language.TODAY}
                </Text>
            </View>
        )
    }

    HeaderYesterday() {
        return (
            <View style={styles.itemheader}>
                <Text style={styles.itemheadertext}>
                    {language.YESTERDAY}
                </Text>
            </View>
        )
    }

    HeaderBeforeYesterday() {
        return (
            <View style={styles.itemheader}>
                <Text style={styles.itemheadertext}>
                    {language.BEFORE_YESTERDAY}
                </Text>
            </View>
        )
    }

    ItemContent(item) {
        const additionalData = item?.additionalData;
        const type = item?.additionalData?.type;
        const body = item?.additionalData?.body;
        const date = getDateFormat(item?.date, 'YYYY-MM-DD');

        return (
            <View style={{flex: 8, justifyContent: "center"}}>
                {type == "customer-news-register" &&
                    <Text style={[styles.description]} textBreakStrategy="highQuality">{language.FAVORITE_SHOP} {''}
                        <Text style={[styles.shopname]}>{body?.shop_name}</Text>
                        <Text style={[styles.description]}>{language.IN} {''}</Text>
                        <Text style={[styles.textnews]} textBreakStrategy="highQuality">{body?.event_type_name}</Text>
                        <Text style={[styles.description]}
                              textBreakStrategy="highQuality">{'을'} {''}{language.REGISTERED} {''}</Text>
                    </Text>
                }
                {type == "customer-event-register" &&
                    <Text style={[styles.description]} textBreakStrategy="highQuality">{language.FAVORITE_SHOP} {''}
                        <Text style={[styles.shopname]}>{body?.shop_name}</Text>
                        <Text style={[styles.description]}>{language.IN} {''}</Text>
                        <Text style={[styles.textevent]} textBreakStrategy="highQuality">{body?.event_type_name}</Text>
                        <Text style={[styles.description]}
                              textBreakStrategy="highQuality">{'를'} {''}{language.REGISTERED} {''}</Text>
                    </Text>
                }
                {type == "admin-seller-message" &&
                    <Text style={[styles.description]}
                          textBreakStrategy="highQuality">{item?.additionalData?.content}</Text>
                    }
                {type == "customer-report-reply" &&
                    <Text>
                        {/*<Text style={[styles.shopname]}>{body?.shop_name} </Text>*/}
                        {/*<Text style={[styles.description]}>{language.IN} {''}</Text>*/}
                        <Text style={[styles.description]}>{language.POST_CEO} {''}</Text>
                        <Text style={[styles.textcomment]}>답글</Text>
                        <Text style={[styles.description]}>{language.ARRIVED_COMMENT}</Text>
                    </Text>
                }

                <View style={{paddingTop: 5}}>
                    <Text style={[styles.loadaddr]} numberOfLines={1}>{date}</Text>
                </View>
            </View>
        )
    }

    renderItem(item) {
        const type = item?.additionalData?.type
        const body = item?.additionalData?.body

        return (
            <TouchableOpacity key={item.key} style={{flex: 1, flexDirection: 'row', paddingVertical: 15}}
                              onPress={() => this.onPressItem(item)}
            >
                <View style={{flex: 1}}>
                    {type == "admin-seller-message" &&
                    <View style={{flexDirection: "row"}}>
                        <Image source={theme.logo_heart} style={{marginTop: 4, width: 20, height: 20}}/>
                        {!item.check && <View style={styles.circle}/>}
                    </View>
                    }
                    {type == "customer-news-register" &&
                    <View style={{flexDirection: "row"}}>
                        <Image source={theme.ic_new} style={{marginTop: 4, width: 20, height: 20}}/>
                        {!item.check && <View style={styles.circle}/>}
                    </View>
                    }
                    {type == "customer-event-register" &&
                    <View style={{flexDirection: "row"}}>
                        <Image source={theme.ic_event} style={{marginTop: 4, width: 20, height: 20}}/>
                        {!item.check && <View style={styles.circle}/>}
                    </View>
                    }
                    {type == "customer-report-reply" &&
                    <View style={{flexDirection: "row"}}>
                        <Image source={theme.ic_comment} style={{marginTop: 4, width: 20, height: 20}}/>
                        {!item.check && <View style={styles.circle}/>}
                    </View>
                    }
                </View>

                {this.ItemContent(item)}

                <View style={{flex: 1, alignItems: 'flex-end', justifyContent: "center"}}>
                    <TouchableOpacity>
                        <Image source={theme.ic_more_nor} style={{width: 30, height: 30}}/>
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>
        )
    }

    render() {
        const {todayNotifyData, yesterdayNotifyData, beforeNotifyData} = this.state

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <Header leftIcon="angle-left" title={language.MYALERT} navigation={this.props.navigation} isShowTerm={true}/>

                <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                    {todayNotifyData?.length > 0 && (
                        <View>
                            {this.HeaderToday()}
                            {todayNotifyData?.map((item, key) => {
                                item.key = key
                                return this.renderItem(item)
                            })}
                        </View>
                    )
                    }

                    {yesterdayNotifyData?.length > 0 && (
                        <View>
                            {this.HeaderYesterday()}
                            {yesterdayNotifyData?.map((item, key) => {
                                item.key = key
                                return this.renderItem(item)
                            })}
                        </View>
                    )
                    }

                    {beforeNotifyData?.length > 0 && (
                        <View>
                            {this.HeaderBeforeYesterday()}
                            {beforeNotifyData?.map((item, key) => {
                                item.key = key
                                return this.renderItem(item)
                            })}
                        </View>
                    )
                    }
                    <View style={{marginBottom: 50}}></View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        notificationData: state.mynotification.notificationData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        SetMyNotification: (data) => dispatch(SetMyNotificationAction(data)),
        SetIsReadMyNotification: (data) => dispatch(SetIsReadMyNotificationAction(data)),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MyAlertScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },
    body: {
        marginHorizontal: 20,
    },
    itemheader: {
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5
    },
    itemheadertext: {
        fontSize: theme.font14,
        fontWeight: 'bold'
    },
    title: {
        color: theme.black,
        fontSize: theme.fontLarge,
        textAlign: 'center'
    },
    description: {
        color: theme.black,
        fontSize: theme.fontMedium,
    },
    textevent: {
        color: theme.primaryDark,
        fontSize: theme.fontMedium,
        fontWeight: "bold"
    },
    textcomment: {
        color: theme.purple,
        fontSize: theme.fontMedium,
        fontWeight: "bold"
    },
    textnews: {
        color: theme.lightgreen,
        fontSize: theme.fontMedium,
        fontWeight: "bold"
    },
    loadaddr: {
        fontSize: theme.fontSmall,
        color: theme.grey1,
        paddingLeft: 4,
    },
    circle: {
        alignSelf: "flex-start",
        borderRadius: 3,
        borderWidth: 3,
        borderColor: theme.red,
    },
    shopname: {
        color: theme.black,
        fontSize: theme.fontMedium,
        fontWeight: 'bold'
    },
});
