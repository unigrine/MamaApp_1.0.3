import {SetIsReadCeoNotificationAction} from "../../store/CeoNotification/action";

``// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Image} from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {connect} from "react-redux";
import {CommonStyle} from "../../constants/style";
import MaMaHeader from "../../component/MaMaHeader"
import HomeScreen from "./HomeScreen"
import Icon from 'react-native-vector-icons/EvilIcons'
import FavoriteShopScreen from "./FavoriteShopScreen";
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {SetIsReadMyNotificationAction} from "../../store/MyNotification/action";
import {inspectReadNotificationData} from "../../utils/notification";
import {SetCurrentScreenAction} from "../../store/Config/action";

const initialLayout = {width: Dimensions.get('window').width};
let _this = null;

class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            tabselect: 1,
            isShowAlertFavorite: false,
            showAlertFavoriteType: 'ADDED',
            favoriteShop: "",

            index: 0,
            routes: [
                {key: 'active', title: language.HOME},
                {key: 'inactive', title: language.FAVORITE_SHOP},
            ],

        };

        this.setFavoriteShop = this.setFavoriteShop.bind(this)

        _this = this

        this.renderScene = this.renderScene.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.renderTabBar = this.renderTabBar.bind(this);
    }

    async componentDidMount() {
        this.props.SetIsReadMyNotification(await inspectReadNotificationData('MY'));
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('enter main componentDidUpdate');
        const {isFavoriteLoading, isReadNotification} = this.props
        const {isShowAlertFavorite} = this.state

        if (prevProps.isFavoriteLoading != isFavoriteLoading && isFavoriteLoading == false) {
            if (isShowAlertFavorite == true) {
                setTimeout(() => {
                    this.setState({isShowAlertFavorite: false, favoriteShop: ""})
                }, 2000)
            }
        }
    }

    componentWillUnmount() {
    }

    onPressHomeTab() {
        this.setState({tabselect: 1})
    }

    onPressFavoriteTab() {
        this.setState({tabselect: 2})
    }

    setFavoriteShop(action, shopInfo) {
        this.setState({
            favoriteShop: shopInfo?.shop_name,
            isShowAlertFavorite: true,
            showAlertFavoriteType: action
        });
    }

    ModalFavorite() {
        const {favoriteShop, showAlertFavoriteType} = this.state;

        return (
            <View style={styles.modalContainer}>
                <Text style={styles.modalText}>
                    {showAlertFavoriteType === 'ADDED' ?
                        `${favoriteShop}${language.MAIN_FAVORITE_ADDED}` :
                        `${favoriteShop}${language.MAIN_FAVORITE_DELETED}`
                    }
                    {}{}
                </Text>
            </View>
        )
    }

    renderItem(item) {
        return (
            <View style={{flexDirection: 'row', alignItems: "center", paddingVertical: 15}}>
                <View style={{flex: 10}}>
                    <Text style={[styles.address]} numberOfLines={1}>{item.address}</Text>
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                        <Text style={styles.loadname}>{language.LOAD_NAME}</Text>
                        <Text style={[styles.loadaddr]} numberOfLines={1}>{item.loadaddr}</Text>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity>
                        <Icon name={'close'} size={25} color={theme.black}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    TabComponent() {
        const {tabselect} = this.state

        return (
            <></>
            // <View style={styles.tabWrapper}>
            //
            //     <TouchableOpacity
            //         style={{flex: 1, alignItems: "center"}}
            //         onPress={() => this.onPressHomeTab()}
            //     >
            //         <View style={tabselect == 1 ? styles.focustab : null}>
            //             <Text style={[styles.texthome, tabselect == 1 ? styles.focusText : null]}>{language.HOME}</Text>
            //         </View>
            //     </TouchableOpacity>
            //     <TouchableOpacity
            //         style={{flex: 1, alignItems: "center"}}
            //         onPress={() => this.onPressFavoriteTab()}
            //     >
            //         <View style={tabselect == 2 ? styles.focustab : null}>
            //             <Text style={[styles.texthome, tabselect == 2 ? styles.focusText : null]}>{language.FAVORITE_SHOP}</Text>
            //         </View>
            //     </TouchableOpacity>
            //
            // </View>
        )
    }

    onTabChange(index) {
        switch (index) {
            case 0:
                this.props.SetCurrentScreen('MainScreen');
                break;
            case 1:
                this.props.SetCurrentScreen('FavoriteShopScreen');
                break;
        }

        this.setState({index});
    }

    // Here you can send props to different tab components
    renderScene = SceneMap({
        active: () => (
            <HomeScreen
                type="active"
                navigation={this.props.navigation}
                setFavoriteShop={this.setFavoriteShop}/>
        ),
        inactive: () => (
            <FavoriteShopScreen
                type="inactive"
                navigation={this.props.navigation}
                setFavoriteShop={this.setFavoriteShop}/>
        ),
    })

    //custom tab bar
    renderTabBar = (props) => {
        return (
            <TabBar
                {...props}
                indicatorContainerStyle={{marginLeft: (initialLayout.width / 2 - 100) / 2, alignItems: "center"}}
                indicatorStyle={{
                    backgroundColor: '#F0568D',
                    height: 3,
                    borderRadius: 100,
                    opacity: 0.7,
                    width: 100,
                    alignContent: "center"
                }}
                style={{elevation: 2, backgroundColor: 'white'}}
                labelStyle={styles.texthome}
                inactiveColor={theme.grey1_3}
                activeColor={theme.black}
            />
        )
    }

    renderTab() {
        const {index, routes} = this.state

        let enabled = true
        if( index == 1 )
            enabled = true
        else
            enabled = !this.props.tabScrollLock

        return (
            <TabView
                swipeEnabled={enabled}
                navigationState={{index, routes}}
                renderTabBar={this.renderTabBar}
                onIndexChange={this.onTabChange}
                renderScene={this.renderScene}
                initialLayout={initialLayout}
                // gestureHandlerProps={{
                //     maxPointers: 1,
                //     // waitFor: [someRef]
                // }}
            />
        );
    }

    render() {
        const {tabselect, isShowAlertFavorite} = this.state
        const {isSearchLoading, isFavoriteLoading} = this.props
        const flag = isSearchLoading || isFavoriteLoading

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                {/* 헤더바 - 로고, 내 알림(MyAlertScreen) */}
                <MaMaHeader
                    leftIcon={"angle-left"}
                    notify={!this.props.isReadNotification}
                    navigation={this.props.navigation}
                    rightIcon="ic_alert_w_nor"
                    textColor="black"
                    onPressRightButton={this.onPressRightButton}
                />

                {/* loading bar */}
                {flag &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={flag} size="large"
                                   color={theme.primary}/>
                }

                {/* 탭 - 홈, 관심가게 */}
                {this.renderTab()}

                {/* 관심가게 추가 alert */}
                {isShowAlertFavorite && this.ModalFavorite()}
            </View>
        );
    }

    onPressRightButton = () => {
        this.props.navigation.navigate('MyAlertScreen', {});
    }
}

const mapStateToProps = (state) => {
    return {
        deviceid: state.userstatus.deviceid,
        isSearchLoading: state.home.isSearchLoading,
        isFavoriteLoading: state.favorite.isLoading,
        isReadNotification: state.mynotification.isReadNotification,
        tabScrollLock: state.userstatus.tabScrollLock
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        SetIsReadMyNotification: (data) => dispatch(SetIsReadMyNotificationAction(data)),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },
    tabWrapper: {
        position: "relative",
        flexDirection: "row",
        justifyContent: 'space-around',
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        borderTopColor: theme.grey1,
    },
    texthome: {
        fontSize: theme.font18,
        fontWeight: 'bold',
        textAlign: "center",
    },
    focustab: {
        borderBottomColor: theme.primary,
        borderBottomWidth: 2.5,
        alignItems: "center"
    },
    unfocustab: {
        color: theme.grey1,
    },
    focusText: {
        color: theme.black
    },
    modalContainer: {
        position: 'absolute',
        bottom: 20,
        width: '90%',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#C43B57',
        opacity: 0.95,
    },
    modalText: {
        textAlign: "center",
        paddingHorizontal: 15,
        fontSize: theme.fontMedium,
        color: theme.white
    },
});
