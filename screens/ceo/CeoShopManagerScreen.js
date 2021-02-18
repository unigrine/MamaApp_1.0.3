// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground,
    ActivityIndicator, Platform, ScrollView, Animated, Dimensions
} from "react-native";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CeoShopHeader from "../../component/CeoShopHeader";
import {connect} from 'react-redux';
import {GetShopInfoAction, UploadMarkImageAction} from "../../store/Shop/action";
import CeoNewsEvent from "../../component/CeoNewsEvent";
import {GetNewsEventAction} from "../../store/NewsEvent/action";
import {DeleteNewsEventAction} from "../../store/NewsEvent/action";
import {GetCeoReportInfoAction, DeleteReplyByCeoAction} from "../../store/CeoReport/action";
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import ShopDetailInfoTabWrapper from "../../component/ShopDetailInfoTabWrapper";
import CeoNewsEventWrapper from "../../component/CeoNewsEventWrapper";
import HopeToCeoWrapper from "../../component/HopeToCeoWrapper";
import {RegisterCeoOneSignalIdAction} from "../../store/CeoAuth/action";
import {getNotificationData, inspectReadNotificationData} from "../../utils/notification";
import {SetIsReadCeoNotificationAction} from "../../store/CeoNotification/action";
import {isEmptyCheck} from "../../utils/regex";
import {SetUserStatusAction} from "../../store/Config/action";

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 41;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const initialLayout = {width: Dimensions.get('window').width};

let _this = null

class CeoShopManagerScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tabselect: 2,
            del_event_id: "",
            del_type: 1,
            isChecked2: false,
            deleteModal: false,
            isRegister: false,

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

        this.onPressDelete = this.onPressDelete.bind(this)
        this.onPressCeoReportDelete = this.onPressCeoReportDelete.bind(this)

        this.scrollRef = React.createRef();

        this.renderScene = this.renderScene.bind(this);
        this.onTabChange = this.onTabChange.bind(this);

        this.renderScene2 = this.renderScene2.bind(this);
        this.onTabChange2 = this.onTabChange2.bind(this);

        _this = this
    }

    async componentDidMount() {
        const { seller_uid, deviceid, onesignal_id, token } = this.props;

        if (isEmptyCheck(token)) {
            this.props.navigation.navigate('LoginCeoScreen');
        }

        this.setState({tabselect: 2, index: 1});

        // 한 번 등록한 적 있으면 패스 로직 필요
        this.props.RegisterCeoOneSignalId({
            seller_uuid: seller_uid,
            uuid: deviceid,
            player_id: onesignal_id
        });

        this.props.SetIsReadCeoNotification(await inspectReadNotificationData('CEO'));

        // 탭뷰에 다 적재되도록 초기 불러들임
        this.getShopInfo()  // 내 가게 정보 모두 얻어오기
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            shop_data,
            isLoading,
            news_event_list,
            isDeleteLoading,
            isReplyDeleteLoading,
            isReadNotification,
            currentScreen,
            isUpdateBusinessLoading,
            isUpdateVerificationLoading,
        } = this.props;

        // navigation params 정보로 탭 이동
        // console.log(prevState.tabselect);
        // console.log(JSON.stringify(prevProps));
        // if (prevState.tabselect !== this.props.route.params?.tabselect) {
        //     const tabselect = this.props.route.params?.tabselect;
        //     if (typeof tabselect === 'number') {
        //         this.setState({ index: tabselect-1, tabselect });
        //     }
        // }

        if (prevProps.isLoading != isLoading && isLoading == false) {
            if ((shop_data && shop_data?.length < 1) || shop_data == null ||
                (shop_data?.introduce_text == null || shop_data?.introduce_text == "") && shop_data?.running_time.length < 1 &&
                (shop_data?.phone == null || shop_data?.phone == "") && shop_data?.menu.length < 1) {
                this.setState({isRegister: true})
            } else {
                this.setState({isRegister: false})
            }

            if (shop_data?.id != null || shop_data?.id != undefined) {
                this.getNewsEventInfo()
                this.getCeoReport()
            }
        }

        if (prevProps.news_event_list != news_event_list) {

        }

        if (prevProps.isDeleteLoading != isDeleteLoading && isDeleteLoading == false) {
            this.setState({deleteModal: false})
            this.getNewsEventInfo()
        }

        if (prevProps.isReplyDeleteLoading != isReplyDeleteLoading && isReplyDeleteLoading == false) {
            this.setState({deleteModal: false})
            this.getCeoReport()
        }

        if (currentScreen === 'CeoAlertScreen') {
            this.props.SetCurrentScreen("CeoShopManagerScreen");

            const { search_type } = this.state;
            switch (search_type) {
                case 'seller-news-register':
                case 'seller-event-register':
                    this.setState({index: 1, selectedTab: 2});
                    break;
                case 'seller-report-register':
                    this.setState({index: 2, selectedTab: 3});
                    break;
                case 'admin-customer-message':
                    break;
            }
        }

        if (prevProps.isUpdateBusinessLoading != isUpdateBusinessLoading && isUpdateBusinessLoading == false) {
            this.getShopInfo();
        }

        if (prevProps.isUpdateVerificationLoading !== isUpdateVerificationLoading && isUpdateVerificationLoading == false) {
            this.getShopInfo();
        }
    }

    componentWillUnmount() {
        this.props.setUserStatus({
            status: "onboarding"
        });
    }

    onPressUpArrow(opacity) {
        if (opacity < 0.5) return

        this.scrollRef.current.scrollTo({y: 0, animated: true})
    }

    getShopInfo = () => {
        const { seller_id, token, location } = this.props;

        const latitude = !location ? "" : location.latitude
        const longitude = !location ? "" : location.longitude

        this.props.GetShopInfo({
            token,
            seller_id,
            latitude,
            longitude
        });
    }

    getNewsEventInfo() {
        const {shop_data, token} = this.props
        let shop_id = shop_data?.id
        const data = {shop_id, token}
        this.props.GetNewsEvent(data)
    }

    onPressDetailInfo = () => {
        this.setState({tabselect: 1})
    }

    onPressProductList = () => {
        this.getNewsEventInfo()  // 내 이벤트/새소식 정보 불러오기
        this.setState({tabselect: 2})
    }

    onPressComment = () => {
        this.getCeoReport()
        this.setState({tabselect: 3})
    }

    getCeoReport() {
        const {shop_data, token} = this.props
        const shop_id = shop_data?.id
        const data = {shop_id, token}

        this.props.GetCeoReportInfo(data)  // 사장님께 바란다 리스트 불러오기
    }

    onPressDelete(id) {
        this.setState({del_event_id: id, deleteModal: true, del_type: 1})
    }

    onPressCeoReportDelete(id) {
        console.log(id)
        this.setState({del_event_id: id, deleteModal: true, del_type: 2})
    }

    onPressDeleteSure() {
        const {del_type} = this.state
        let data = {
            id: this.state.del_event_id,
            token: this.props.token
        }
        if (del_type == 1)
            this.props.DeleteNewsEvent(data)
        else if (del_type == 2)
            this.props.DeleteReplyByCeo(data)
    }

    onPressRightButton = () => {
        this.props.navigation.navigate('CeoAlertScreen', {})
    }

    onPressChangeDetailInfo = () => {
        this.props.navigation.navigate('RegisterShopInfoDetailScreen', {updating: true})
    }

    onPressRegisterNews = () => {
        this.props.navigation.navigate('RegisterNewsOrEventScreen')
    }

    openCamera() {
        // this.RBSheet.close()
        const {shop_data, token} = this.props

        ImagePicker.openCamera({
            // width: 300,
            // height: 300,
            cropping: true
        }).then(image => {
            const filename = image.path.replace(/^.*[\\\/]/, '')
            const source = {
                uri: Platform.OS == 'android' ? image.path : image.path.replace('file://', ''),
                type: image.mime,
                name: `${filename}`
            };

            let data = new FormData();
            data.append('mark_image', source)

            let sendData = {
                id: shop_data?.id,
                token,
                data,
            }
            this.props.UploadMarkImage(sendData)
        }).catch(err => {
            console.log(err)
        });
    }

    openGallery() {
        // this.RBSheet.close()

        const {shop_data, token} = this.props

        ImagePicker.openPicker({
            // width: 300,
            // height: 300,
            cropping: true
        }).then(image => {
            const filename = image.path.replace(/^.*[\\\/]/, '')
            const source = {
                uri: Platform.OS == 'android' ? image.path : image.path.replace('file://', ''),
                type: image.mime,
                name: `${filename}`
            };

            let data = new FormData();
            data.append('mark_image', source)

            let sendData = {
                id: shop_data?.id,
                token,
                data,
            }
            this.props.UploadMarkImage(sendData)
        }).catch(err => {
            console.log(err)
        });
    }

    onPressCamera = () => {
        this.RBSheet.open()
    }

    HeaderView() {
        const {shop_data} = this.props
        let distance = shop_data?.distance
        if (!distance || distance == undefined)
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
                        <CeoShopHeader leftIcon="menu" title={language.CEO_SHOP_MANAGE}
                                       notify={!this.props.isReadNotification} rightIcon="ic_alert_w_nor"
                                       navigation={this.props.navigation} onPressRightButton={this.onPressRightButton}/>
                    </ImageBackground>
                    :
                    <ImageBackground
                        style={{height: 180, backgroundColor: theme.grey1_3}}
                        source={{uri: shop_data?.introduce_image}}
                    >
                        <View style={{height: 20}}/>
                        <CeoShopHeader leftIcon="menu" title={language.CEO_SHOP_MANAGE}
                                       notify={!this.props.isReadNotification} rightIcon="ic_alert_w_nor"
                                       navigation={this.props.navigation} onPressRightButton={this.onPressRightButton}/>
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

                    <TouchableOpacity style={styles.camera} onPress={() => this.onPressCamera()}>
                        <Icon name={"camera"} size={20}/>
                    </TouchableOpacity>
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
                                        style={[styles.remarkwrapper, ]}>
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

    ButtonView() {
        const {tabselect, isRegister} = this.state
        const {shop_data, news_event_list, ceo_report_list} = this.props

        return (
            <View>
                {tabselect == 1 && !isRegister && (
                    <TouchableOpacity style={styles.btnWrapper} onPress={this.onPressChangeDetailInfo}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                            <Image source={theme.ic_write_nor} style={{width: 30, height: 30}}/>
                            <Text style={styles.btnText}>{language.DETAIL_UPDATE}</Text>
                        </View>
                    </TouchableOpacity>
                )
                }
                {tabselect == 2 && (news_event_list && news_event_list.length > 0) && (
                    <TouchableOpacity style={styles.btnWrapper} onPress={this.onPressRegisterNews}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                            <Image source={theme.ic_write_nor} style={{width: 30, height: 30}}/>
                            <Text style={styles.btnText}>{language.NEWS_REGISTER}</Text>
                        </View>
                    </TouchableOpacity>
                )
                }
            </View>
        )
    }

    DeleteModal() {
        const {del_type} = this.state
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
                            {del_type == 2 ? language.DO_YOU_WANT_DELETE_REPLY : language.DO_YOU_WANT_DELETE_EVENT}
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

    renderRow(item) {
        return (
            <View>
                <CeoNewsEvent
                    navigation={this.props.navigation}
                    onPressDelete={this.onPressDelete}
                    newseventitem={item}
                />
            </View>
        )
    }

    BottomSheet() {
        return (
            <RBSheet
                closeOnDragDown={true}
                closeOnPressMask={false}
                ref={ref => {
                    this.RBSheet = ref;
                }}
                height={200}
                openDuration={250}
                customStyles={{
                    container: {
                        alignItems: "center",
                        borderTopRightRadius: 35,
                        borderTopLeftRadius: 35,
                        justifyContent: 'space-evenly',
                        backgroundColor: theme.white,
                    }
                }}
            >
                <View style={{width: '100%', padding: 20, alignItems: "center"}}>
                    <TouchableOpacity onPress={() => this.openCamera()} style={CommonStyle.applybtn}>
                        <Text style={CommonStyle.btntext}>사진 촬영</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openGallery()} style={CommonStyle.applybtn}>
                        <Text style={CommonStyle.btntext}>앨범 선택</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.RBSheet.close()} style={CommonStyle.applybtn}>
                        <Text style={CommonStyle.btntext}>취소</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        )
    }

    ArrwoButtonView() {
        const {tabselect} = this.state
        const opacity = this.state.scrollY.interpolate({
            inputRange: [HEADER_MAX_HEIGHT + 200, HEADER_MAX_HEIGHT + 220],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.upArrowWrapper, {opacity: opacity}]}>
                {tabselect == 2 && (
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
        this.setState({index, tabselect: index + 1});
        const {ceo_report_list, news_event_list} = this.props
        const {isRegister} = this.state

        // 태브 슬라이더 할 때 텅빈 탭 영역은 자동 아래로 내려오도록 한다.
        if (index == 0 && isRegister)
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
            return <ShopDetailInfoTabWrapper
                type="active"
                navigation={this.props.navigation}
                props={this.props}
                isRegister={this.state.isRegister}
            />
        }

        if (route.key === 'active2') {
            return <CeoNewsEventWrapper
                type="active"
                props={this.props}
                navigation={this.props.navigation}
                onPressDelete={this.onPressDelete}/>
        }

        if (route.key === 'active3') {
            return <HopeToCeoWrapper
                type="active"
                navigation={this.props.navigation}
                props={this.props}
                onPressCeoReportDelete={this.onPressCeoReportDelete}/>
        }
    }

    getTabBarIcon = (props) => {
        const {tabselect} = this.state
        const {route} = props

        if (route.key === 'active2') {
            return (
                <TouchableOpacity style={{height: 0, marginTop: -4}} onPress={() => this.onPressProductList()}>
                    {
                        tabselect != 2 ?
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
        const {tabselect} = this.state
        if (!route.key) return null;

        if (route.key === 'active1') {
            return (
                <Text style={tabselect == 1 ? styles.focustab : styles.texthome}>{route.title}</Text>
            )
        }
        if (route.key === 'active2') {
            return (
                <Text style={tabselect == 2 ? styles.focustab : styles.texthome}>{route.title}</Text>
            )
        }
        if (route.key === 'active3') {
            return (
                <Text style={tabselect == 3 ? styles.focustab : styles.texthome}>{route.title}</Text>
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
        console.log('index', index);
        this.setState({index, tabselect: index + 1});

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
        const {tabselect} = this.state
        const headerOpacity = this.state.scrollY.interpolate({
            // inputRange: [HEADER_SCROLL_DISTANCE+HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE+HEADER_MIN_HEIGHT+20],
            inputRange: [HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT + 5, HEADER_SCROLL_DISTANCE - HEADER_MIN_HEIGHT + 10],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.fixedHeader, {opacity: headerOpacity}]}>
                <CeoShopHeader leftIcon="menu" title={language.CEO_SHOP_MANAGE} notify={!this.props.isReadNotification}
                               rightIcon="ic_alert_w_nor" textColor={"black"} navigation={this.props.navigation}
                               onPressRightButton={this.onPressRightButton}/>

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
        const {
            isLoading,
            isDeleteLoading,
            isGetCeoReportLoading,
            isReplyDeleteLoading,
            isGetNewsEventLoading,
            isUploadImageLoading
        } = this.props
        const flag = isLoading || isDeleteLoading || isGetCeoReportLoading || isReplyDeleteLoading || isGetNewsEventLoading || isUploadImageLoading

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
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                        )}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{height: HEADER_MAX_HEIGHT}}/>
                        {this.renderTab()}

                    </ScrollView>

                    {this.HeaderView()}
                    {this.renderTab2()}

                    {this.ButtonView()}
                    {this.BottomSheet()}
                    {deleteModal && this.DeleteModal()}

                    {this.ArrwoButtonView()}

                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        onesignal_id: state.userstatus.onesignal_id,
        deviceid: state.userstatus.deviceid,
        seller_id: state.session.seller_id,
        seller_uid: state.session.seller_uid,
        token: state.session.token,
        location: state.userstatus.location,
        isLoading: state.shop.isLoading,
        shop_data: state.shop.shop_data,
        isGetNewsEventLoading: state.newsevent.isLoading,
        news_event_list: state.newsevent.news_event_list,
        isDeleteLoading: state.newsevent.isDeleteLoading,
        ceo_report_list: state.ceoreport.ceo_report_list,
        isGetCeoReportLoading: state.ceoreport.isLoading,
        isReplyDeleteLoading: state.ceoreport.isReplyDeleteLoading,
        isReadNotification: state.notification.isReadNotification,
        isUpdateBusinessLoading: state.shop.isUpdateBusinessLoading,
        isUpdateVerificationLoading: state.shop.isUpdateVerificationLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetShopInfo: (data) => dispatch(GetShopInfoAction(data)),
        GetNewsEvent: (data) => dispatch(GetNewsEventAction(data)),
        DeleteNewsEvent: (data) => dispatch(DeleteNewsEventAction(data)),
        GetCeoReportInfo: (data) => dispatch(GetCeoReportInfoAction(data)),
        DeleteReplyByCeo: (data) => dispatch(DeleteReplyByCeoAction(data)),
        UploadMarkImage: (data) => dispatch(UploadMarkImageAction(data)),
        RegisterCeoOneSignalId: (data) => dispatch(RegisterCeoOneSignalIdAction(data)),
        SetIsReadCeoNotification: (data) => dispatch(SetIsReadCeoNotificationAction(data)),
        setUserStatus: (data) => dispatch(SetUserStatusAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CeoShopManagerScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.minigrey,
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
    title: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18,
    },
    fill: {
        flex: 1,
    },
    upArrowWrapper: {
        position: "absolute",
        bottom: 30,
        right: 10,
    },
    upArrow: {
        height: 50,
        width: 50,
        resizeMode: "contain",
    }
});
