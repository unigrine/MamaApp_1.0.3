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
    FlatList
} from "react-native";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {connect} from "react-redux";
import {
    GetFavoriteNewsEventsAction,
    UpdateFavoriteNewsEventsFavoriteAction,
    UpdateNewsEventsFavoriteAction
} from "../../store/Home/action";
import {SetFavoriteAction, DeleteFavoriteAction} from "../../store/Favorite/action";
import {CommonStyle} from "../../constants/style";
import {GetBusinessCategoryAction} from "../../store/Shop/action";
import {SetCurrentScreenAction} from "../../store/Config/action";
import {isEmptyCheck} from "../../utils/regex";
import NewsEventCard from "../../component/NewsEventCard";
import Toast from "react-native-simple-toast";
import {ActivityIndicator} from "react-native-paper";

const DEVICE_WIDTH = Dimensions.get('window').width;

class FavoriteShopScreen extends React.Component {
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
            favorite: true, // 관심가게만 표출

            listHeaderHeight: 0,
            listContentHeight: 0,
            isShowScrollToTop: false,
            newsevent_page: 1,
            news_events: [],
            isMoreLoading: false,
            isRefreshing: false,

            favoriteSelectedId: 0
        };

        this.scrollToTopHandler = this.scrollToTopHandler.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onPressFavorite = this.onPressFavorite.bind(this);
        this.renderHeaderContent = this.renderHeaderContent.bind(this);
        this.renderEmptyContent = this.renderEmptyContent.bind(this);

        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        const {businessCategory} = this.props
        if ((businessCategory == null || businessCategory == undefined))
            this.props.GetBusinessCategory()
        else
            this.initLargeCateogry()

        // this.props.SetCurrentScreen("MainScreen")
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('enter favorite componentDidUpdate');
        const {
            businessCategory,
            // isReportLoading,
            // isSearchLoading,
            isFavoriteLoading,
            token
        } = this.props

        // if (prevProps.isSearchLoading != isSearchLoading && isSearchLoading == false) {
        //
        // }
        //

        if (prevProps.isFavoriteLoading !== isFavoriteLoading && !isFavoriteLoading) {
            // this.onPressSearch(false);
        }

        const { news_events } = this.props;

        // if (isEmptyCheck(news_events) && !isEmptyCheck(all_news_events)) {
        //     this.loadNewsEvents();
        // }


        if (prevProps.news_events !== news_events) {
            this.loadNewsEvents();
        }

        // if (prevProps.isReportLoading != isReportLoading && isReportLoading == false) {
        //   this.onPressSearch()
        // }

        if (prevProps.businessCategory != businessCategory) {
            this.initLargeCateogry()
        }

        if (prevProps.currentscreen !== 'FavoriteShopScreen' && this.props.currentscreen === 'FavoriteShopScreen') {
            this.onPressSearch();
        }

    }

    onScroll(e) {
        // console.log('enter onScroll');
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

    initLargeCateogry() {
        const {businessCategory} = this.props
        let categories = []

        //전체항목 한개 먼저 추가
        let oneCategory = {
            id: -1,
            icon: theme.ic_category0,
            name: "전체",
            checked: true,
        }
        categories.push(oneCategory);

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

    onPressSearch = (isResetPage = true) => {
        if (this.props.isSearchLoading) {
            return;
        }

        const {deviceid, location} = this.props
        const {searchRadius, keywords, large_category_id, first_type, favorite} = this.state

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
            "favorite": favorite,    // false: 비관심, true: 관심가게
        }

        const sendData = {
            data,
            screen: 'Favorite'
        }

        this.props.GetFavoriteNewsEvents(sendData);
        if (isResetPage) {
            this.setState({newsevent_page: 1});
        }
    }

    onPressAll() {
        this.setState(
            {tabselect: 1, first_type: -1},
            () => this.onPressSearch()
        )
    }

    onPressNews() {
        this.setState(
            {tabselect: 2, first_type: 1},
            () => this.onPressSearch()
        )
    }

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
        const {deviceid} = this.props

        const data = {
            uuid: deviceid,
            shop_id: shopInfo?.shop_id,
            screen: 'FAVORITE',
            action: 'DELETED'
        }

        this.props.DeleteFavorite(data)
        this.props.UpdateFavoriteNewsEventsFavorite(data);
        this.props.UpdateNewsEventFavorite({
            ...data,
            screen: ''
        });

        this.props.setFavoriteShop(data.action, shopInfo)  // 앨러트 출력(MainScreen에서)
    }

    renderCategoryItem(item) {
        return (
            <View key={item.key} style={{marginTop: 10, alignItems: "center", paddingHorizontal: 10}}>
                <TouchableOpacity
                    style={[styles.circleWrapper, {backgroundColor: item.checked == true ? theme.primary : theme.grey0}]}
                    onPress={() => this.onPressItem(item)}>
                    <Image
                        source={item.icon}
                        style={[{width: 18, resizeMode: "contain"}, item.name == "전체" ? {width: 23} : {width: 15}]}
                    />
                </TouchableOpacity>
                <Text
                    style={[styles.categoryname, {color: item.checked == true ? theme.black : theme.grey0}]}>{item.name}</Text>
            </View>
        )
    }

    ListHeaderComponent() {
        const {isMapShow, distanceVal, searchRadiusText, keywords} = this.state
        // const { location } = this.props

        // const P0 = {latitude: location.latitude, longitude: location.longitude}
        return (
            <View style={[styles.container]}>
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
                        <View style={{flex:1, alignItems: "center"}}>
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
        const {isMapShow, distanceVal, tabselect, categories, showCategory} = this.state
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
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} nestedScrollEnabled={true}
                            style={styles.categoryLayout}>
                    {categories?.map((item, key) => {
                        item.key = key
                        return this.renderCategoryItem(item)
                    })}
                </ScrollView>
                }

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
        this.props.navigation.navigate("ShopScreen", {shop_id: newsevent?.shop_id});
    }

    TitleComponent(shopInfo) {
        let distance = parseFloat(shopInfo?.distance)
        if (distance >= 1)
            distance = Number(distance.toFixed(2)) + " km"
        else
            distance = Math.round(distance * 1000) + " m"

        return (
            <TouchableOpacity style={styles.header} onPress={() => this.onPressOneNewsEvent(shopInfo)}>
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
                    <TouchableOpacity style={{flex: 1, alignItems: 'center'}} onPress={() => this.onPressFavorite(shopInfo)}>
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
            </TouchableOpacity>
        )
    }

    renderItemContent(item) {
        const { token } = this.props;

        return (
            <View key={item.newsId}>
                {this.TitleComponent(item)}
                <View style={{marginTop: -10}}>
                    <NewsEventCard
                        navigation={this.props.navigation}
                        newseventitem={item}
                        token={token}
                        screen="FAVORITE"
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
                    {language.NO_FAVORITE_NEWSEVENT}
                </Text>
            </View>
        );
    }

    renderHeaderContent() {
        return (
            <View onLayout={ (e) => this.setState({ listHeaderHeight: e.nativeEvent.layout.height }) }>
                {this.ListHeaderComponent()}
                {this.ListHeaderComponent1()}
            </View>
        );
    }

    render() {
        const {isMoreLoading, isShowScrollToTop, news_events} = this.state

        return (
            <View style={styles.container}>
                <FlatList
                    onLayout={ (e) => this.setState({ listContentHeight: e.nativeEvent.layout.height }) }
                    onScroll={this.onScroll}
                    // contentContainerStyle={{ flexGrow: 1 }}
                    data={news_events}
                    renderItem={({item}) => this.renderItemContent(item)}
                    keyExtractor={(item, index) => String(item.newsId)}
                    ListHeaderComponent={this.renderHeaderContent}
                    ListEmptyComponent={this.renderEmptyContent}
                    ref={(ref) => { this.scrollRef = ref; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onPressSearch()}
                        />
                    }
                    removeClippedSubviews={true}
                    // maxToRenderPerBatch={1000}
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

    renderPrev() {
        const {isShowScrollToTop, news_events} = this.state

        return (
            <View>
                <ScrollView
                    onLayout={ (e) => this.setState({ listContentHeight: e.nativeEvent.layout.height }) }
                    style={styles.container}
                    // contentContainerStyle={styles.container}
                    onScroll={this.onScroll}
                    ref={(ref) => { this.scrollRef = ref; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onPressSearch()}
                        />
                    }
                >
                    {this.renderHeaderContent()}
                    {
                        news_events.length > 0 ?
                            news_events.map((item) => this.renderItemContent(item)) :
                            this.renderEmptyContent()
                    }
                </ScrollView>
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
}

const mapStateToProps = (state) => {
    return {
        deviceid: state.userstatus.deviceid,
        location: state.userstatus.location,
        news_events: state.home.news_events_fav,
        businessCategory: state.shop.businessCategory,
        isSearchLoading: state.home.isSearchLoading,
        isFavoriteLoading: state.favorite.isLoading,
        isReportLoading: state.newsevent.isReportLoading,
        token: state.customer.token,
        currentscreen: state.userstatus.currentscreen,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetFavoriteNewsEvents: (data) => dispatch(GetFavoriteNewsEventsAction(data)),
        SetFavorite: (data) => dispatch(SetFavoriteAction(data)),
        DeleteFavorite: (data) => dispatch(DeleteFavoriteAction(data)),
        GetBusinessCategory: () => dispatch(GetBusinessCategoryAction()),
        SetCurrentScreen: (data) => dispatch(SetCurrentScreenAction(data)),
        UpdateNewsEventFavorite: (data) => dispatch(UpdateNewsEventsFavoriteAction(data)),
        UpdateFavoriteNewsEventsFavorite: (data) => dispatch(UpdateFavoriteNewsEventsFavoriteAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteShopScreen);

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
        maxWidth: DEVICE_WIDTH / 3,
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
    },
    remarkwrapper1: {
        paddingRight: 5,
        borderRightWidth: 0.5,
        borderRightColor: theme.grey1
    },
});
