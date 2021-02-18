import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    ImageBackground,
} from "react-native";
import theme from "../constants/themes/theme";
import language from "../constants/language";
import Comments from "./Comments";
import moment from "moment";
import {CommonStyle} from "../constants/style";
import {getDateFormat} from "../utils/text_format";
import {isEmptyCheck} from "../utils/regex";
import {parseJson} from "../utils/data_handler";
import { TouchableHighlight } from "react-native-gesture-handler";
import SwiperFlatList from 'react-native-swiper-flatlist';
import FastImage from 'react-native-fast-image';

const DEVICE_WIDTH = Dimensions.get('window').width;

class NewsEventCard extends React.Component {
    state = {
        showMore: true,
        showcomment: false,
    }

    renderMenuItem(discount_item) {
        return (
            <View key={discount_item.key} style={styles.menuWrapper}>
                <Text style={styles.menuName}>
                    {discount_item.name}
                </Text>

                <View style={{flex: 1}}>
                    <Text style={[styles.dotdot]} numberOfLines={1}>
                        .............................................................................
                    </Text>
                </View>

                <Text style={styles.menuDiscount}>
                    {discount_item.discount_percentage} %
                </Text>
                <Text style={styles.menuOriginalPrice}>
                    {discount_item.origin_price}원
                </Text>
                <Text style={styles.menuRealPrice}>
                    {discount_item.result_price}원
                </Text>
            </View>
        )
    }

    itemMenu(discount_menu) {
        return (
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                {discount_menu && Array.isArray(discount_menu) &&
                discount_menu?.map((item, key) => {
                    item.key = key
                    return this.renderMenuItem(item)
                })
                }
            </ScrollView>
        )
    }

    onPressShowMore() {
        const {showMore, showcomment} = this.state
        let showcomment1 = showcomment
        if (showMore) showcomment1 = false

        this.setState({showMore: !showMore, showcomment: showcomment1})

    }

    onPressOneNewsEvent(newsevent) {

    }

    onPressShowComment() {
        const {showcomment} = this.state
        this.setState({showcomment: !showcomment})
    }

    onPressImage(newsevent) {
        const { screen } = this.props;

        if ( screen === "SHOP" || isEmptyCheck(newsevent?.shop_id))
            return

        this.props.navigation.navigate("ShopScreen", {shop_id: newsevent?.shop_id});
    }

    onPressReportingToAdmin(newseventitem) {
        const { token } = this.props;

        const params = {
            newseventitem: newseventitem,
            shop_name: newseventitem?.shop_name,
            shop_id: newseventitem?.shop_id
        };

        if (isEmptyCheck(token)) {
            this.props?.navigation.navigate('LoginForReportToAdminScreen', params);
        }
        else {
            this.props?.navigation.navigate('ReportToAdminScreen', params);
        }
    }

