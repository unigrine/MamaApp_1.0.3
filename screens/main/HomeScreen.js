// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React, {version} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Dimensions,
    RefreshControl,
    FlatList,
    AppState
} from "react-native";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {connect} from "react-redux";
import RangeSlider from 'react-native-smooth-slider';
import NaverMapView, {Circle, Marker, Path, Polyline, Polygon} from "react-native-nmap";
import {
    GetNewsEventsAction,
    SetIsLoadingNewsEventsAction, UpdateFavoriteNewsEventsFavoriteAction,
    UpdateNewsEventsFavoriteAction
} from "../../store/Home/action";
import {SetFavoriteAction, DeleteFavoriteAction} from "../../store/Favorite/action";
import {CommonStyle} from "../../constants/style";
import {GetBusinessCategoryAction} from "../../store/Shop/action";
import {
    SetClickAreaAction,
    SetCurrentScreenAction,
    SetEnterHomeAction,
    SetMyLocationAction, setTabScrollLockAction
} from "../../store/Config/action";
import {isEmptyCheck} from "../../utils/regex";
import NewsEventCard from "../../component/NewsEventCard";
import Toast from "react-native-simple-toast";
import {ActivityIndicator} from "react-native-paper";
import {requestLocation} from "../../utils/location";

const DEVICE_WIDTH = Dimensions.get('window').width;

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            selectSubCategory: "",
            isMapShow: false,
            distanceVal: 200,
            searchRadius: 1000,
            searchRadiusText: "1km",
            categories: [],
            showCategory: true,
            keywords: "",
            large_category_id: -1,  // -1: 전체, 1 ~ 13, 음식점 ~ 영화공연
            first_type: -1,         // -1: 새소식/이벤트 전체, 1: 새소식, 2: 이벤트,
            tabselect: 1,

            listHeaderHeight: 0,
            listContentHeight: 0,
            isShowScrollToTop: false,
            newsevent_page: 1,
            news_events: [],
            isMoreLoading: false,
            isRefreshing: false,

            appState: AppState.currentState,

            initLocation: {}
        };

        this.scrollToTopHandler = this.scrollToTopHandler.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onPressFavorite = this.onPressFavorite.bind(this);
        this.onPressThumb = this.onPressThumb.bind(this);
        this.onPressOutThumb = this.onPressOutThumb.bind(this);
        this.renderHeaderContent = this.renderHeaderContent.bind(this);
        this.renderEmptyContent = this.renderEmptyContent.bind(this);

        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.currentscreen === 'Onboard') {
            this.props.SetEnterHome(true);
            this.loadNewsEvents();
            this.setState({ initLocation: this.props.location });
        }
        else {
            this.onPressSearch();
        }

        const {businessCategory} = this.props
        if ((businessCategory == null || businessCategory == undefined))
            this.props.GetBusinessCategory()
        else
            this.initLargeCateogry()

        this.props.SetCurrentScreen("MainScreen")

        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('enter home componentDidUpdate');
        const {
            businessCategory,
            location,
            token,
            news_events,
        } = this.props

        if (prevProps.news_events !== news_events) {
            this.loadNewsEvents();
        }

        if (prevProps.businessCategory != businessCategory) {
            this.initLargeCateogry()
        }

        if (this.state.initLocation?.simple_address_name !== location?.simple_address_name
            && !isEmptyCheck(this.state.initLocation)
            && this.state.initLocation?.simple_address_name != undefined
        ) {
            this.setState({ initLocation: {} });
            this.onPressSearch();
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = nextAppState => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            if (this.props.currentscreen === 'MainScreen') {
                requestLocation(async (data) => {
                    this.props.SetMyLocation(data);
                    this.onPressSearch();
                });
            }
        }
        this.setState({ appState: nextAppState });
    };

    onScroll(e) {
        const deviceHeight = e?.nativeEvent?.layoutMeasurement?.height;
        const scrollPosition = e?.nativeEvent?.contentOffset?.y;
        const scrollViewHeight = e?.nativeEvent?.contentSize?.height;

        if (scrollPosition > 300) {
            if (deviceHeight + scrollPosition + 1 > scrollViewHeight) {
                this.setState({ isShowScrollToTop: true }, () => this.loadMoreNewsEvents());
            }
            else {
                this.setState({ isShowScrollToTop: true });
            }
        }
        else {
            this.setState({ isShowScrollToTop: false });
        }
    }

    scrollToTopHandler() {
        this.scrollRef.getScrollResponder().scrollTo({ y: 0, animated: true })
    };

    // 업종 카테고리 - 초기화(icon, name 매칭)
    initLargeCateogry() {
        const {businessCategory} = this.props
        let categories = []

        // 전체항목 한개 먼저 추가
        let oneCategory = {
            id: -1,
            icon: theme.ic_category0,
            name: "전체",
            checked: true,
        }
        categories.push(oneCategory)

        let tempBusinessCategory = businessCategory.sort((prev, curr) => {
            return prev.order - curr.order;
        });

        tempBusinessCategory?.map((item) => {
            let icon = theme.ic_category0
            if (item.id == 1) icon = theme.ic_category1
            else if (item.id == 2) icon = theme.ic_category2
            else if (item.id == 3) icon = theme.ic_category3
            else if (item.id == 4) icon = theme.ic_game_nor
            else if (item.id == 5) icon = theme.ic_category5
            else if (item.id == 6) icon = theme.ic_category8
            else if (item.id == 7) icon = theme.ic_category12
            else if (item.id == 8) icon = theme.ic_category13
            else if (item.id == 9) icon = theme.ic_category9
            else if (item.id == 10) icon = theme.ic_category10

            oneCategory = {
                id: item.id,
                icon: icon,
                name: item.name,
                checked: false,
            }
            categories.push(oneCategory)
        })

        this.setState({categories})
    }

    // 검색하기
    onPressSearch = (isResetPage = true) => {
        if (this.props.isSearchLoading) {
            return;
        }

        const {deviceid, location} = this.props
        const {searchRadius, keywords, large_category_id, first_type} = this.state

        const latitude = !location ? null : parseFloat(location?.latitude)
        const longitude = !location ? null : parseFloat(location?.longitude)

        const data = {
            "uuid": deviceid,
            "region_name": location?.region_name,
            "latitude": latitude,
            "longitude": longitude,
            "large_category_id": large_category_id,  // -1: 전체, 1 ~ 13, 음식점 ~ 영화공연
            "first_type": first_type, //새소식/이벤트 전체, 1: 새소식, 2: 이벤트,
            "address1": "",
            "road_name": "",
            "building_name": "",
            "distance": searchRadius / 1000, // km
            "shop_name": "",
            "keywords": keywords,
            "favorite": false,    // false: 비관심/관심 모두, true: 관심가게만
        }

        const sendData = {
            data,
            screen: 'Home'
        }

        this.props.GetNewsEvents(sendData);
        if (isResetPage) {
            this.setState({newsevent_page: 1});
        }
    }

    // '전체' 탭 클릭
    onPressAll() {
        this.setState(
            {tabselect: 1, first_type: -1},
            () => this.onPressSearch()
        )
    }

    // '새소식' 탭 클릭
    onPressNews() {
        this.setState(
            {tabselect: 2, first_type: 1},
            () => this.onPressSearch()
        )
    }

    // '이벤트' 탭 클릭
    onPressEvent() {
        this.setState(
            {tabselect: 3, first_type: 2},
            () => this.onPressSearch()
        )
    }

    onPressItem(item) {
        let large_category_id = -1
        const {categories} = this.state
        let newCategories = []
        categories.map(p => {
            let newItem = {
                ...p,
                checked: false
            }
            if (p.id == item.id) {
                newItem = {
                    ...p,
                    checked: true
                }
                large_category_id = item.id // 검색 카테고리에 이용
            }
            newCategories.push(newItem)
        })

        this.setState({categories: newCategories, large_category_id},
            () => this.onPressSearch()
        )
    }

    onPressFavorite(shopInfo) {
        const {deviceid} = this.props;

        let data = {
            uuid: deviceid,
            shop_id: shopInfo?.shop_id
        }

        if (shopInfo?.favoriteCnt > 0 || typeof shopInfo?.favoriteCnt === 'undefined') { // 관심가게 셋팅 {
            data = {
                ...data,
                action: 'DELETED'
            };

            this.props.DeleteFavorite(data);
        } else {
            data = {
                ...data,
                action: 'ADDED'
            };

            this.props.SetFavorite(data);
        }

        this.props.UpdateNewsEventFavorite(data);
        this.props.UpdateFavoriteNewsEventsFavorite(data);
        this.props.setFavoriteShop(data.action, shopInfo);  // 앨러트 출력(MainScreen에서)
    }

    onPressThumb (value) {
        clearTimeout(this.sliderTimeoutId)
        this.sliderTimeoutId = setTimeout(() => {
            if (this.state.distanceVal !== value) {
                let searchRadius = 50;

                if (value <= 100) {
                    searchRadius = 50 + Math.round(value / 2)
                    searchRadius = searchRadius - searchRadius%10
                }
                else if (value <= 200) {
                    value = 100 + (value-100) * 9 // 100 + 100 * 9 == 1000 m
                    searchRadius = Math.round(value)
                    searchRadius = searchRadius - searchRadius%100
                }
                else if (value <= 300) {
                    value = 1000 + (value-200) * 10 // 1000 + 100 * 10 == 1000 m
                    searchRadius = Math.round(value)
                    searchRadius = searchRadius - searchRadius%100
                }

                let searchRadiusText = ""
                if ( searchRadius < 1000 )
                    searchRadiusText = searchRadius + "m"
                else
                    searchRadiusText = searchRadius/1000 + "km"

                this.setState(
                    {
                        distanceVal: value,
                        searchRadius,
                        searchRadiusText
                    },
                    () => {
                        this.onPressSearch();
                    }
                )
            }
        }, 100)
    }

    onPressOutThumb (value) {
        let searchRadius = 50;

        if (value <= 100) {
            searchRadius = 50 + Math.round(value / 2)
            searchRadius = searchRadius - searchRadius%10
        }
        else if (value <= 200) {
            value = 100 + (value-100) * 9 // 100 + 100 * 9 == 1000 m
            searchRadius = Math.round(value)
            searchRadius = searchRadius - searchRadius%100
        }
        else if (value <= 300) {
            value = 1000 + (value-200) * 10 // 1000 + 100 * 10 == 1000 m
            searchRadius = Math.round(value)
            searchRadius = searchRadius - searchRadius%100
        }

        let searchRadiusText = ""
        if ( searchRadius < 1000 )
            searchRadiusText = searchRadius + "m"
        else
            searchRadiusText = searchRadius/1000 + "km"

        this.setState(
            {
                isRootScrollEnabled: true,
                searchRadius,
                searchRadiusText
            },
            () => {
                this.onPressSearch();
            }
        )
    }

    renderThumb() {
        return (
            <View>
                <Image source={theme.btn_slider_nor}
                       style={{
                           width: 30,
                           height: 30,
                           shadowColor: theme.black,
                           shadowOffset: {width: 0, height: 1},
                           shadowOpacity: 0.5,
                           shadowRadius: 1,
                       }}
                >
                </Image>
            </View>
        )
    }

    renderRail() {
        return (
            <View
                style={{
                    flex: 1,
                    // height: 20,
                    backgroundColor: theme.grey0,
                    borderRadius: 10,
                    height: 6
                }}>
            </View>
        )
    }

    renderRailSelected() {
        return (
            <View style={{
                flex: 1,
                // height: 20,
                backgroundColor: theme.primarySlider,
                borderRadius: 10,
                height: 6
            }}>
            </View>
        )
    }

    renderCategoryItem(item) {
        return (
            <View key={item.key} style={{marginTop: 10, alignItems: "center", paddingHorizontal: 10}}>
                <TouchableOpacity
                    style={[styles.circleWrapper, {backgroundColor: item.checked == true ? theme.primary : theme.grey0}]}
                    onPress={() => this.onPressItem(item)}>
                    <Image
                        source={item.icon}
                        style={[{resizeMode: "contain"}, item.name == "전체" ? {width: 23} : {width: 15}]}
                    />
                </TouchableOpacity>
                <Text
                    style={[styles.categoryname, {color: item.checked == true ? theme.black : theme.grey0}]}>{item.name}</Text>
            </View>
        )
    }

    renderHeaderContent() {
        return (
            <View onLayout={ (e) => this.setState({ listHeaderHeight: e.nativeEvent.layout.height }) }>
                {this.ListHeaderComponent()}
                {this.ListHeaderComponent1()}
            </View>
        );
    }

    // header - 주소, nkm이내, 지역 설정
    ListHeaderComponent() {
        const {isMapShow, distanceVal, searchRadiusText, keywords} = this.state
        const {location} = this.props

        const P0 = {latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude)}

        return (
            <View style={[styles.container]}>
                {isMapShow &&
                 <View style={styles.mapWrapper}>
                    <NaverMapView style={{width: '100%', height: '100%'}}
                      showsMyLocationButton={true}
                      center={{...P0, zoom: 16}}
                    >
                    </NaverMapView>
                  </View>
                }

                <View style={styles.layoutWrapper}>
                    <Text style={[styles.address]} numberOfLines={1}>
                        {location?.simple_address_name}
                    </Text>

                    <Text style={styles.inKilometer} numberOfLines={1}>
                        {searchRadiusText}이내
                    </Text>
                    <View style={{flex: 1}}/>

                    <TouchableOpacity style={[styles.mapset, {marginRight: 5}]}
                                      onPress={() => {
                                          this.props.SetClickArea(true);
                                          this.props.navigation.navigate('MainArea')
                                      }}>
                        <Text style={styles.locationset}>{language.MAIN_LOCATION_SET}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mapset} onPress={()=> this.onPressMapSet()}>
                      <Text style={styles.locationset}>{isMapShow ? language.MAIN_MAP_HIDE : language.MAIN_MAP_SHOW}</Text>
                    </TouchableOpacity>

                </View>

                {/* 거리 설정 */}
                <View style={{paddingHorizontal: 20}}>
                    <View style={{paddingHorizontal: 15}}>
                        <RangeSlider
                            style={{width: '100%', height: 25, marginTop: 8}}
                            minimumValue={1}
                            maximumValue={300}
                            step={1}
                            value={distanceVal}
                            useNativeDriver={true}
                            minimumTrackTintColor={theme.primarySlider}
                            maximumTrackTintColor={theme.grey0}
                            thumbImage={theme.btn_slider_nor}
                            thumbStyle={{
                                width: 30,
                                height: 30,
                                borderRadius: 30,
                                backgroundColor: theme.white
                            }}
                            // onValueChange={value => this.onPressThumb(value)}
                            onSlidingComplete={this.onPressOutThumb}
                        />
                    </View>


                    <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 5}}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.viewUnit}/>
                            <Text style={styles.textUnit}>50m</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.viewUnit}/>
                            <Text style={styles.textUnit}>100m</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.viewUnit}/>
                            <Text style={styles.textUnit}>1km</Text>
                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.viewUnit}/>
                            <Text style={styles.textUnit}>2km</Text>
                        </View>
                    </View>
                </View>

                {/* 검색창 */}
                <View style={{paddingHorizontal: 10}}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity
                            onPress={() => this.onPressSearch()}
                        >
                            <Image
                                source={theme.ic_search_nor}
                                style={{height: 20, width: 20, resizeMode: "contain"}}
                            />
                        </TouchableOpacity>
                        <View style={{flex: 1, alignItems: "center"}}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder={language.MAIN_SEARCH_KEYWORD_HINT}
                                placeholderTextColor={theme.grey1}
                                value={keywords}
                                maxLength={20}
                                onChangeText={(keywords) => this.setState({keywords})}
                                onSubmitEditing={() => this.onPressSearch()}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    ListHeaderComponent1() {
        const {distanceVal, tabselect, categories, showCategory} = this.state
        return (
            <View style={styles.container}>
                <View style={[CommonStyle.row_sb, styles.businessCategory]}>
                    <Text style={styles.textCategory}>{language.MAIN_SUB_CATEGORY}</Text>
                    <TouchableOpacity style={styles.dropdownArrow}
                                      onPress={() => this.setState({showCategory: !showCategory})}>
                        {!showCategory ?
                            <Image
                                source={theme.ic_selectdown_nor}
                                style={{height: 12, width: 12, resizeMode: "contain"}}
                            />
                            :
                            <Image
                                source={theme.ic_selectup_nor}
                                style={{height: 12, width: 12, resizeMode: "contain"}}
                            />
                        }
                    </TouchableOpacity>
                </View>

                {showCategory &&
                <ScrollView horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            style={styles.categoryLayout}>
                    {categories?.map((item, key) => {
                        item.key = key
                        return this.renderCategoryItem(item)
                    })}
                </ScrollView>
                }

                {/* 탭 - 전체, 새소식, 이벤트 */}
                <View style={styles.tabWrapper}>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <View style={tabselect == 1 ? styles.focustab : null}>
                            <TouchableOpacity onPress={() => this.onPressAll()}>
                                <Text
                                    style={[styles.texthome, tabselect == 1 ? styles.focusText : null]}>{language.MAIN_ALL}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <View style={tabselect == 2 ? styles.focustab : null}>
                            <TouchableOpacity onPress={() => this.onPressNews()}>
                                <Text
                                    style={[styles.texthome, tabselect == 2 ? styles.focusText : null]}>{language.MAIN_NEWS}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: "center"}}>
                        <View style={tabselect == 3 ? styles.focustab : null}>
                            <TouchableOpacity onPress={() => this.onPressEvent()}>
                                <Text
                                    style={[styles.texthome, tabselect == 3 ? styles.focusText : null]}>{language.MAIN_EVENT}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        position: "absolute",
                        top: 10,
                        left: '33.3%',
                        height: 20,
                        borderRightColor: theme.grey1,
                        borderRightWidth: 0.5
                    }}/>
                    <View style={{
                        position: "absolute",
                        top: 10,
                        left: '66.6%',
                        height: 20,
                        borderRightColor: theme.grey1,
                        borderRightWidth: 0.5
                    }}/>
                </View>

            </View>
        )
    }

    loadMoreNewsEvents() {
        this.setState(
            {
                newsevent_page: this.state.newsevent_page + 1,
                isMoreLoading: true
            },
            () => this.loadNewsEvents()
        );
    }

    loadNewsEvents() {
        const { newsevent_page } = this.state;
        const { news_events } = this.props;

        if (isEmptyCheck(news_events)) {
            this.setState({ news_events: [] });
            return;
        }

        if ((news_events.length === this.state.news_events.length) && newsevent_page > 1) {
            Toast.show('마지막 입니다.');
            this.setState({
                isMoreLoading: false
            });
        }

        // let start = new Date().getTime();
        let temp_news_events = news_events.slice(0, newsevent_page * 20);

        this.setState({ news_events: temp_news_events });
        setTimeout(() => {
            // this.props.SetIsLoadingNewsEvents(false);
            this.setState({
                isMoreLoading: false
            });
        }, 900)
    }

    onPressOneNewsEvent(newsevent) {
        this.props.navigation.navigate("ShopScreen", {shop_id: newsevent?.shop_id, cnt: newsevent?.shop_name.length});
    }

    onPressMapSet () {
        const { isMapShow } = this.state

        if( !isMapShow )
            this.lockTabScroll()
        else
            this.unLockTabScroll()

        this.setState({isMapShow: !isMapShow})
    }

    onTouch (e) {
        this.lockTabScroll()
    }

    lockTabScroll() {
        if( !this.props.tabScrollLock )
            this.props.setTabScrollLock(true)
    }

    unLockTabScroll() {
        if( this.props.tabScrollLock )
            this.props.setTabScrollLock(false)
    }

    TitleComponent(shopInfo) {
        let distance = parseFloat(shopInfo?.distance)
        if (distance >= 1)
            distance = Number(distance.toFixed(2)) + " km"
        else
            distance = Math.round(distance * 1000) + " m"

        return (
            <View style={styles.header}>
                <View style={[CommonStyle.row_sb, {paddingHorizontal: 16}]}>
                    <TouchableOpacity
                        style={{flex: 6, flexDirection: "row", flexWrap: 'wrap'}}
                        onPress={() => this.onPressOneNewsEvent(shopInfo)}>
                        <Text style={CommonStyle.shopHeaderText} numberOfLines={1}>
                            {shopInfo?.shop_name}
                        </Text>

                        <View style={{/*alignItems: "flex-end", */alignItems: "center", justifyContent: "center"}}>
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
                                <Text style={[styles.remarkwrapper]}>
                                    {shopInfo?.average_mark ?
                                        Number(shopInfo?.average_mark).toFixed(1) :
                                        Number(0).toFixed(1)}
                                </Text>
                            </View>
                        </View>
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <Text style={styles.remarkwrapper}>{distance}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* 관심 가게 등록 */}
                    <TouchableOpacity
                        style={{flex: 1, alignItems: 'center'}}
                        onPress={() => this.onPressFavorite(shopInfo)}>
                        {
                            shopInfo?.favoriteCnt > 0 || typeof shopInfo?.favoriteCnt === 'undefined' ?
                                <>
                                    <Image
                                        source={theme.favorite_nor}
                                        style={{height: 18, width: 18, resizeMode: "contain"}}
                                    />
                                    <Text style={{
                                        fontSize: theme.font10,
                                        color: theme.primary,
                                    }}>
                                        관심가게
                                    </Text>
                                </>
                                :
                                <>
                                    <Image
                                        source={theme.favorite_dis}
                                        style={{height: 18, width: 18, resizeMode: "contain"}}
                                    />
                                    <Text style={{
                                        fontSize: theme.font10,
                                        color: theme.grey1,
                                    }}>
                                        관심가게
                                    </Text>
                                </>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderItemContent(item) {
        const { token } = this.props;

        return (
            <View key={item?.newsId}>
                {this.TitleComponent(item)}
                <View style={{marginTop: -10}}>
                    <NewsEventCard
                        navigation={this.props.navigation}
                        newseventitem={item}
                        token={token}
                        screen="HOME"
                    />
                </View>
            </View>
        )
    }

    renderEmptyContent() {
        const { listHeaderHeight, listContentHeight } = this.state;

        const emptyHeight = listContentHeight - listHeaderHeight;

        return (
            <View style={{
                // flex:1,
                // flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: emptyHeight > 0 ? emptyHeight : 0
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

    render() {
        const {isMoreLoading, isShowScrollToTop, news_events} = this.state

        return (
            <View style={styles.container}>
                <FlatList
                    // onLayout={ (e) => this.setState({ listContentHeight: e.nativeEvent.layout.height }) }
                    onScroll={this.onScroll}
                    // contentContainerStyle={{ flexGrow: 1 }}
                    data={news_events}
                    // extraData={this.props}
                    renderItem={({item}) => this.renderItemContent(item)}
                    keyExtractor={(item, index) => item.newsId.toString()}
                    ListHeaderComponent={this.renderHeaderContent}
                    // ListEmptyComponent={this.renderEmptyContent}
                    ref={(ref) => { this.scrollRef = ref; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onPressSearch()}
                        />
                    }
                    removeClippedSubviews={true}
                    windowSize={10}
                    maxToRenderPerBatch={20}
                    // updateCellsBatchingPeriod={1000}
                    // initialNumToRender={1000}
                    // keyboardShouldPersistTaps="always"
                    // keyboardDismissMode="on-drag"
                />
                {
                    isMoreLoading &&
                    <ActivityIndicator style={CommonStyle.lazySpinnerStyle} animating={isMoreLoading} size="large" color={theme.primary} />
                }
                {
                    isShowScrollToTop &&
                    <TouchableOpacity
                        style={styles.upArrowWrapper}
                        hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                        onPress={() => this.scrollToTopHandler()}>
                        <Image
                            source={theme.ic_arrowup}
                            style={styles.upArrow}
                        />
                    </TouchableOpacity>
                }
            </View>
        );
    }

    // renderPrev() {
    //     const {isShowScrollToTop, news_events} = this.state
    //
    //     return (
    //         <View>
    //             <ScrollView
    //                 onLayout={ (e) => this.setState({ listContentHeight: e.nativeEvent.layout.height }) }
    //                 style={styles.container}
    //                 // contentContainerStyle={styles.container}
    //                 onScroll={this.onScroll}
    //                 ref={(ref) => { this.scrollRef = ref; }}
    //                 refreshControl={
    //                     <RefreshControl
    //                         refreshing={this.state.isRefreshing}
    //                         onRefresh={() => this.onPressSearch()}
    //                     />
    //                 }
    //             >
    //                 {this.renderHeaderContent()}
    //                 {
    //                     news_events.length > 0 ?
    //                         news_events.map((item) => this.renderItemContent(item)) :
    //                         this.renderEmptyContent()
    //                 }
    //             </ScrollView>
    //             {
    //                 isShowScrollToTop &&
    //                 <TouchableOpacity
    //                     style={styles.upArrowWrapper}
    //                     hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
    //                     onPress={() => this.scrollToTopHandler()}>
    //                     <Image
    //                         source={theme.ic_arrowup}
    //                         style={styles.upArrow}
    //                     />
    //                 </TouchableOpacity>
    //             }
    //         </View>
    //     );
    // }
}

const mapStateToProps = (state) => {
    return {
        token: state.customer.token,
        deviceid: state.userstatus.deviceid,
        location: state.userstatus.location,
        news_events: state.home.news_events,
        businessCategory: state.shop.businessCategory,
        isSearchLoading: state.home.isSearchLoading,
        isFavoriteLoading: state.favorite.isLoading,
        // isReportLoading: state.newsevent.isReportLoading,
        isClickArea: state.userstatus.isClickArea,
        isEnterHome: state.userstatus.isEnterHome,
        currentscreen: state.userstatus.currentscreen,
        tabScrollLock: state.userstatus.tabScrollLock
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetNewsEvents: (data) => dispatch(GetNewsEventsAction(data)),
        SetFavorite: (data) => dispatch(SetFavoriteAction(data)),
        DeleteFavorite: (data) => dispatch(DeleteFavoriteAction(data)),
        GetBusinessCategory: () => dispatch(GetBusinessCategoryAction()),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
        SetMyLocation: (data) => dispatch(SetMyLocationAction(data)),
        SetClickArea: (data) => dispatch(SetClickAreaAction(data)),
        SetEnterHome: (data) => dispatch(SetEnterHomeAction(data)),
        UpdateNewsEventFavorite: (data) => dispatch(UpdateNewsEventsFavoriteAction(data)),
        UpdateFavoriteNewsEventsFavorite: (data) => dispatch(UpdateFavoriteNewsEventsFavoriteAction(data)),
        SetIsLoadingNewsEvents: (data) => dispatch(SetIsLoadingNewsEventsAction(data)),
        setTabScrollLock: (data) => dispatch(setTabScrollLockAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.white,
    },
    mapWrapper: {
        height: 200,
        backgroundColor: theme.grey1,
        opacity: 0.5
    },
    layoutWrapper: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
    },
    address: {
        color: theme.black,
        fontSize: theme.fontLarge,
        fontWeight: 'bold',
        maxWidth: DEVICE_WIDTH / 4,
    },
    inKilometer: {
        color: theme.primaryLight,
        fontSize: theme.fontMedium,
        paddingTop: 6,
        paddingLeft: 5,
        width: 80,
    },
    setBtnWrapper: {
        flexDirection: "row",
        alignItems: 'flex-end',
    },
    mapset: {
        backgroundColor: theme.white,
        borderRadius: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 2,
        borderColor: theme.grey1,
        borderWidth: 0.5,
        maxWidth: 90,
    },
    locationset: {
        color: theme.black,
        fontSize: theme.font14,
    },
    thumb: {
        // height: 30,
        // width: 30,
        // resizeMode: "contain"
        backgroundColor: theme.white,
        width: 30,
        height: 30,
        borderRadius: 100,
        shadowColor: theme.black,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    viewUnit: {
        height: 7,
        width: 0,
        borderColor: theme.grey1,
        borderWidth: 0.5
    },
    textUnit: {
        color: theme.grey1,
        fontSize: theme.fontSmall
    },
    inputWrapper: {
        marginTop: 8,
        // backgroundColor: theme.white,
        width: "100%",
        borderRadius: 50,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        borderColor: theme.black,
        borderWidth: 0.5,
        height: 40,
    },
    searchInput: {
        height: 45,
        width: "100%",
        paddingLeft: 10,
        fontSize: theme.fontMedium,
        paddingHorizontal: 4,
        color: theme.black,
    },
    tabWrapper: {
        position: "relative",
        flexDirection: "row",
        justifyContent: 'space-around',
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        borderTopColor: theme.grey1,
        borderTopWidth: 0.5,
        paddingTop: 10,
    },
    categoryLayout: {
        paddingBottom: 10,
        borderTopColor: theme.grey1,
        borderTopWidth: 0.5,
    },
    texthome: {
        paddingBottom: 5,
        fontSize: theme.fontMedium,
        textAlign: "center",
        color: theme.grey1,
        paddingHorizontal: 5,
    },
    focustab: {
        borderBottomColor: theme.primary,
        borderBottomWidth: 2,
        alignItems: "center"
    },
    unfocustab: {
        color: theme.grey1,
    },
    focusText: {
        color: theme.primary
    },
    businessCategory: {
        marginTop: 8,
        borderTopColor: theme.grey1,
        borderTopWidth: 0.5,
        paddingHorizontal: 16
    },
    textCategory: {
        color: theme.black,
        fontSize: theme.font14,
        fontWeight: "bold",
    },
    circleWrapper: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: theme.grey0,
        alignItems: "center",
        justifyContent: "center"
    },
    categoryname: {
        color: theme.grey1,
        fontSize: theme.font14,
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
        opacity: 0.9,
    },
    modalText: {
        textAlign: "center",
        paddingHorizontal: 10,
        fontSize: theme.fontMedium,
        color: theme.white
    },
    dropdownArrow: {
        width: 30,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    upArrowWrapper: {
        flex: 1,
        position: "absolute",
        bottom: 10,
        right: 10,
    },
    upArrow: {
        height: 50,
        width: 50,
        // resizeMode: "contain",
    },
    track:{
        // flex: 1,
        borderRadius: 10,
        height: 6
    },
    header: {
        paddingVertical: 15,
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        marginBottom: 10,
    },
    remarkwrapper: {
        color: theme.black,
        fontSize: theme.fontSmall,
        marginRight: 5,
    },
    remarkwrapper1: {
        // paddingRight: 5,
        borderRightWidth: 0.5,
        borderRightColor: theme.grey1
    },
});
