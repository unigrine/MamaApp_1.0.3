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
    ImageBackground,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator, Platform
} from "react-native";
import {connect} from 'react-redux';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DropDownPicker from 'react-native-dropdown-picker';
import moment from "moment"
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    GetNewsEventCategoryAction,
    GetNewsEventAction,
    RegisterNewsEventAction,
    UpdateNewsEventAction
} from "../../store/NewsEvent/action";
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from "react-native-raw-bottom-sheet";
import * as globalStyles from "../../constants/style/global";
import {getDateFormat} from "../../utils/text_format";
import {isEmptyCheck, regexNumber} from "../../utils/regex";

const ONE_CLASS = [
    {
        label: "새소식",
        value: "1"
    },
    {
        label: "이벤트",
        value: "2"
    },
]

const SECOND_CLASS = [
    {
        label: "할인혜택",
        value: "1"
    },
    {
        label: "기타 이벤트",
        value: "2"
    },
]

class RegisterNewsOrEventScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            shop_id: this?.props?.shop_data?.id,  // 내가게 아이디로 초기화
            title: '',
            errorTitleMsg: '',
            content: '',
            errorContentMsg: '',
            isModal: false,
            isChecked: true,
            isUpdating: false,
            one_class_value: '1',
            second_class_value: '1',
            datetime: new Date(),
            showStartDate: false,
            showEndDate: false,
            startDate: new Date(),
            endDate: new Date(),
            menu_list: [],
            errorMenuMsg: '',
            first_category: [],
            second_category: [],
            keyword_list: [],
            image_list: [],
        }
        this.onchangeStartDate = this.onchangeStartDate.bind(this)
        this.onchangeEndDate = this.onchangeEndDate.bind(this)
    }

    componentDidMount() {
        const {news_event_category} = this.props

        if (news_event_category == null) this.props.GetNewsEventCategory()

        this.initCategoryList()
        this.initCategory()
        this.initEventData()
        this.initMenu()
        this.initKeyword()
        this.initImage()

    }

    componentDidUpdate(prevProps, prevState) {
        const {news_event_category, isUpdateLoading} = this.props

        if (prevProps.news_event_category != news_event_category) {
            this.initCategoryList()
        }

        if (prevProps.isUpdateLoading != isUpdateLoading && isUpdateLoading == false) {
            this.setState({isModal: true})
            this.getNewsEventInfo()
        }
    }

    getNewsEventInfo() {
        const {shop_data, token} = this.props
        let shop_id = shop_data?.id
        const data = {shop_id, token}
        this.props.GetNewsEvent(data)
    }

    initCategoryList() {
        const {news_event_category} = this.props
        let first_category = []

        news_event_category?.map(item => {
            let oneItem = {
                label: item.name,
                value: item.id.toString()
            }
            first_category.push(oneItem)
        })

        this.setState({first_category})
    }

    initCategory() {
        const event_data = this.props?.route?.params?.event_data
        const {news_event_category} = this.props
        let second_category = []

        if (event_data == undefined || event_data == null) return

        const one_class_value = event_data?.first_type.toString()
        const second_class_value = event_data?.second_type?.toString()

        news_event_category?.map(p => {
            if (p.id.toString() != one_class_value) return

            p?.sub_types?.map(q => {
                let oneItem = {
                    label: q.name,
                    value: q.id.toString()
                }
                second_category.push(oneItem)
            })
        })

        this.setState({one_class_value, second_class_value, second_category})
    }

    initEventData() {
        const event_data = this.props?.route?.params?.event_data
        if (event_data == undefined || event_data == null) return

        const shop_id = event_data?.shop_id;
        const title = event_data?.title;
        const content = event_data?.content;
        const startDate = new Date(event_data?.start_date)
        const endDate = new Date(event_data?.end_date)

        this.setState({shop_id, title, content, startDate, endDate})
    }

    initMenu() {
        const event_data = this.props?.route?.params?.event_data
        const discount_menu = event_data?.discount_menu
        let menu_list = []

        if (discount_menu == undefined || discount_menu == null) {
            const menu = {
                id: 0,
                checked: false,
                name: "",
                origin_price: "",
                discount_percentage: "",
                result_price: ""
            }
            menu_list.push(menu)
        } else {
            discount_menu?.map((menu_item, index) => {
                const menu = {
                    id: index,
                    checked: true,
                    name: menu_item?.name,
                    origin_price: menu_item?.origin_price,
                    discount_percentage: menu_item?.discount_percentage,
                    result_price: menu_item?.result_price
                }
                menu_list.push(menu)
            })
        }

        this.setState({menu_list})
    }

    initKeyword() {
        const event_data = this.props?.route?.params?.event_data
        const keywords = event_data?.keywords
        let newKeywordList = []
        keywords?.map((item, index) => {
            const keyword = {
                id: index,
                status: 2,  // 이미 체크된 상태
                text: item
            }
            newKeywordList.push(keyword)
        })

        // 빈 항목 하나 더 추가
        const keyword = {
            id: newKeywordList.length,
            status: 0,
            text: ""
        }

        newKeywordList.push(keyword)
        this.setState({keyword_list: newKeywordList})
    }

    initImage() {
        const event_data = this.props?.route?.params?.event_data
        const image_urls = event_data?.image_urls
        let image_list = []
        Array.isArray(image_urls) && image_urls?.map((item, index) => {
            if (item.length < 1) return
            let oneItem = {
                uri: item,
                uploaded: true, // 이미 서버에 업로드 되었는가?,
                source: null,     // 서버에 업로드된것이기 때문에 null 임.  imagePicker때에만 즉 uploaded false 때에만 있음
            }
            image_list.push(oneItem)
        })

        this.setState({image_list})
    }

    onChangeTitleText(text) {
        this.setState({title: text, errorTitleMsg: ''});
    }

    onChangeContentText(text) {
        this.setState({content: text, errorContentMsg: ''});
    }

    onPressRegister() {
        const event_data = this.props?.route?.params?.event_data;
        const {token, shop_data} = this.props;
        const {
            shop_id, one_class_value, second_class_value, startDate, endDate, title,
            content, menu_list, keyword_list, image_list
        } = this.state;
        let isCheck = true;

        // 제목
        if (title === '') {
            this.setState({errorTitleMsg: language.PLEASE_INPUT_TITLE});
            return
        }

        // 내용
        if (content === "") {
            this.setState({errorContentMsg: language.PLEASE_INPUT_CONTENT});
            return
        }

        // 할인 메뉴
        let discount_menu = [];
        if (one_class_value === '2' && second_class_value === '1') {
            menu_list.map(item => {
                if (item.name === '' ||
                    item.origin_price === '' ||
                    item.discount_percentage === '' ||
                    item.result_price === '') {
                    this.setState({errorMenuMsg: language.PLEASE_INPUT_DISCOUNT_MENU});
                    isCheck = false;
                    return;
                }

                if (!regexNumber(item.origin_price) ||
                    !regexNumber(item.discount_percentage) ||
                    !regexNumber(item.result_price)) {
                    this.setState({errorMenuMsg: language.PLEASE_INPUT_DISCOUNT_MENU_NUMBER});
                    isCheck = false;
                    return;
                }
                // let origin_price = getNumberWithCommas(parseInt(item.origin_price));
                // let result_price = getNumberWithCommas(parseInt(item.result_price));
                let newItem = {
                    name: item.name,
                    origin_price: item.origin_price,
                    discount_percentage: item.discount_percentage,
                    result_price: item.result_price
                }

                discount_menu.push(newItem)
            })
        }

        // 키워드
        let keywords = []
        keyword_list.map(item => {
            if (item.text == "") return
            keywords.push(item.text)
        })

        // 이미지 업로드
        let image1 = ""
        let image2 = ""
        let image3 = ""
        let imageSource = []
        let image_urls = []

        Array.isArray(image_list) && image_list?.map(item => {
            if (item.source == null) // 서버에 업로드 된것들!
                image_urls.push(item.uri)
            else
                imageSource.push(item.source)
        })

        if (imageSource.length == 1)
            image1 = imageSource[0]
        else if (imageSource.length == 2) {
            image1 = imageSource[0]
            image2 = imageSource[1]
        } else if (imageSource.length == 3) {
            image1 = imageSource[0]
            image2 = imageSource[1]
            image3 = imageSource[2]
        }

        if (!isCheck) {
            return;
        }

        let data = new FormData();
        data.append('shop_id', shop_id)
        data.append('first_type', parseInt(one_class_value))
        data.append('second_type', parseInt(second_class_value))
        data.append('start_date', getDateFormat(startDate, 'YYYY-MM-DD'))
        data.append('end_date', getDateFormat(endDate, 'YYYY-MM-DD'))
        data.append('title', title)
        data.append('content', content)
        data.append('discount_menu', JSON.stringify(discount_menu))
        data.append('keywords', JSON.stringify(keywords))
        data.append('image1', image1)
        data.append('image2', image2)
        data.append('image3', image3)
        data.append('image_urls', JSON.stringify(image_urls))

        if (event_data == undefined || event_data == null) { // register {
            let sendData = {
                token,
                data
            }
            this.props.RegisterNewsEvent(sendData)
        } else {
            let sendData = {
                token,
                data,
                id: event_data?.id
            }

            this.props.UpdateNewsEvent(sendData)
        }
    }

    onPressModalOk() {
        this.setState({isModal: false});
        this.props.navigation.goBack();
        // this.props.navigation.navigate("LoginCeoScreen")
    }

    onChangeOneClass(item) {
        const {news_event_category} = this.props
        let second_category = []

        news_event_category?.map(p => {
            if (p.id.toString() != item.value) return

            p?.sub_types?.map(q => {
                let oneItem = {
                    label: q.name,
                    value: q.id.toString()
                }
                second_category.push(oneItem)
            })
        })

        this.setState({one_class_value: item.value, second_category})
    }

    onChangeSecondClass(item) {
        this.setState({second_class_value: item.value})
    }

    onchangeStartDate(event, selectedDate) {
        const currentDate = selectedDate || this.state.startDate;
        this.setState({startDate: currentDate, showStartDate: Platform.OS === 'ios'})
    }

    onchangeEndDate(event, selectedDate) {
        const currentDate = selectedDate || this.state.endDate;
        this.setState({endDate: currentDate, showEndDate: Platform.OS === 'ios'})
    }

    onPressAddMenu() {
        const {menu_list} = this.state;

        if (menu_list.length === 20) {
            // 메뉴 추가개수 제한
            this.setState({errorMenuMsg: language.MAX_20_MENU});
            return
        }

        const isEmpty = menu_list.filter(item => !item?.checked).length > 0;

        if (isEmpty) {
            this.setState({errorMenuMsg: language.PLEASE_INPUT_DISCOUNT_MENU});
            return
        }

        const menu = {
            id: menu_list.length,
            checked: false,
            name: "",
            origin_price: "",
            discount_percentage: "",
            result_price: ""
        }

        menu_list.push(menu)
        this.setState({menu_list, errorMenuMsg: ''})
    }

    onChangeMenuName(selItem, text) {
        const {menu_list} = this.state
        let new_menu_list = []
        menu_list.map(item => {
            if (item.id != selItem.id) {
                new_menu_list.push(item)
            } else {
                let checked = false
                if (item.name !== '') {
                    // 가격이 이미 설정되었으면. 메뉴는 지금 설정하는거고
                    checked = true        // true이면  +메뉴 추가하기 활성화
                }

                const menu = {
                    ...item,
                    name: text,
                    checked: checked,
                }
                new_menu_list.push(menu)
            }
        })

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''})
    }

    onChangeOriginalPrice(selItem, text) {
        const {menu_list} = this.state
        let new_menu_list = []
        menu_list.map(item => {
            if (item.id != selItem.id) {
                new_menu_list.push(item)
            } else {
                let checked = false
                if (item.origin_price !== '') {
                    // 가격이 이미 설정되었으면. 메뉴는 지금 설정하는거고
                    checked = true        // true이면  +메뉴 추가하기 활성화
                }

                const menu = {
                    ...item,
                    origin_price: text,
                    checked: checked,
                }
                new_menu_list.push(menu)
            }
        })

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''})
    }

    onChangeDiscountRatio(selItem, text) {
        const {menu_list} = this.state
        let new_menu_list = []
        menu_list.map(item => {
            if (item.id != selItem.id) {
                new_menu_list.push(item)
            } else {
                const menu = {
                    ...item,
                    discount_percentage: text,
                }
                new_menu_list.push(menu)
            }
        })

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''})
    }

    onChangDiscountPrice(selItem, text) {
        const {menu_list} = this.state
        let new_menu_list = []
        menu_list.map(item => {
            if (item.id != selItem.id) {
                new_menu_list.push(item)
            } else {
                const menu = {
                    ...item,
                    result_price: text,
                }
                new_menu_list.push(menu)
            }
        })

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''})
    }

    onChangeDateTime = (event, selectedDate) => {
        let date = moment(event).format('YYYY-MM-DD');
        let time = moment(event).format('hh:mm:ss');

        this.setState({
            datetime: event,
            date,
            time,
        })
    }

    onChangeKeywordText(selItem, text) {
        const {keyword_list} = this.state
        let newKeywordList = []
        keyword_list.map(item => {
            if (item.id != selItem.id) {
                newKeywordList.push(item)
            } else {
                const keyword = {
                    ...item,
                    text: text,
                }
                newKeywordList.push(keyword)
            }
        })

        this.setState({keyword_list: newKeywordList})
    }

    // 키워드 초점 잃을 때 검사하고 한문자라도 있으면 추가, 빈 키워드항목 하나 추가
    onBlurKeyword(selItem) {
        const {keyword_list} = this.state
        let newKeywordList = []
        let selKeyword = keyword_list.find(item => item.id == selItem.id)

        if (selKeyword.text.length < 1) { // 빈문자이면 status ==0 으로 셋팅하고 돌린다.
            keyword_list.map(item => {
                if (item.id != selItem.id) {
                    newKeywordList.push(item)
                } else {
                    const keyword = {
                        ...item,
                        status: 0,
                    }
                    newKeywordList.push(keyword)
                }
            })
            this.setState({keyword_list: newKeywordList})
            return
        }

        // 현재 키워드로 셋팅, 추가
        keyword_list.map(item => {
            if (item.id != selItem.id) {
                newKeywordList.push(item)
            } else {
                const keyword = {
                    ...item,
                    status: 2,
                }
                newKeywordList.push(keyword)
            }
        })

        // 빈 키워드 항목 하나 추가, onPressAddKeyword를 호출하지 말것(stauts 동기화문제)
        const emptyKeyword = {
            id: keyword_list.length,
            status: 0,
            text: ""
        }
        newKeywordList.push(emptyKeyword)
        this.setState({keyword_list: newKeywordList})
    }

    onFocusKeyword(selItem) {
        const {keyword_list} = this.state

        let newKeywordList = []
        keyword_list.map(item => {
            if (item.id != selItem.id) {
                newKeywordList.push(item)
            } else {
                const keyword = {
                    ...item,
                    status: 1
                }
                newKeywordList.push(keyword)
            }
        })

        this.setState({keyword_list: newKeywordList})
    }

    onPressDeleteKeyword(selItem) {
        const {keyword_list} = this.state

        let newKeywordList1 = []
        keyword_list.map(item => {
            if (item.id != selItem.id) {
                newKeywordList1.push(item)
            }
        })

        // index 다시 정렬
        let newKeywordList = []
        newKeywordList1.map((item, index) => {
            let oneItem = {
                ...item,
                id: index
            }
            newKeywordList.push(oneItem)
        })

        this.setState({keyword_list: newKeywordList})
    }

    onPressDeleteMenu(selItem) {
        const {menu_list} = this.state

        let new_menu_list = []
        let index = 0
        menu_list.map((item) => {
            if (item.id !== selItem.id) {
                const menu = {
                    ...item,
                    id: index++,
                }
                new_menu_list.push(menu)
            }
        })

        if (menu_list.length < 2) {
            return
        }

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''})
    }

    onPressDeleteImage(index) {
        const {image_list} = this.state
        let newImages = []
        image_list.map((item, key) => {
            if (key == index) return
            newImages.push(item)
        })

        this.setState({image_list: newImages})
    }

    openCamera() {
        // this.RBSheet.close()
        const {image_list} = this.state

        if (image_list.length > 2) return

        ImagePicker.openCamera({
            mediaType: 'photo',
            width: 1200,
            height: 800,
            cropping: true,
            sortOrder: 'desc',
            // includeExif: true,
        }).then(image => {
            const filename = image.path.replace(/^.*[\\\/]/, '')
            const source = {
                uri: Platform.OS == 'android' ? image.path : image.path.replace('file://', ''),
                type: image.mime,
                name: `${filename}`
            };
            let newImageList = []
            image_list.map(item => {
                newImageList.push(item)
            })

            let oneItem = {
                uri: source.uri,
                uploaded: false, // 아직 서버에 올리지 못한 uri,
                source: source,
            }
            newImageList.push(oneItem)

            this.setState({image_list: newImageList})

            this.RBSheet.close()
        }).catch(err => {
            console.log(err)
        });
    }

    openGallery() {
        //
        const {image_list} = this.state

        if (image_list.length > 2) return

        ImagePicker.openPicker({
            mediaType: 'photo',
            width: 1200,
            height: 800,
            cropping: true,
            smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Bursts']
        }).then(image => {
            const filename = image.path.replace(/^.*[\\\/]/, '')
            const source = {
                uri: Platform.OS == 'android' ? image.path : image.path.replace('file://', ''),
                type: image.mime,
                name: `${filename}`
            };
            let newImageList = []
            image_list.map(item => {
                newImageList.push(item)
            })
            let oneItem = {
                uri: source.uri,
                uploaded: false, // 아직 서버에 올리지 못한 uri,
                source: source,
            }
            newImageList.push(oneItem)

            this.setState({image_list: newImageList})

            this.RBSheet.close()
        }).catch(err => {
            console.log(err)
        });
    }

    onPressAddImage = () => {
        const {image_list} = this.state
        if (image_list.length > 2) return

        this.RBSheet.open()
    }

    Modal() {
        const event_data = this.props?.route?.params?.event_data
        const title = event_data == undefined || event_data == null ? language.REGISTERED_NEWS_OR_EVENT : language.UPDATED_NEWS_OR_EVENT

        return (
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={{marginTop: 0, paddingTop: 0}}>
                        <View style={{alignItems: "flex-end"}}>
                            <TouchableOpacity onPress={() => this.setState({isModal: false})}>
                                <Image source={theme.ic_delete_nor} style={{width: 40, height: 40}}/>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalText}>
                            {title}
                        </Text>
                        <View style={{marginTop: 30}}>
                            <TouchableOpacity style={styles.btnLogin}
                                              onPress={() => this.onPressModalOk()}
                            >
                                <Text
                                    style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                    {language.OK}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    bottomView() {
        const {isChecked, isUpdating} = this.state
        const event_data = this.props?.route?.params?.event_data
        const title = event_data == undefined || event_data == null ? language.REGISTER : language.FINISH

        return (
            <View style={{marginHorizontal: 20,}}>
                <View style={{marginTop: 50}}>
                    <TouchableOpacity style={[CommonStyle.submitbutton, {
                        position: "absolute",
                        width: "100%",
                        bottom: 30
                    }, isChecked ? {backgroundColor: theme.primary} : null]}
                                      onPress={() => this.onPressRegister()}
                    >
                        <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                            {title}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    ServiceTimeView() {
        const {showStartDate, showEndDate} = this.state
        return (
            <View style={{marginTop: 20}}>
                <View style={styles.serviceTime}>
                    <Text style={CommonStyle.textTitle}>
                        {language.PERIOD}
                    </Text>
                </View>
                <View style={{width: "100%", flexDirection: "row"}}>
                    <View style={[styles.startDate, {marginRight: 5}]}>
                        <Text style={[CommonStyle.textSmall, {paddingTop: 10}]}>
                            {language.START_DATE}
                        </Text>
                        <TouchableOpacity style={{width: '100%', paddingLeft: 10}}
                                          onPress={() => this.setState({showStartDate: true})}>
                            <Text style={[CommonStyle.textSmall, {paddingTop: 10, color: theme.black}]}>
                                {moment(this.state.startDate).format('MM월 DD일')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.startDate, {marginLeft: 5}]}>
                        <Text style={[CommonStyle.textSmall, {paddingTop: 10}]}>
                            {language.END_DATE}
                        </Text>
                        <TouchableOpacity style={{width: '100%', paddingLeft: 10}}
                                          onPress={() => this.setState({showEndDate: true})}>
                            <Text style={[CommonStyle.textSmall, {paddingTop: 10, color: theme.black}]}>
                                {moment(this.state.endDate).format('MM월 DD일')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {showStartDate && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={this.state.startDate}
                            // minimumDate={new Date()}
                            mode={'date'}
                            display="default"
                            onChange={this.onchangeStartDate}
                        />
                    )}
                    {showEndDate && (
                        <DateTimePicker
                            testID="dateTimePicker2"
                            value={this.state.endDate}
                            minimumDate={this.state.startDate}
                            mode={'date'}
                            display="default"
                            onChange={this.onchangeEndDate}
                        />
                    )}
                </View>
            </View>
        )
    }

    TitleView() {
        const {title} = this.state
        return (
            <>
                <View style={[CommonStyle.inputWrapper, {zIndex:1}]}>
                    <Text style={CommonStyle.textTitle}>
                        {language.SUBJECT}
                    </Text>
                    <View style={CommonStyle.row_sb}>
                        <TextInput
                            style={[CommonStyle.input, {width: "90%"}]}
                            autoCapitalize="none"
                            multiline
                            maxLength={45}
                            value={title}
                            placeholder={language.INPUT_HERE}
                            onChangeText={(text) => this.onChangeTitleText(text)}
                        />
                        <Text style={{
                            fontSize: theme.fontSmall,
                            color: theme.grey1,
                            alignSelf: "flex-end",
                            paddingBottom: 5
                        }}>
                            {title.length}/45
                        </Text>
                    </View>

                </View>
                {this.state.errorTitleMsg.length > 0 ?
                    <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorTitleMsg}</Text> : null}
            </>
        )
    }

    ContentView() {
        const {content} = this.state
        return (
            <>
                <View style={CommonStyle.inputWrapper}>
                    <Text style={CommonStyle.textTitle}>
                        {language.CONTENT}
                    </Text>
                    <View style={CommonStyle.row_sb}>
                        <TextInput
                            style={[CommonStyle.input, {width: "90%"}]}
                            autoCapitalize="none"
                            multiline
                            maxLength={80}
                            value={content}
                            placeholder={language.INPUT_HERE}
                            onChangeText={(text) => this.onChangeContentText(text)}
                        />
                        <Text style={{
                            fontSize: theme.fontSmall,
                            color: theme.grey1,
                            alignSelf: "flex-end",
                            paddingBottom: 5
                        }}>
                            {content.length}/80
                        </Text>
                    </View>
                </View>
                {this.state.errorContentMsg.length > 0 ?
                    <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorContentMsg}</Text> : null}
            </>
        )
    }

    CategoryTypeView() {
        const {one_class_value, second_class_value, first_category, second_category} = this.state
        return (
            <View style={styles.categoryTypeWrapper}>
                <View style={CommonStyle.row}>
                    <Text style={[CommonStyle.textTitle, {flex: 1}]}>
                        {language.CLASS}
                    </Text>
                    {one_class_value != "1" &&
                    <Text style={[CommonStyle.textTitle, {flex: 1, marginLeft: 10}]}>
                        {language.SECOND_CLASS}
                    </Text>
                    }
                </View>
                {
                    first_category.length > 0 &&
                    <View style={{width: "100%", flexDirection: "row"}}>
                        <View style={{width: "50%", paddingRight: 5}}>
                            <DropDownPicker
                                items={first_category}
                                placeholder={language.DAYS}
                                placeholderStyle={styles.placeholder}
                                containerStyle={styles.dropDownPickerStyle}
                                itemStyle={{justifyContent: 'flex-start'}}
                                labelStyle={styles.labelStyle}
                                defaultValue={one_class_value}
                                onChangeItem={item => this.onChangeOneClass(item)}
                            />
                        </View>
                        {second_category.length > 0 &&
                        <View style={{width: "50%", paddingLeft: 5}}>
                            <DropDownPicker
                                items={second_category}
                                placeholder={language.TIME}
                                placeholderStyle={styles.placeholder}
                                containerStyle={styles.dropDownPickerStyle}
                                itemStyle={{justifyContent: 'flex-start'}}
                                labelStyle={styles.labelStyle}
                                defaultValue={second_class_value}
                                onChangeItem={item => this.onChangeSecondClass(item)}
                            />
                        </View>
                        }
                    </View>
                }
            </View>
        )
    }

    renderMenuItem(item) {
        return (
            <View key={item.id}>
                <View style={[CommonStyle.row, {justifyContent: "space-between"}]}>
                    <View style={[styles.inputWrapper, {flex: 1, marginRight: 5}]}>
                        <TextInput
                            style={[styles.input, {textAlign: 'left'}]}
                            autoCapitalize="none"
                            maxLength={30}
                            value={item.name}
                            placeholder={language.MENU_NAME}
                            onChangeText={text => this.onChangeMenuName(item, text)}
                        />
                    </View>
                    <View style={[styles.inputWrapper, {flex: 1, marginRight: 5}]}>
                        <View style={[CommonStyle.row_v_center, {paddingRight: 10}]}>
                            <Text style={styles.menuDescription}>{language.ORIGINAL_PRICE}</Text>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    maxLength={12}
                                    value={item.origin_price}
                                    onChangeText={text => this.onChangeOriginalPrice(item, text)}
                                />
                            </View>
                            <Text style={styles.unit}>원</Text>
                        </View>
                    </View>
                </View>

                <View style={[CommonStyle.row, {justifyContent: "space-between"}]}>
                    <View style={[styles.inputWrapper, {flex: 3, marginRight: 5}]}>
                        <View style={[CommonStyle.row_v_center, {paddingRight: 10}]}>
                            <Text style={styles.menuDescription}>{language.DISCOUNT_RATIO}</Text>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={[styles.input, {color: theme.red}]}
                                    autoCapitalize="none"
                                    maxLength={5}
                                    value={item.discount_percentage}
                                    onChangeText={text => this.onChangeDiscountRatio(item, text)}
                                />
                            </View>
                            <Text style={styles.unit}>%</Text>
                        </View>
                    </View>
                    <View style={[styles.inputWrapper, {flex: 3, marginLeft: 5}]}>
                        <View style={[CommonStyle.row_v_center, {paddingRight: 10}]}>
                            <Text style={styles.menuDescription}>{language.DISCOUNT_PRICE}</Text>
                            <View style={{flex: 1}}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    maxLength={12}
                                    value={item.result_price}
                                    onChangeText={text => this.onChangDiscountPrice(item, text)}
                                />
                            </View>
                            <Text style={styles.unit}>원</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <TouchableOpacity style={styles.minusButton}
                                          onPress={() => this.onPressDeleteMenu(item)}>
                            <Icon name={"minus"} size={12} color={theme.white}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }

    MenuView() {
        const {menu_list} = this.state
        return (
            <View style={{marginTop: 20}}>
                <View style={CommonStyle.row_sb}>
                    <Text style={CommonStyle.textTitle}>
                        {language.DISCOUNT_MENU}
                    </Text>
                    <TouchableOpacity style={styles.addTimeBtn} onPress={() => this.onPressAddMenu()}>
                        <Text style={styles.addMenu}>
                            {language.ADD_MENU1}
                        </Text>
                    </TouchableOpacity>
                </View>

                {menu_list.map((item) => {
                    return this.renderMenuItem(item)
                })}

                {this.state.errorMenuMsg.length > 0 ?
                    <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorMenuMsg}</Text> : null}
            </View>
        )
    }

    renderKeywordItem(item) {
        return (
            <View key={item.id} style={{paddingVertical: 5, paddingRight: 5}}>
                {
                    item.text.length > 0 && item.status == 2 ?
                        <View style={styles.keywordWrapper}>
                            <View style={[CommonStyle.row_sb, {paddingHorizontal: 5}]}>
                                <Text style={{
                                    fontSize: theme.font14,
                                    color: theme.white,
                                    paddingHorizontal: 5
                                }}>{item.text}</Text>
                                <TouchableOpacity style={{alignItems: "center"}}
                                                  onPress={() => this.onPressDeleteKeyword(item)}>
                                    <Icon name={"close"} size={20} color={theme.white}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={[styles.keywordWrapper, {
                            backgroundColor: theme.white,
                            borderColor: item.status == 0 ? theme.grey2 : theme.primary
                        }]}>
                            <TextInput
                                style={[styles.keywordInput, {
                                    fontSize: theme.font14,
                                    alignSelf: "center",
                                    textAlignVertical: "center"
                                }]}
                                autoCapitalize="none"
                                maxLength={18}
                                // placeholder="+"
                                onFocus={() => this.onFocusKeyword(item)}
                                onBlur={() => this.onBlurKeyword(item)}
                                onChangeText={(text) => this.onChangeKeywordText(item, text)}
                            />
                            {item.status == 0 &&
                                <Icon style={{position: "absolute", alignSelf: "center"}} name={"plus"} size={20} color={theme.grey1}/>
                            }
                        </View>
                }
            </View>
        )
    }

    KeywordView() {
        const {keyword_list} = this.state
        return (
            <View style={[CommonStyle.inputWrapper, {borderBottomWidth: 0}]}>
                <Text style={CommonStyle.textTitle}>
                    {language.KEYWORD}
                </Text>

                <View style={[CommonStyle.row, {flexWrap: 'wrap', paddingTop: 5}]}>
                    {keyword_list.map((item, key) => {
                        return this.renderKeywordItem(item)
                    })
                    }
                </View>

            </View>
        )
    }

    UploadImageView() {
        const {image_list} = this.state

        return (
            <View style={[CommonStyle.inputWrapper, {borderBottomWidth: 0}]}>
                <Text style={CommonStyle.textTitle}>
                    {language.IMAGE_UPLOAD}
                </Text>
                <Text style={[CommonStyle.textTitle, {fontWeight: "normal"}]}>
                    {language.WILL_BE_REPLACED_TO_PROFILE}
                </Text>

                <View style={[CommonStyle.row_sb, {marginTop: 15}]}>
                    <TouchableOpacity style={styles.imgwrapper} onPress={() => this.onPressAddImage()}>
                        <Text style={{color: theme.grey1, fontSize: 30, marginTop: -10}}>+</Text>
                        <Text style={{
                            color: theme.black,
                            fontSize: theme.font14,
                            marginTop: 0
                        }}>({image_list.length}/3)</Text>
                    </TouchableOpacity>

                    <View style={styles.imgwrapper2}>
                        {/* { image_list?.length > 0 ?
                  <Image source={{uri: image_list[0]}} style={styles.img_full}></Image>
                : <Image source={theme.img_upload} style={styles.img_inner}></Image>
              } */}
                        {image_list?.length > 0 ?
                            <ImageBackground
                                source={{uri: image_list[0].uri}}
                                style={styles.img_full}
                            >
                                <TouchableOpacity style={styles.minusButton} onPress={() => this.onPressDeleteImage(0)}>
                                    <Icon name={"minus"} size={12} color={theme.white}/>
                                </TouchableOpacity>
                            </ImageBackground>
                            :
                            <Image source={theme.img_upload} style={styles.img_inner}></Image>
                        }
                    </View>
                    <View style={styles.imgwrapper2}>
                        {/* { image_list?.length > 1 ?
                  <Image source={{uri: image_list[1]}} style={styles.img_full}></Image>
                : <Image source={theme.img_upload} style={styles.img_inner}></Image>
              } */}
                        {image_list?.length > 1 ?
                            <ImageBackground
                                source={{uri: image_list[1].uri}}
                                style={styles.img_full}
                            >
                                <TouchableOpacity style={styles.minusButton} onPress={() => this.onPressDeleteImage(1)}>
                                    <Icon name={"minus"} size={12} color={theme.white}/>
                                </TouchableOpacity>
                            </ImageBackground>
                            :
                            <Image source={theme.img_upload} style={styles.img_inner}></Image>
                        }
                    </View>
                    <View style={styles.imgwrapper2}>
                        {/* { image_list?.length > 2 ?
                  <Image source={{uri: image_list[2]}} style={styles.img_full}></Image>
                : <Image source={theme.img_upload} style={styles.img_inner}></Image>
              } */}
                        {image_list?.length > 2 ?
                            <ImageBackground
                                source={{uri: image_list[2].uri}}
                                style={styles.img_full}
                            >
                                <TouchableOpacity style={styles.minusButton} onPress={() => this.onPressDeleteImage(2)}>
                                    <Icon name={"minus"} size={12} color={theme.white}/>
                                </TouchableOpacity>
                            </ImageBackground>
                            :
                            <Image source={theme.img_upload} style={styles.img_inner}></Image>
                        }
                    </View>
                </View>
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
                    <TouchableOpacity onPress={() => this.openCamera(false, 'video')} style={CommonStyle.applybtn}>
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


    render() {
        const {one_class_value, second_class_value, isModal} = this.state
        const {isUpdateLoading} = this.props
        const event_data = this.props?.route?.params?.event_data
        const title = language.NEWS_EVENT + " " + (event_data == undefined || event_data == null ? language.REGISTER : language.CHANGE)

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />


                <Header leftIcon="angle-left" title={title} navigation={this.props.navigation}/>
                {isUpdateLoading &&
                <ActivityIndicator style={CommonStyle.spinnerStyle} animating={isUpdateLoading} size="large"
                                   color={theme.primary}/>
                }
                <ScrollView style={styles.body}
                            showsVerticalScrollIndicator={false}
                >
                    {this.CategoryTypeView()}
                    {this.TitleView()}
                    {one_class_value == "2" && this.ServiceTimeView()}
                    {this.ContentView()}
                    {one_class_value == "2" && second_class_value == "1" && this.MenuView()}
                    {this.KeywordView()}
                    {this.UploadImageView()}
                    <View style={{height: 50}}></View>
                </ScrollView>

                {this.bottomView()}
                {this.BottomSheet()}
                {isModal && this.Modal()}

            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        news_event_category: state.newsevent.news_event_category,
        isUpdateLoading: state.newsevent.isUpdateLoading,
        seller_uid: state.session.seller_uid,
        token: state.session.token,
        shop_data: state.shop.shop_data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetNewsEventCategory: () => dispatch(GetNewsEventCategoryAction()),
        RegisterNewsEvent: (data) => dispatch(RegisterNewsEventAction(data)),
        UpdateNewsEvent: (data) => dispatch(UpdateNewsEventAction(data)),
        GetNewsEvent: (data) => dispatch(GetNewsEventAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterNewsOrEventScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },

    body: {
        flex: 1,
        marginHorizontal: 20,
    },

    serviceTime: {
        flexDirection: "row",
        alignItems: "center"
    },
    addTimeBtn: {
        borderRadius: 100,
        borderColor: theme.grey1,
        borderWidth: 0.5,
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    characterCountCheck: {
        color: theme.grey1,
        fontSize: theme.font14,
    },
    addMenu: {
        fontSize: theme.font14,
        paddingHorizontal: 4
    },
    title: {
        color: theme.black,
        fontSize: theme.fontLarge,
        textAlign: 'center'
    },
    inputWrapper: {
        flexDirection: "row",
        width: "100%",
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5,
        alignItems: "center"
    },
    input: {
        paddingHorizontal: 10,
        textAlign: "right",
        fontSize: theme.font14
    },
    menuDescription: {
        color: theme.grey1,
        fontSize: theme.font12
    },
    unit: {
        fontSize: theme.font14
    },
    verificationMethodWrapper: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',

    },
    mobileVeifyWrapper: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: theme.white,
        borderColor: theme.primary,
        borderWidth: 1,
    },
    mobileVeify: {
        color: theme.grey1,
        fontSize: theme.font14,
    },
    leftRadius: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    rightRadius: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    textverify: {
        fontSize: theme.font14,
        fontWeight: 'bold'
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
    },
    modal: {
        width: '80%',
        backgroundColor: '#fff',
        zIndex: 10,
        paddingBottom: 30,
    },
    btnLogin: {
        borderRadius: 2,
        backgroundColor: theme.primary,
        justifyContent: 'center',
        paddingVertical: 14,
        marginHorizontal: 40
    },
    modalText: {
        textAlign: "center",
        paddingHorizontal: 40,
        fontSize: theme.fontMedium,
        color: theme.black
    },
    placeholder: {
        fontSize: theme.font14,
        color: theme.grey1
    },
    dropDownPickerStyle: {
        marginTop: 10,
        height: 50,
        width: "100%",
        borderWidth: 0
    },
    labelStyle: {
        fontSize: theme.font14,
        textAlign: 'left',
        color: theme.black
    },
    businessImage: {
        marginTop: 20,
        width: "100%",
        height: 200,
        backgroundColor: theme.grey0
    },
    textBase: {
        color: theme.black,
        fontSize: theme.font14,
        paddingLeft: 5
    },
    imgwrapper: {
        flex: 1,
        borderRadius: 4,
        borderColor: theme.grey2,
        borderWidth: 1,
        width: "100%",
        aspectRatio: 1,
        marginHorizontal: 3,
        alignItems: "center",
        justifyContent: 'center'
    },
    imgwrapper2: {
        flex: 1,
        backgroundColor: theme.minigrey,
        borderRadius: 4,
        width: "100%",
        aspectRatio: 1,
        marginHorizontal: 3,
        alignItems: "center",
        justifyContent: 'center'
    },
    img_inner: {
        width: "60%",
        height: "60%",
        resizeMode: "contain"
    },
    img_full: {
        width: "100%",
        height: "100%",
        resizeMode: "stretch"
    },
    startDate: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5
    },
    keywordWrapper: {
        borderRadius: 100,
        minWidth: 85,
        height: 40,
        justifyContent: "center",
        backgroundColor: theme.primary,
        borderColor: theme.primary,
        borderWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    keywordInput: {
        borderRadius: 100,
        minWidth: 85,
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 2,
        zIndex: 10
    },
    minusButton: {
        margin: 2,
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'flex-end',
        backgroundColor: theme.primary,
        borderRadius: 20,
        width: 25,
        height: 15
    },
    categoryTypeWrapper: {
        marginTop: 20,
        ...(Platform.OS !== 'android' && {
            zIndex: 10
        })
    },
});