    showMore(item) {
        let keywords = parseJson(item?.keywords);
        let discount_menu = parseJson(item?.discount_menu);

        const {showcomment} = this.state
        return (
            <View style={{paddingBottom: 16}}>
                <Text
                    numberOfLines={2}
                    style={{
                        fontSize: theme.font14,
                        color: theme.black,
                    }}
                >
                    {item?.content}
                </Text>
                {keywords?.length > 0 && Array.isArray(keywords) &&
                <View style={{flexDirection: "row", alignItems: "center", paddingVertical: 10, flexWrap: 'wrap'}}>
                    {keywords?.map((keyword, index) => {
                        return <Text key={index} style={CommonStyle.taghint}>#{keyword}</Text>
                    })}
                </View>
                }

                {discount_menu?.length > 0 && Array.isArray(discount_menu) && discount_menu[0]?.name != "" &&
                this.itemMenu(discount_menu)
                }

                <View style={[CommonStyle.row_sb, {paddingTop: 20}]}>
                    <Text
                        style={styles.textRegisterDay}>등록일 {getDateFormat(item?.created_at, 'YYYY-MM-DD')}</Text>
                    <TouchableOpacity
                      style={{paddingLeft: 10, marginHorizontal: 5, marginTop: 5, flexDirection: 'row'}}
                      onPress={()=>this.onPressShowComment()}
                      >
                        <Image
                          source={theme.ic_message_hint}
                          style={{ height: 20, width: 20, resizeMode: "contain" }}
                        />
                        {item?.replyCnt > 0 ?
                          <View>
                            {showcomment && <Text style={[styles.commentshow]}>{language.MAIN_HIDE_COMMENT}</Text> }
                            {!showcomment && <Text style={[styles.commentshow]}>{item?.replyCnt}{language.MAIN_SHOWING_COMMENT}</Text> }
                          </View>
                        :
                          <Text style={[styles.commentshow]}>{language.MAIN_INPUT_COMMENT}</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    imageCardWithTouch(item) {
        let image_urls = parseJson(item?.image_urls);
        let width = DEVICE_WIDTH-32;
        let height = (DEVICE_WIDTH-32)*2/3;

        return (
            <View style={{width:  DEVICE_WIDTH-32, alignSelf: "center" }}
                  activeOpacity={1} onPress={() => this.onPressImage(item) }>
                {image_urls?.length < 1 ?
                    <ImageBackground
                        style={{
                            height: 0,
                            width: "100%",
                        }}
                    >
                    </ImageBackground>
                    :
                    <View style={{flex: 1, backgroundColor: "white", alignSelf: "center", justifyContent: "center" }}>
                        <SwiperFlatList
                            showPagination={image_urls?.length > 1 ? true : false}
                            nestedScrollEnabled
                            paginationDefaultColor={theme.minigrey}
                            paginationActiveColor={'#FF9F9F'}
                            paginationStyleItem={{width: 10, height: 10, borderRadius: 10}}
                        >
                            {Array.isArray(image_urls) && image_urls?.map((source, key) => (
                                <TouchableHighlight key={key} style={{flex: 1}} activeOpacity={1} onPress={() => this.onPressImage(item) } >
                                    <Image style={{width: DEVICE_WIDTH-32, height: (DEVICE_WIDTH-32)*2/3, resizeMode: "stretch"}} source={{uri: source}}/>
                                </TouchableHighlight>
                            ))}
                        </SwiperFlatList>
                    </View>
                }
            </View>
        )
    }

    imageCard(item) {
        let image_urls = parseJson(item?.image_urls);
        let width = DEVICE_WIDTH-32;
        let height = (DEVICE_WIDTH-32)*2/3;

        return (
            <View style={{width:  DEVICE_WIDTH-32, alignSelf: "center" }}>
                {image_urls?.length < 1 ?
                    <ImageBackground
                        style={{
                            height: 0,
                            width: "100%",
                        }}
                    >
                    </ImageBackground>
                    :
                    <View style={{flex: 1, backgroundColor: "white", alignSelf: "center", justifyContent: "center" }}>
                        <SwiperFlatList
                            showPagination={image_urls?.length > 1 ? true : false}
                            nestedScrollEnabled
                            paginationDefaultColor={theme.minigrey}
                            paginationActiveColor={'#FF9F9F'}
                            paginationStyleItem={{width: 10, height: 10, borderRadius: 10}}
                        >
                            {Array.isArray(image_urls) && image_urls?.map((source, key) => (
                                <View key={key} style={{flex: 1}}>
                                    <Image style={{width: DEVICE_WIDTH-32, height: (DEVICE_WIDTH-32)*2/3, resizeMode: "stretch"}} source={{uri: source}}/>
                                </View>
                            ))}
                        </SwiperFlatList>
                    </View>
                }
            </View>
        )
    }

    renderShopCardItem(item) {
        const {showMore, showcomment, deleteModal} = this.state
        const { screen } = this.props


        const width = DEVICE_WIDTH - 32;
        const height = width * 2 / 3;

        return (
            <View key={item?.newsId}
                  style={{paddingTop: 10}}>
                {screen === "ShopScreen" ?
                    this.imageCard(item)
                    :
                    this.imageCardWithTouch(item)
                }

                <View style={{marginVertical: 10, paddingHorizontal: 16, justifyContent: "center"}}>
                    <View style={{flex: 1, flexDirection: "row"}}>
                        <View style={{flex: 1, flexDirection: "row", paddingVertical: 3}}>
                            {
                                item?.first_type == 1 && (
                                    <View
                                        style={[CommonStyle.eventView, {backgroundColor: theme.lightgreen}]}
                                    >
                                        <Text style={CommonStyle.event}>{item.first_type_name}</Text>
                                    </View>
                                )
                            }
                            {
                                item.first_type == 2 && (
                                    <>
                                        <View
                                            style={[CommonStyle.eventView, {backgroundColor: theme.primaryBigDark}]}
                                        >
                                            <Text style={CommonStyle.event}>{item.first_type_name}</Text>
                                        </View>

                                        <View style={CommonStyle.discountLayout}>
                                            <Image
                                                source={theme.ic_more_nor}
                                                style={{height: 20, width: 20, resizeMode: "contain"}}
                                            />
                                            <Text style={[styles.discount]}>{!isEmptyCheck(item?.second_type_name) ? item?.second_type_name : ''}</Text>
                                        </View>
                                    </>
                                )
                            }
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <TouchableOpacity
                                hitSlop={{ top: 15, bottom: 15, left: 20, right: 20 }}
                                onPress={() => this.onPressReportingToAdmin(item)}>
                                <Text
                                    // numberOfLines={1}
                                    style={{
                                        fontSize: theme.fontSmall,
                                        color: theme.grey1,
                                    }}
                                >
                                    {language.REPORTING}
                                </Text>
                            </TouchableOpacity>

                            {/*<Image*/}
                            {/*    source={theme.ic_siren_gray}*/}
                            {/*    style={{height: 13, width: 13, resizeMode: "contain"}}*/}
                            {/*/>*/}
                        </View>
                    </View>


                    <Text style={CommonStyle.newseventHeaderText} numberOfLines={2}>
                        {item?.title}
                    </Text>

                    <View style={{flexDirection: 'row', paddingVertical: 5, justifyContent: "space-between"}}>
                        {item?.first_type == 2 ? // 이벤트인 경우에만 출력
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: theme.fontSmall,
                                    color: theme.grey1,
                                }}
                            >
                                {item?.start_date != "" ? language.MAIN_EVENT_DAY : null} {moment(item.start_date).format("MM월 DD일")} - {moment(item.end_date).format("MM월 DD일")}
                            </Text>
                            :
                            <View/>
                        }

                        {/*{!showMore &&*/}
                        {/*<TouchableOpacity style={{flexDirection: 'row', alignItems: "center"}}*/}
                        {/*                  onPress={() => this.onPressShowMore()}>*/}
                        {/*    <Text*/}
                        {/*        numberOfLines={1}*/}
                        {/*        style={{*/}
                        {/*            fontSize: theme.fontSmall,*/}
                        {/*            color: theme.grey1,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        {language.MAIN_MORE_SHOW}*/}
                        {/*    </Text>*/}
                        {/*    <Image*/}
                        {/*        source={theme.ic_unfold_nor}*/}
                        {/*        style={{height: 20, width: 20, resizeMode: "contain"}}*/}
                        {/*    />*/}
                        {/*</TouchableOpacity>*/}
                        {/*}*/}
                  {/*      {showMore &&*/}
                  {/*      <TouchableOpacity style={{flexDirection: 'row', alignItems: "center"}}*/}
                  {/*                        onPress={() => this.onPressShowMore()}>*/}
                  {/*          <Text*/}
                  {/*              numberOfLines={1}*/}
                  {/*              style={{*/}
                  {/*                  fontSize: theme.fontSmall,*/}
                  {/*                  color: theme.grey1,*/}
                  {/*              }}*/}
                  {/*          >*/}
                  {/*              {language.HIDE}*/}
                  {/*          </Text>*/}
                  {/*          <Image*/}
                  {/*              source={theme.ic_unfold_foc}*/}
                  {/*              style={{height: 20, width: 20, resizeMode: "contain"}}*/}
                  {/*          />*/}
                  {/*          /!* <Image*/}
                  {/*  source={theme.ic_arrowup}*/}
                  {/*  style={{ height: 50, width: 50, resizeMode: "contain" }}*/}
                  {/*/> *!/*/}
                  {/*      </TouchableOpacity>*/}
                  {/*      }*/}
                    </View>

                    {showMore && this.showMore(item)}

                </View>

                {showcomment && <Comments props={this.props}/>}

                {deleteModal && this.DeleteModal()}

            </View>
        );
    }

    render() {
        const {newseventitem} = this.props;
        return (
            <View style={styles.container}>
                {this.renderShopCardItem(newseventitem)}
            </View>
        )
    }
}

export default React.memo(NewsEventCard);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        backgroundColor: 'white',
        marginBottom: 10,
    },

    container1: {
        flex: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        backgroundColor: 'white',
        marginBottom: 10,
        marginTop: 10,
    },

    header: {
        paddingVertical: 15,
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        marginBottom: 10,
    },
    feature1: {
        backgroundColor: theme.white,
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    featuretext: {
        color: theme.grey2,
        fontSize: 12,
    },
    featuretextclose: {
        color: 'red',
        fontSize: 12,
    },
    discount: {
        color: theme.grey1,
        fontSize: theme.fontSmall,
    },
    rating: {
        padding: 5,
        borderRadius: 5,
        flexDirection: "row",
        backgroundColor: theme.white,
        alignItems: "center",
    },
    linearGradient: {
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 2,
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
    menuName: {
        fontSize: theme.font14,
        color: theme.black,
        paddingHorizontal: 5
    },
    menuDiscount: {
        fontSize: theme.font14,
        color: theme.red,
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
    dotdot: {
        color: theme.black,
        paddingHorizontal: 5
    },
    menuOriginalPrice: {
        fontSize: theme.font14,
        color: theme.grey2,
        textDecorationLine: "line-through",
        paddingHorizontal: 5
    },
    menuRealPrice: {
        fontSize: theme.font14,
        color: theme.black,
        paddingHorizontal: 5,
        fontWeight: 'bold'
    },
    menuWrapper: {
        flexDirection: "row",
        justifyContent: 'space-around',
        backgroundColor: theme.greymenu,
        marginVertical: 5,
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    textRegisterDay: {
        color: theme.grey1,
        fontSize: theme.fontSmall,
    },
    commentshow: {
        color: theme.grey2,
        fontSize: theme.fontSmall,
        paddingLeft: 4
    }
});
