import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from "react-native";
import theme from "../constants/themes/theme";
import {CommonStyle} from "../constants/style";
import NewsEventCard from "./NewsEventCard";
import {isEmptyCheck} from "../utils/regex";
import {ActivityIndicator} from "react-native-paper";
import language from "../constants/language";

class NewsEventList extends React.Component {

    newEventsRef = {};

    constructor(props) {
        super(props);

        this.state = {
            newsevent_page: 1,
            news_events: [],
        }
    }

    componentDidMount() {
        this.loadNewsEvents();
    }

    componentDidUpdate(prevProps, prevState) {
        const { news_events } = this.state;
        const { news_events: all_news_events } = this.props;

        if (isEmptyCheck(news_events) && !isEmptyCheck(all_news_events)) {
            this.loadNewsEvents();
        }

        if (prevProps.news_events !== all_news_events) {
            // console.log('enter newsEventList');
            this.loadNewsEvents();
        }
    }

    loadMoreNewsEvents() {
        this.setState(
            { newsevent_page: this.state.newsevent_page + 1 },
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

        let temp_news_events = news_events.slice(0, newsevent_page * 15);
        // console.log(newsevent_page, temp_news_events.length);

        this.setState({ news_events: temp_news_events });
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
                    <View style={{flex: 6, flexDirection: "row"}}>
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
                    </View>

                    {/* 관심 가게 등록 */}
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.props.onPressFavorite(shopInfo)}>
                        {
                            shopInfo?.favoriteCnt > 0 || typeof shopInfo?.favoriteCnt === 'undefined' ?
                                <Image
                                    source={theme.favorite_nor}
                                    style={{height: 24, width: 24, resizeMode: "contain", alignSelf: 'flex-end'}}
                                />
                                :
                                <Image
                                    source={theme.favorite_dis}
                                    style={{height: 24, width: 24, resizeMode: "contain", alignSelf: 'flex-end'}}
                                />
                        }
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    renderItemContent(item) {
        return (
            <TouchableOpacity key={item.newsId} onPress={() => this.onPressOneNewsEvent(item)}>
                {this.TitleComponent(item)}
                <View style={{marginTop: -10}}>
                    <NewsEventCard
                        navigation={this.props.navigation}
                        newseventitem={item}
                        shop_name={item?.shop_name}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    renderEmptyContent(parentHeight) {
        return (
            <View style={{
                // flex:1,
                // flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: parentHeight > 0 ? parentHeight : 0
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
        const { news_events } = this.state;

        return (
            <FlatList
                // showsVerticalScrollIndicator={true}
                contentContainerStyle={{flexGrow: 1}}
                disableVirtualization={false}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                data={news_events}
                renderItem={({item}) => this.renderItemContent(item)}
                keyExtractor={item => item.newsId.toString()}
                // renderFooter={<ActivityIndicator/>}
                // ListHeaderComponent={}
                // stickyHeaderIndices={[0]}   // header 고정
                // ListFooterComponent={() => (
                //
                // )}
                ListEmptyComponent={this.renderEmptyContent(this.props.parentHeight)}
                onEndReachedThreshold={0}
                onEndReached={() => this.loadMoreNewsEvents()}
                ref={(ref) => {
                    this.newEventsRef = ref;
                }}
            />
        )
    }
}

export default NewsEventList;

const styles = StyleSheet.create({
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
    upArrowWrapper: {
        flex: 1,
        position: "absolute",
        bottom: 10,
        right: 10,
    },
    upArrow: {
        height: 50,
        width: 50,
        resizeMode: "contain",
    }
});
