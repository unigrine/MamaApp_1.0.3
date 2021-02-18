// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import {useNavigation, useTheme} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/EvilIcons'
import {CommonStyle} from "../../constants/style";
import {
    SetMyLocationAction,
    AddAddressHistoryAction,
    RemoveAddressHistoryAction
} from "../../store/Config/action";
import {connect} from 'react-redux';
import {
    getAddressByLocationForNaver,
    getAddressByKeywordForNaver,
    getAddressByKeywordForKakao
} from "../../utils/global";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-simple-toast";
import {processLocationData, requestLocation, setCurrentLocationData} from "../../utils/location";

class MainArea extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            searchKeyword: "",
            loading: false,
            address_history_list: [],
        }
    }

    async componentDidMount() {
        let address_history_list = await AsyncStorage.getItem('mama_address_history_list', '');
        address_history_list === null ?
            this.initCurrentAddressList() :
            this.setState({ address_history_list: JSON.parse(address_history_list) });
    }

    componentDidUpdate(prevProps, prevState) {
        const {address_history_list} = this.props;
        if (prevProps.address_history_list != address_history_list) {
            this.initCurrentAddressList()
        }
    }

    componentWillUnmount() {
        const {address_history_list} = this.props;

        AsyncStorage.setItem('mama_address_history_list', JSON.stringify(address_history_list));
    }

    initCurrentAddressList() {
        const {address_history_list} = this.props;
        // let temp_address_history_list = address_history_list.reverse();

        this.setState({address_history_list});
    }

    onPressSearch = () => {
        // const {searchKeyword} = this.state
        //
        // if (searchKeyword === '') {
        //     Toast.show(language.PLEASE_INPUT_SEARCH_KEYWORD);
        //     return;
        // }

        this.props.navigation.navigate('DetailArea');
    }

    onPressRemoveItem(item) {
        this.props.RemoveCurrentAddressHistory(item)
    }

    onPressItem = async (item) => {
        // console.log(`item: ${JSON.stringify(item)}`);
        let location = await processLocationData(item?.latitude, item?.longitude);

        this.props.SetMyLocation(location);
        this.props.AddCurrentAddressHistory(location);
        this.props.navigation.replace('MainScreen');
    }

    onPressCurrentLocationSearch = async () => {
        this.setState({ loading: true });
        await requestLocation((data) => {
            this.onPressItem(data);
            this.setState({ loading: false });
        });
    }

    renderItem(item) {
        return (
            <TouchableOpacity style={{flexDirection: 'row', alignItems: "center", paddingVertical: 15}}
                              onPress={() => this.onPressItem(item)}
            >
                <View style={{flex: 10}}>
                    <Text style={[styles.address]} numberOfLines={1}>{item.address_name}</Text>
                    <View style={{flexDirection: 'row', paddingTop: 5}}>
                        <Text style={styles.loadname}>{language.LOAD_NAME}</Text>
                        <Text style={[styles.loadaddr]} numberOfLines={2}>{item?.road_address_name !== '' ? item?.road_address_name : '-'}</Text>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity onPress={() => this.onPressRemoveItem(item)}>
                        <Icon name={'close'} size={25} color={theme.black}/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const {searchKeyword, loading, address_history_list} = this.state
        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <Header leftIcon="angle-left" title={language.MAIN_LOCATION_SET} navigation={this.props.navigation}/>
                {loading &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={loading} size="large"
                                   color={theme.primary}/>
                }
                <View style={styles.body}>
                    {/* 주소 검색 창 */}
                    <TouchableOpacity style={styles.inputWrapper}
                                      onPress={() => this.props.navigation.navigate('DetailArea')}>
                        <View style={{width: "90%", alignItems: "center"}}>
                            <Text style={{ color: theme.grey1, fontSize: theme.fontMedium }}>{language.MAIN_SEARCH_HINT}</Text>
                            {/*<TextInput*/}
                            {/*    style={styles.searchInput}*/}
                            {/*    placeholder={language.MAIN_SEARCH_HINT}*/}
                            {/*    placeholderTextColor={theme.grey1}*/}
                            {/*    maxLength={50}*/}
                            {/*    value={searchKeyword}*/}
                            {/*    onChangeText={text => this.setState({searchKeyword: text})}*/}
                            {/*    onSubmitEditing={() => this.onPressSearch()}*/}
                            {/*/>*/}
                        </View>
                        <View>
                            <Image
                                source={theme.ic_search_nor}
                                style={{height: 20, width: 20, resizeMode: "contain"}}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* 현재 위치로 주소 찾기 */}
                    <View style={styles.currentLocationWrapper}>
                        <TouchableOpacity style={CommonStyle.row_v_center} onPress={() => this.onPressCurrentLocationSearch()}>
                            <Image
                                source={theme.ic_current_nor}
                                style={{height: 30, width: 30, resizeMode: "contain"}}
                            />
                            <Text style={styles.textCurrentLocation}>
                                {language.MAIN_CURRENT_LOCATION}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 최근 주소 리스트*/}
                    <View style={{height: 40}}/>
                    <Text style={styles.recentaddress}>{language.MAIN_RECENT_ADDRESS}</Text>
                    <FlatList
                        style={{marginTop: 20}}
                        showsVerticalScrollIndicator={false}
                        data={address_history_list}
                        renderItem={({item}) => this.renderItem(item)}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={<View style={{height: 300}}></View>}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        address_history_list: state.userstatus.address_history_list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        AddCurrentAddressHistory: (data) => dispatch(AddAddressHistoryAction(data)),
        SetMyLocation: (data) => dispatch(SetMyLocationAction(data)),
        RemoveCurrentAddressHistory: (data) => dispatch(RemoveAddressHistoryAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainArea);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },
    body: {
        flex: 1,
        paddingHorizontal: 20,
    },
    inputWrapper: {
        backgroundColor: theme.white,
        width: "100%",
        borderRadius: 4,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "space-between",
        paddingVertical: 2,
        borderColor: theme.grey1,
        borderWidth: 0.5,
        height: 50,
    },
    searchInput: {
        height: 45,
        width: "100%",
        fontSize: theme.fontMedium,
        paddingHorizontal: 4,
        color: theme.black
    },
    currentLocationWrapper: {
        marginTop: 10,
        backgroundColor: theme.white,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 2,
        borderColor: theme.grey1,
        borderWidth: 0.5,
        height: 50,
    },
    textCurrentLocation: {
        fontSize: theme.fontMedium,
        fontWeight: 'bold',
    },
    address: {
        color: "black",
        fontSize: theme.fontMedium,
    },
    loadname: {
        fontSize: theme.fontSmall,
        color: theme.grey1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        borderColor: theme.grey1,
        borderWidth: 0.5,
    },
    loadaddr: {
        fontSize: theme.fontSmall,
        color: theme.grey1,
        paddingLeft: 4,
    },
    recentaddress: {
        fontSize: theme.font14,
        color: theme.black,
        paddingBottom: 20,
        borderBottomColor: theme.grey2,
        borderBottomWidth: 0.5,
    },
});
