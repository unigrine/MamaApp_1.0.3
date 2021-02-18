// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground,
    ActivityIndicator, ScrollView, Animated,
} from "react-native";
import {useNavigation, useTheme} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import ShopHeader from "../../component/ShopHeader"
import ShopDetailInfo from "../../component/ShopDetailInfo"
import {connect} from 'react-redux';
import {GetShopInfoByShopIdAction, SetDefaultValueShopAction} from "../../store/Shop/action";
import {GetNewsEventAction, SetDefaultValueNewsEventAction} from "../../store/NewsEvent/action";
import {DeleteNewsEventAction} from "../../store/NewsEvent/action";
import {
    GetCeoReportInfoAction,
    DeleteCeoReportAction,
    DeleteReplyByCeoAction,
    SetDefaultValueCeoReportAction
} from "../../store/CeoReport/action";
import {SetCurrentScreenAction} from "../../store/Config/action";
import CommentToCeo from "../../component/CommentToCeo";
import NewsEventCard from "../../component/NewsEventCard";
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import NewsEventCardWrapper from "../../component/NewsEventCardWrapper";
import {UploadMarkImageAction} from "../../store/Home/action";
import {isEmptyCheck} from "../../utils/regex";

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 41;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const initialLayout = {width: Dimensions.get('window').width};

class ShopScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 2,
            del_event_id: "",
            shop_id: "",
            del_type: 2,
            rating: 0,
            isChecked2: false,
            deleteModal: false,

            search_shop_id: this.props?.route?.params?.shop_id,
            search_type: this.props?.route?.params?.type,
            search_event_id: this.props?.route?.params?.event_id,
            search_report_id: this.props?.route?.params?.report_id,

            scrollY: new Animated.Value(0),

            index: 1,
            routes: [
                {key: 'active1', title: language.DETAIL_INFO},
                {key: 'active2', title: ""},
                {key: 'active3', title: language.HOPE_CEO},
            ],
        }

        this.onPressCeoReportDelete = this.onPressCeoReportDelete.bind(this)
        this.onPressRightButton = this.onPressRightButton.bind(this)
        this.onPressLeftButton = this.onPressLeftButton.bind(this)

        this.scrollRef = React.createRef();

        this.renderScene = this.renderScene.bind(this);
        this.onTabChange = this.onTabChange.bind(this);

        this.renderScene2 = this.renderScene2.bind(this);
        this.onTabChange2 = this.onTabChange2.bind(this);

        // 탭뷰에 다 적재되도록 초기 불러들임
        this.getShopInfo()
    }

    componentDidMount() {
        // 내 가게 정보 모두 얻어오기, 얻은 후 연이어 새소식/이벤트, 사장님께 바란다 얻기API 호출
        this.getNewsEventInfo();
        this.getCeoReport();
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            shop_data,
            // isLoading,
            // isCeoReportDeleteLoading,
            // isGetCeoReportLoading,
            // isGetNewsEventLoading,
            // isReportLoading,
            currentScreen,
            isDeletedCommentToCeo,
            isCommentLoading
        } = this.props

        // if (prevProps.isLoading != isLoading && isLoading == false) {
        //   this.getNewsEventInfo()  // 내 이벤트/새소식 정보 불러오기
        //   this.getCeoReport()
        // }
        //
        // if (prevProps.isGetCeoReportLoading != isGetCeoReportLoading && isGetCeoReportLoading == false) {
        //     // this.setState({ index: 2, selectedTab: 3 })
        // }
        //
        // if (prevProps.isCeoReportDeleteLoading != isCeoReportDeleteLoading && isCeoReportDeleteLoading == false) {
        //   this.getCeoReport()
        // }
        //
        // if (prevProps.isGetNewsEventLoading != isGetNewsEventLoading && isGetNewsEventLoading == false) {
        //
        // }
        //
        // if (prevProps.isReportLoading != isReportLoading && isReportLoading == false) {
        //     this.getNewsEventInfo()  // Comments에서 report한 후, 혹은 ReportScreen에서 report한 후에도..
        // }    //

        if (currentScreen === 'MainScreen' || currentScreen === 'HomeScreen') {
            this.props.SetCurrentScreen("ShopScreen");
        }

        if (currentScreen === 'MyAlertScreen') {
            this.props.SetCurrentScreen("ShopScreen");

            const { search_type } = this.state;
            switch (search_type) {
                case 'customer-news-register':
                case 'customer-event-register':
                    this.setState({index: 1, selectedTab: 2});
                    break;
                case 'customer-report-reply':
                    this.setState({index: 2, selectedTab: 3});
                    break;
                case 'admin-customer-message':
                    break;
            }
        }

        if (currentScreen === 'CommentToCeoScreen') {
            this.props.SetCurrentScreen("ShopScreen");
            this.setState({index: 2, selectedTab: 3});
            this.getShopInfo();
            this.getCeoReport();
        }

        if (prevProps.isDeletedCommentToCeo !== isDeletedCommentToCeo && !isDeletedCommentToCeo) {
            this.getShopInfo();
            this.getCeoReport();
        }
    }

    componentWillUnmount() {
        this.props.SetCurrentScreen("ShopScreen")
        this.props.SetDefaultValueCeoReport();
        this.props.SetDefaultValueNewsEvent();
        this.props.SetDefaultValueShop();
    }

    getShopInfo = () => {
        const {location} = this.props
        const {search_shop_id} = this.state

        const latitude = !location ? null : parseFloat(location?.latitude)
        const longitude = !location ? null : parseFloat(location?.longitude)

        const data = {
            shop_id: search_shop_id,
            latitude,
            longitude
        }

        this.props.GetShopInfoByShopId(data)
    }

    onPressUpArrow(opacity) {
        if (opacity < 0.5) return

        this.scrollRef.current.scrollTo({y: 0, animated: true})
    }

    onPressWrite = () => {
        const {shop_data, token} = this.props

        if (isEmptyCheck(token))
            this.props?.navigation.navigate("LoginForHopeToCeoScreen", {report: {}, shop_id: shop_data?.id})
        else
            this.props?.navigation.navigate("CommentToCeoScreen", {report: {}, shop_id: shop_data?.id})
    }

    getNewsEventInfo() {
        const {search_shop_id} = this.state
        const {shop_data, token} = this.props

        this.props.GetNewsEvent({
            shop_id: search_shop_id,
            token
        })
    }

    getCeoReport() {
        const {search_shop_id} = this.state
        const {shop_data, token} = this.props

        // 사장님께 바란다 리스트 불러오기
        this.props.GetCeoReportInfo({
            shop_id: search_shop_id,
            token
        })
    }

    onPressCeoReportDelete(item) {
        this.setState({
            del_event_id: item?.id,
            shop_id: item?.shop_id,
            rating: item?.rating,
            deleteModal: true,
            del_type: 2
        });
    }

    onPressDeleteSure() {
        let data = {
            id: this.state.del_event_id,
            token: this.props.token,
            shop_id: this.state.shop_id,
            rating: this.state.rating
        }

        this.props.DeleteCeoReport(data)
        this.setState({deleteModal: false})
    }

    onPressRightButton = () => {
        const {shop_data} = this.props
        this.props.navigation.navigate("MapScreen", {shop_data})
    }

    onPressLeftButton = () => {
        this.props.SetCurrentScreen("MainScreen")
        this.props.navigation.goBack()
    }

    HeaderView() {
        const {shop_data} = this.props

        let distance = shop_data?.distance;
        if (distance == null || distance == undefined)
            distance = ""
        else if (distance >= 1)
            distance = Number(distance.toFixed(2)) + " km"
        else
            distance = Math.round(distance * 1000) + " m"

        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT + 20],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });

        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });

        const headerBackgroundOpacity = this.state.scrollY.interpolate({
            inputRange: [HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.header, {
                height: headerHeight,
                opacity: headerBackgroundOpacity,
                transform: [{translateY: imageTranslate}]
            }]}>
                {!shop_data?.introduce_image ?
                    <ImageBackground
                        style={{height: 180, backgroundColor: theme.grey1_3}}
                    >
                        <View style={{height: 20}}/>
                        <ShopHeader leftIcon="chevron-left" title={shop_data?.address} rightIcon="map-marker"
                                    navigation={this.props.navigation}
                                    onPressRightButton={this.onPressRightButton}
                                    onPressLeftButton={this.onPressLeftButton}
                        />
                    </ImageBackground>
                    :
                    <ImageBackground
                        style={{height: 180, backgroundColor: theme.grey1_3}}
                        source={{uri: shop_data?.introduce_image}}
                    >
                        <View style={{height: 20}}/>
                        <ShopHeader leftIcon="chevron-left" title={shop_data?.address} rightIcon="map-marker"
                                    navigation={this.props.navigation}
                                    onPressRightButton={this.onPressRightButton}
                                    onPressLeftButton={this.onPressLeftButton}
                        />
                    </ImageBackground>
                }
                <View style={styles.shopLogoWrapper}>
                    <View style={styles.shopLogo}>
                        {!shop_data?.mark_image ?
                            <Image
                                source={theme.img_profile}
                                style={{width: "100%", height: "100%"}}>
                            </Image>
                            :
                            <Image
                                source={{uri: shop_data?.mark_image}}
                                style={{width: "100%", height: "100%"}}>
                            </Image>
                        }
                    </View>
                </View>

                <View style={{flex: 1}}>
                    <View style={[styles.favorite, {marginTop: -20}]}>
                        <View>
                            <Image
                                source={theme.favorite_nor}
                                style={{height: 20, width: 20, resizeMode: "contain", alignSelf: "center"}}
                            />
                            <Text style={{
                                color: theme.grey1,
                                fontSize: theme.fontSmall,
                                textAlign: "center"
                            }}>{shop_data?.favorite_count ? shop_data?.favorite_count : 0}</Text>
                        </View>
                    </View>

                    <View style={{flex: 1, alignSelf: 'center', alignItems: "center", marginTop: -20}}>
                        <Text style={styles.shoptitle} numberOfLines={2}>
                            {shop_data?.shop_name}
                        </Text>

                        <View style={{flexDirection: "row", alignItems: "center", marginBottom: 7}}>
                            <View style={{flex: 1, alignItems: "flex-end"}}>
                                <View style={[{
                                    paddingLeft: 10,
                                    marginHorizontal: 5,
                                    flexDirection: 'row',
                                    alignItems: "center"
                                }, styles.remarkwrapper1]}>
                                    <Image
                                        source={theme.ic_star_nor}
                                        style={{height: 15, width: 15, resizeMode: "contain"}}
                                    />
                                    <Text
                                        style={[styles.remarkwrapper]}>
                                        {shop_data?.average_mark ?
                                            Number(shop_data?.average_mark).toFixed(1) :
                                            Number(0).toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={styles.remarkwrapper}>{distance}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animated.View>
        )

    }

    DeleteModal() {
        const {del_type} = this.state
        const {token} = this.props;

        return (
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{marginTop: 0, paddingTop: 0}}>
                        <View style={{alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={() => this.setState({deleteModal: false})}>
                                <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={{
                            textAlign: "center",
                            paddingHorizontal: 0,
                            fontSize: theme.font18,
                            color: theme.black
                        }}>
                            {del_type == 2 ? language.DO_YOU_WANT_DELETE_COMENT : language.DO_YOU_WANT_DELETE_COMENT}
                        </Text>

                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnDelete}
                                              onPress={() => this.onPressDeleteSure()}
                            >
                                <Text
                                    style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                    {language.DELETE}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    BottomView() {
        const {selectedTab} = this.state
        return (
            <View>
                {selectedTab === 3 && (
                    <TouchableOpacity style={styles.btnWriter} onPress={() => this.onPressWrite()}>
                        <Image source={theme.ic_write_nor}
                               style={{width: 40, height: 40}}
                        >
                        </Image>
                    </TouchableOpacity>
                )}
            </View>
        )
    }

    ArrwoButtonView() {
        const {selectedTab} = this.state
        const opacity = this.state.scrollY.interpolate({
            inputRange: [HEADER_MAX_HEIGHT + 200, HEADER_MAX_HEIGHT + 220],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.upArrowWrapper, {opacity: opacity}]}>
                {selectedTab === 2 && (
                    <TouchableOpacity onPress={() => this.onPressUpArrow(opacity)}>
                        <Image
                            source={theme.ic_arrowup}
                            style={styles.upArrow}
                        />
                    </TouchableOpacity>
                )}
            </Animated.View>
        )
    }

    onTabChange(index) {
        this.setState({index, selectedTab: index + 1});

        switch (index) {
            case 0:
                this.getShopInfo()
                break;
            case 1:
                this.getNewsEventInfo();
                break;
            case 2:
                this.getCeoReport();
                break;
        }
        const {ceo_report_list, news_event_list, shop_data} = this.props

        // 태브 슬라이더 할 때 텅빈 탭 영역은 자동 아래로 내려오도록 한다.
        if (!shop_data || shop_data?.length < 1)
            this.onPressUpArrow(1)
        else if (index == 1 && (!news_event_list || news_event_list.length < 1))
            this.onPressUpArrow(1)
        else if (index == 2 && (!ceo_report_list || ceo_report_list.length < 1))
            this.onPressUpArrow(1)
    }

    // Here you can send props to different tab components
    renderScene({route}) {
        if (!route.key) return null;

        if (route.key === 'active1') {
            return <ShopDetailInfo
                type="active"
                navigation={this.props.navigation}
                props={this.props}
            />
        }

        if (route.key === 'active2') {
            return <NewsEventCardWrapper
                type="active"
                props={this.props}
                navigation={this.props.navigation}
                onPressDelete={this.onPressDelete}/>
        }

        if (route.key === 'active3') {
            return <CommentToCeo
                type="active"
                navigation={this.props.navigation}
                props={this.props}
                onPressDelete={this.onPressCeoReportDelete}/>
        }
    }

    getTabBarIcon = (props) => {
        const {selectedTab} = this.state
        const {route} = props

        if (route.key === 'active2') {
            return (
                <TouchableOpacity style={{height: 0, marginTop: -4}} onPress={() => this.onPressProductList()}>
                    {
                        selectedTab != 2 ?
                            <Image
                                source={theme.ic_feed_foc}
                                style={{width: 30, height: 30, tintColor: theme.grey1}}
                            >
                            </Image>
                            :
                            <Image
                                source={theme.ic_feed_foc}
                                style={{width: 30, height: 30, tintColor: theme.primary}}
                            >
                            </Image>
                    }
                </TouchableOpacity>
            )
        }

    }

    _renderLabel = ({route}) => {
        const {selectedTab} = this.state
        if (!route.key) return null;

        if (route.key === 'active1') {
            return (
                <Text style={selectedTab == 1 ? styles.focustab : styles.texthome}>{route.title}</Text>
            )
        }
        if (route.key === 'active2') {
            return (
                <Text style={selectedTab == 2 ? styles.focustab : styles.texthome}>{route.title}</Text>
            )
        }
        if (route.key === 'active3') {
            return (
                <Text style={selectedTab == 3 ? styles.focustab : styles.texthome}>{route.title}</Text>
            )
        }
    }
    //custom tab bar
    customtab = (props) => {
        return (
            <TabBar
                {...props}
                indicatorContainerStyle={{alignItems: "center"}}
                indicatorStyle={{
                    backgroundColor: '#F0568D',
                    height: 3,
                    borderRadius: 100,
                    opacity: 0.7,
                    alignContent: "center"
                }}
                style={{elevation: 2, backgroundColor: 'white', borderTopColor: theme.grey1, borderTopWidth: 0.5}}
                // labelStyle={styles.texthome}
                renderLabel={this._renderLabel}
                inactiveColor={theme.grey1}
                activeColor={theme.primary}
                renderIcon={
                    props => this.getTabBarIcon(props)
                }
            />
        )
    }

    renderTab() {
        const {index, routes} = this.state

        return (
            <TabView
                navigationState={{index, routes}}
                renderTabBar={this.customtab}
                onIndexChange={this.onTabChange}
                renderScene={this.renderScene}
                initialLayout={initialLayout}
            />
        );
    }

    onTabChange2(index) {
        this.setState({index, selectedTab: index + 1});
        this.onPressUpArrow(1)
    }

    // Here you can send props to different tab components
    renderScene2({route}) {
        if (!route.key) return null;
    }

    //custom tab bar
    customtab2 = (props) => {
        return (
            <TabBar
                {...props}
                indicatorContainerStyle={{alignItems: "center"}}
                indicatorStyle={{
                    backgroundColor: '#F0568D',
                    height: 3,
                    borderRadius: 100,
                    opacity: 0.7,
                    alignContent: "center"
                }}
                style={{elevation: 5, backgroundColor: 'white', borderTopColor: theme.grey1, borderTopWidth: 0.5}}
                // labelStyle={styles.texthome}
                renderLabel={this._renderLabel}
                inactiveColor={theme.grey1}
                activeColor={theme.primary}
                renderIcon={
                    props => this.getTabBarIcon(props)
                }
            />
        )
    }

    renderTab2() {
        const {index, routes} = this.state
        const {shop_data} = this.props

        const headerOpacity = this.state.scrollY.interpolate({
            // inputRange: [HEADER_SCROLL_DISTANCE+HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE+HEADER_MIN_HEIGHT+20],
            inputRange: [HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT + 5, HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT + 10],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.fixedHeader, {opacity: headerOpacity}]}>
                <ShopHeader leftIcon="chevron-left" title={shop_data?.shop_name} rightIcon="map-marker"
                            textColor={"black"} navigation={this.props.navigation}
                            onPressRightButton={this.onPressRightButton}
                            onPressLeftButton={this.onPressLeftButton}
                />
                <TabView
                    navigationState={{index, routes}}
                    renderTabBar={this.customtab2}
                    onIndexChange={this.onTabChange2}
                    renderScene={this.renderScene2}
                    initialLayout={initialLayout}
                />
            </Animated.View>
        );
    }

    render() {
        const {deleteModal} = this.state
        const {isLoading, isGetCeoReportLoading, isGetNewsEventLoading, isUploadImageLoading} = this.props
        const flag = isLoading || isGetCeoReportLoading || isGetNewsEventLoading || isUploadImageLoading

        return (
            <View style={styles.container}>
                {flag &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={flag} size="large"
                                   color={theme.primary}/>
                }
                <View style={styles.fill}>
                    <ScrollView
                        ref={this.scrollRef}
                        style={{flex: 1, backgroundColor: theme.minigrey}}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
                        )}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{height: HEADER_MAX_HEIGHT}}/>
                        {this.renderTab()}
                    </ScrollView>

                    {this.HeaderView()}
                    {this.renderTab2()}
                    {this.BottomView()}
                    {deleteModal && this.DeleteModal()}

                    {this.ArrwoButtonView()}

                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        customer_id: state.customer.customer_id,
        token: state.customer.token,
        location: state.userstatus.location,
        shop_data: state.shop.shop_data,
        news_event_list: state.newsevent.news_event_list,
        ceo_report_list: state.ceoreport.ceo_report_list, // needed, used in CommentToCeo
        isLoading: state.shop.isLoading,
        isGetCeoReportLoading: state.ceoreport.isLoading,
        isGetNewsEventLoading: state.newsevent.isLoading,
        isReportLoading: state.newsevent.isReportLoading,
        isDeletedCommentToCeo: state.ceoreport.isDeleteLoading,
        isChangedCommentToCeo: state.ceoreport.isUpdateLoading,
        currentScreen: state.userstatus.currentscreen,
        isCommentLoading: state.newsevent.isCommentLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetShopInfoByShopId: (data) => dispatch(GetShopInfoByShopIdAction(data)),
        GetNewsEvent: (data) => dispatch(GetNewsEventAction(data)),
        DeleteNewsEvent: (data) => dispatch(DeleteNewsEventAction(data)),
        GetCeoReportInfo: (data) => dispatch(GetCeoReportInfoAction(data)),
        DeleteCeoReport: (data) => dispatch(DeleteCeoReportAction(data)),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
        SetDefaultValueCeoReport: (data) => dispatch(SetDefaultValueCeoReportAction(data)),
        SetDefaultValueNewsEvent: (data) => dispatch(SetDefaultValueNewsEventAction(data)),
        SetDefaultValueShop: (data) => dispatch(SetDefaultValueShopAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
        position: "relative"
    },
    shopLogo: {
        borderRadius: 100,
        backgroundColor: '#D8D8D8',
        overflow: "hidden"
    },
    shopLogoWrapper: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginTop: -70
    },
    camera: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 30,
        overflow: "hidden",
        backgroundColor: theme.white,
        alignItems: "center",
        justifyContent: "center",
        borderColor: theme.grey2,
        borderWidth: 0.5,
    },
    favorite: {
        flex: 1,
        flexDirection: "row",
        marginTop: -10,
        marginRight: 20,
        alignSelf: "flex-end",
    },
    shoptitle: {
        flex: 1,
        color: theme.black,
        fontSize: 21,
        textAlign: 'center',
    },
    remarkwrapper: {
        color: theme.black,
        fontSize: theme.font14,
    },
    remarkwrapper1: {
        paddingRight: 5,
        borderRightWidth: 0.5,
        borderRightColor: theme.grey1
    },
    tabWrapper: {
        marginTop: HEADER_MAX_HEIGHT,
        position: "relative",
        flexDirection: "row",
        justifyContent: 'space-around',
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        borderTopColor: theme.grey1,
        borderTopWidth: 0.5,
        paddingTop: 10,
        height: HEADER_MIN_HEIGHT,
        backgroundColor: theme.white
    },
    tabWrapper1: {
        flexDirection: "row",
        justifyContent: 'space-around',
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        borderTopColor: theme.grey1,
        borderTopWidth: 0.5,
        top: 0,
        left: 0,
        height: HEADER_MIN_HEIGHT,
        paddingTop: 10,
        width: "100%",
        backgroundColor: theme.white
    },
    fixedHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        height: HEADER_MIN_HEIGHT + 83,
        paddingTop: 20,
        width: "100%",
        backgroundColor: theme.white
    },
    texthome: {
        fontSize: theme.font14,
        fontWeight: 'bold',
        textAlign: "center",
        color: theme.grey1
    },
    focustab: {
        fontSize: theme.font14,
        fontWeight: 'bold',
        textAlign: "center",
        color: theme.primary
    },
    unfocustab: {
        color: theme.grey1,
    },
    focusText: {
        color: theme.primary
    },
    btnWrapper: {
        position: 'absolute',
        bottom: 30,
        backgroundColor: theme.primary,
        borderRadius: 100,
        width: "72%",
        alignSelf: 'center',
        padding: 10,
    },
    btnText: {
        color: theme.white,
        fontSize: theme.fontMedium,
        fontWeight: "bold"
    },
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    },
    modal: {
        width: '80%',
        backgroundColor: '#fff',
        zIndex: 10,
        paddingBottom: 30,
    },
    btnDelete: {
        borderRadius: 2,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingVertical: 14,
        marginHorizontal: 40
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.white,
        overflow: 'hidden',
    },
    fill: {
        flex: 1,
    },
    btnWriter: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 80,
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: 'center',
        overflow: "hidden",
        zIndex: 10,
    },
    upArrowWrapper: {
        position: "absolute",
        bottom: 60,
        right: 10,
    },
    upArrow: {
        height: 50,
        width: 50,
        resizeMode: "contain",
    }
});
