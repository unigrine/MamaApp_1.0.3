// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from "react";
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator} from "react-native";
import {useNavigation, useTheme, TabRouter} from '@react-navigation/native';
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import {CommonStyle} from "../../constants/style";
import Header from "../../component/Header"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RBSheet from "react-native-raw-bottom-sheet";
import {Dropdown} from 'react-native-material-dropdown-v2';
import {connect} from 'react-redux';
import {UpdateShopInfoAction, GetShopInfoAction, RegisterShopInfoAction} from "../../store/Shop/action";
import DatePicker from 'react-native-date-picker';
import moment from "moment"
import {regexNumber, regexPhone} from "../../utils/regex";
import * as globalStyles from "../../constants/style/global";
import {getNumberWithCommas} from "../../utils/text_format";
// import 'moment/locale/ko'
// moment.locale('ko')

const DAYS = [
    {
        value: "평일",
    },
    {
        value: "매일"
    },
    {
        value: "주말"
    },
    {
        value: "공휴일"
    },
    {
        value: "주중"
    },
    {
        value: "월요일",
    },
    {
        value: "화요일",
    },
    {
        value: "수요일",
    },
    {
        value: "목요일",
    },
    {
        value: "금요일",
    },
    {
        value: "토요일",
    },
    {
        value: "일요일",
    },
]

class RegisterShopInfoDetailScreen extends React.Component {

    state = {
        introduceWords: '',
        service_time_list: [],
        phone_number: '',
        isModal: false,
        isChecked: true,
        menu_list: [],
        areaCode: '070',
        isUpdating: false,
        mobileText1: '',
        mobileText2: '',
        mobileText3: '',
        datetime: new Date(),
        date: moment(new Date()).format('YYYY-MM-DD'),
        time: moment(new Date()).format('hh:mm:ss'),
        errorServiceTimeMsg: '',
        errorPhoneNumberMsg: '',
        errorMenuMsg: '',

        selectTime: null,
        timetype: '',
    }

    componentDidMount() {
        this.initShopInfo()
    }

    componentDidUpdate(prevProps, prevState) {
        const {isUpdateLoading} = this.props

        // updating true: 수정하기, false: 등록하기
        if (prevProps.route.params?.updating !== this.props.route.params?.updating) {
            this.setState({isUpdating: this.props.route.params?.updating})  // state 저장
        }
        if (prevProps.isUpdateLoading != isUpdateLoading && isUpdateLoading == false) {
            this.setState({isModal: true})
            this.getShopInfo()  // 내 가게 정보 모두 얻어오기
        }
    }

    getShopInfo = () => {
        const {seller_id, token, location} = this.props

        const latitude = !location ? "" : location.latitude
        const longitude = !location ? "" : location.longitude

        const data = {seller_id, latitude, longitude, token}

        this.props.GetShopInfo(data)
    }

    initShopInfo() {
        const {shop_data} = this.props
        const isUpdating = (shop_data == null || shop_data?.id == "") ? false : true

        let service_time_list = []
        Array.isArray(shop_data?.running_time) && shop_data?.running_time?.map((item, index) => {
            let days = item.work_time?.split(' ')[0]
            let time1 = ""
            let time2 = ""
            let otherwords = ""

            let afterwords = item.work_time?.substring(days.length + 1,)
            if (afterwords[6] == "-") { // 11:00-16:00 브레이크타임
                time1 = afterwords?.substring(0, 5)
                time2 = afterwords?.substring(8, 13)
                try {
                    otherwords = afterwords?.substring(14, afterwords.length)
                } catch {
                    otherwords = ""
                }
            } else {  // 휴무
                otherwords = afterwords
            }

            const service_time = {
                id: index,
                checked: true,
                days: days,  // value
                time1: time1,   // value
                time2: time2,   // value
                time: time2,
                otherwords: otherwords   // value
            }
            service_time_list.push(service_time)
        })

        if (service_time_list.length < 1) { // 영업시간이 텅 비었으면 적어도 1개 빈 항목 추가
            const service_time = {
                id: 0,
                checked: false,
                days: '매일',  // value
                time1: "",   // value
                time2: "",   // value
                time: "",
                otherwords: ""   // value
            }
            service_time_list.push(service_time)
        }

        // 전화번호 초기화

        let phone_number = shop_data?.phone

        let menu_list = []
        Array.isArray(shop_data?.menu) && shop_data?.menu?.map((item, index) => {
            const menu = {
                id: index,
                checked: true,
                name: item.menu_name,  // text
                price: item.menu_price  // number
            }
            menu_list.push(menu)
        })
        if (menu_list.length < 1) {  // 메뉴가 텅 비였으면 적어도 1개 빈 항목 추가
            const menu = {
                id: 0,
                checked: false,
                name: "",  // text
                price: ""   // number
            }
            menu_list.push(menu)
        }

        if (isUpdating)  // 업데이트이면 이미 있는 가게정보 모두 현시
            this.setState({
                introduceWords: shop_data?.introduce_text ? shop_data?.introduce_text : "",
                service_time_list, menu_list, phone_number,
            })
        else {  // 새로 추가이면. 영업시간. 메뉴 빈것만 한개씩 추가하고 나머지는 빈 문자열
            this.setState({service_time_list, menu_list})
        }
    }

    onChangeDateTime = (event, selectedDate) => {
        const {selectTime, timetype, service_time_list} = this.state

        let time = moment(event).format('HH:mm');

        let new_service_time_list = []
        service_time_list?.map(item => {
            if (item.id !== selectTime?.id) {
                new_service_time_list.push(item)
            } else {
                let service_time = {
                    ...item,
                    time: time,
                }

                if (timetype === "time1") {
                    service_time = {
                        ...item,
                        time1: time,
                    }
                } else if (timetype === "time2") {
                    service_time = {
                        ...item,
                        time2: time,
                    }
                }

                new_service_time_list.push(service_time)
            }
        })

        this.setState({service_time_list: new_service_time_list, errorServiceTimeMsg: ''})
    }

    onChangeIntroduceText(text) {
        this.setState({introduceWords: text})
    }

    onPressRegister() {
        const {introduceWords, service_time_list, phone_number, menu_list} = this.state
        const {shop_data, token, seller_id} = this.props
        let isCheck = true;

        // 영업시간
        let running_time = []
        service_time_list.map((item, index) => {
            // if (item.checked === false) return

            if (item.time1 === '' && item.time2 === '') {
                if (index === 0) {
                    return;
                }
            }
            else if (item.time1 === '' || item.time2 === '') {
                this.setState({errorServiceTimeMsg: language.PLEASE_INPUT_SERVICE_TIME});
                isCheck = false;
                return;
            }

            let newItem = {
                work_time: item.days + " " + item.time1 + " - " + item.time2 + " " + item.otherwords
            }

            if (item.time1 === "" && item.time2 === "") { // 시간이 없으면, 비고내용만
                newItem = {
                    work_time: item.days + " " + item.otherwords
                }
            }

            running_time.push(newItem)
        })

        // 전화번호
        if (phone_number !== '') {
            if (!regexPhone(phone_number)) {
                this.setState({errorPhoneNumberMsg: language.INPUT_AGAIN_TEL_NUMBER});
                return
            }
        }


        // 메뉴
        let menu = []
        menu_list.map((item, index) => {
            // if (item.checked === false) return
            let name = item.name
            let price = item.price

            if (name === '' && price === '') {
                if (index === 0) {
                    return;
                }
            }
            else if (name === '' || price === '') {
                this.setState({errorMenuMsg: language.PLEASE_INPUT_MENU});
                isCheck = false;
                return;
            } else {

            }

            if (name.replace(' ', '') == "" && price.replace(' ', '') == "") return

            if (regexNumber(price)) {
                price = getNumberWithCommas(parseInt(price)) + "원";
            }

            let newItem = {
                menu_name: name,
                menu_price: price
            }
            menu.push(newItem)
        })

        if (!isCheck) {
            return;
        }

        let data = new FormData();
        data.append('introduce_image', "")
        data.append('introduce_text', introduceWords)
        data.append('running_time', JSON.stringify(running_time))
        data.append('phone', phone_number)
        data.append('menu', JSON.stringify(menu))

        if (shop_data == null || shop_data?.id == "") { // register {
            let sendData = {
                token,
                data
            }
            this.props.RegisterShopInfo(sendData)
        } else {
            let sendData = {
                id: shop_data?.id,
                token,
                data
            }
            this.props.UpdateShopInfo(sendData)
        }
    }

    onPressModalOk() {
        this.setState({isModal: false});
        this.props.navigation.goBack();
    }

    onPressAddServiceTime() {
        const {service_time_list} = this.state;

        if (service_time_list.length === 10) {
            // 영업시간 추가개수 제한
            this.setState({errorServiceTimeMsg: language.MAX_SERVICE_TIME});
            return
        }

        const isEmpty = service_time_list.filter(item => item?.time1 === '' || item?.time2 === '').length > 0;

        if (isEmpty) {
            this.setState({errorServiceTimeMsg: language.PLEASE_INPUT_SERVICE_TIME});
            return
        }

        const service_time = {
            id: service_time_list.length,
            checked: true,
            days: '매일',  // value
            time1: "",   // value
            time2: "",   // value
            time: "",
            otherwords: ""   // value
        }

        service_time_list.push(service_time)
        this.setState({service_time_list, errorServiceTimeMsg: ''})
    }

    onPressAddMenu() {
        const {menu_list} = this.state;

        if (menu_list.length === 10) {
            // 메뉴 추가개수 제한
            this.setState({errorMenuMsg: language.MAX_10_MENU});
            return
        }

        const isEmpty = menu_list.filter(item => !item?.checked).length > 0;

        if (isEmpty) {
            this.setState({errorMenuMsg: language.PLEASE_INPUT_MENU});
            return
        }

        const menu = {
            id: menu_list.length,
            checked: false,
            name: "",  // text
            price: ""   // number
        }

        menu_list.push(menu)
        this.setState({menu_list, errorMenuMsg: ''})
    }

    showDatepicker1(selItem) {
        this.setState({selectTime: selItem, timetype: "time1"})
        this.RBSheet.open()
    }

    showDatepicker2(selItem) {
        this.setState({selectTime: selItem, timetype: "time2"})
        this.RBSheet.open()
    }

    onChangeServiceDays(selItem, days) {
        const {service_time_list} = this.state
        let new_service_time_list = []
        service_time_list.map(item => {
            if (item.id != selItem.id) {
                new_service_time_list.push(item)
            } else {
                const service_time = {
                    ...item,
                    days: days,
                    // checked: checked,
                }
                new_service_time_list.push(service_time)
            }
        })

        this.setState({service_time_list: new_service_time_list})
    }

    onChangeServiceOther(selItem, text) {
        const {service_time_list} = this.state
        let new_service_time_list = []
        service_time_list.map(item => {
            if (item.id != selItem.id) {
                new_service_time_list.push(item)
            } else {
                const service_time = {
                    ...item,
                    otherwords: text,
                }
                new_service_time_list.push(service_time)
            }
        })

        this.setState({service_time_list: new_service_time_list})
    }

    onPressDeleteServiceTime(selItem) {
        const {service_time_list} = this.state
        let new_service_time_list = []
        let index = 0
        service_time_list.map((item) => {
            if (item.id !== selItem.id) {
                const service_time = {
                    ...item,
                    id: index++,
                }
                new_service_time_list.push(service_time)
            }
        })

        if (service_time_list.length < 2) {
            return
        }

        this.setState({service_time_list: new_service_time_list, errorServiceTimeMsg: ''})
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

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''});
    }

    onChangeMenuPrice(selItem, text) {
        const {menu_list} = this.state
        let new_menu_list = []
        menu_list.map(item => {
            if (item.id != selItem.id) {
                new_menu_list.push(item)
            } else {
                let checked = false
                if (item.price !== "")   // 메뉴가 이미 설정되었으면. 가격은 지금 설정하는거고
                    checked = true      // true이면  +메뉴 추가하기 활성화

                const menu = {
                    ...item,
                    price: text,
                    checked: checked,
                }
                new_menu_list.push(menu)
            }
        })

        this.setState({menu_list: new_menu_list, errorMenuMsg: ''});
    }

    onChangeMobileText1(text) {
        const {mobileText1, mobileText2, mobileText3} = this.state
        const currentValue = text.replace(/[^\d]/g, '');
        this.setState({phone_number: currentValue})
    }

    Modal() {
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
                            {this.props.route.params?.updating ? language.UPDATE_SHOP_DETAIL_INFO : language.REGISTERED_SHOP_DETAIL_INFO}
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
        const {isChecked, shop_data} = this.state

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
                        {this.props.route.params?.updating ?
                            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                {language.FINISH}
                            </Text>
                            :
                            <Text style={{textAlign: "center", fontSize: 16, color: theme.white, fontWeight: 'bold'}}>
                                {language.REGISTER}
                            </Text>

                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    IntroduceView() {
        const {introduceWords} = this.state

        return (
            <View style={CommonStyle.inputWrapper}>
                <Text style={styles.itemTitle}>
                    {language.INTRODUCE}
                </Text>

                <View style={CommonStyle.row_sb}>
                    <View style={{flex: 9}}>
                        <TextInput
                            style={[CommonStyle.input, CommonStyle.mt_10_ios]}
                            autoCapitalize="none"
                            multiline
                            maxLength={200}
                            value={introduceWords}
                            placeholder={language.INPUT_HERE}
                            onChangeText={(text) => this.onChangeIntroduceText(text)}
                        />
                    </View>
                    <View style={{flex: 1, alignSelf: "flex-end", paddingBottom: 5}}>
                        <Text style={{fontSize: theme.fontSmall, color: theme.grey1}}>
                            {introduceWords.length > 200 ? 200 : introduceWords.length}/200
                        </Text>
                    </View>

                </View>
            </View>
        )
    }

    ServiceTimeView() {
        const {service_time_list} = this.state

        return (
            <View style={{marginTop: 20}}>
                <View style={styles.formLabel}>
                    <Text style={styles.itemTitle}>
                        {language.SERVICE_TIME}
                    </Text>
                    <TouchableOpacity style={styles.addTimeBtn} onPress={() => this.onPressAddServiceTime()}>
                        <Text style={styles.textGeneral}>
                            {language.ADD_SERVICE_TIME}
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    service_time_list.map((item, idx) => {
                        return (
                            <View key={`${idx}`} style={{
                                position: 'relative',
                                borderColor: theme.grey1,
                                borderWidth: 0.5,
                                marginTop: 10
                            }}>
                                <View style={{width: "100%", flexDirection: "row"}}>
                                    <View style={{
                                        width: 80,
                                        marginRight: 10,
                                        borderBottomColor: theme.grey1,
                                        borderBottomWidth: 0.5,
                                        backgroundColor: "white"
                                    }}>
                                        {item.days != '0' ?
                                            <Dropdown
                                                underlineColor='transparent'
                                                data={DAYS}
                                                // label='요일'
                                                value={item.days}
                                                dropdownOffset={{top: 0, left: 0}}
                                                itemPadding={8}
                                                labelStyle={{color: theme.grey1}}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    paddingVertical: 12,
                                                    fontSize: theme.font14,
                                                    color: theme.red
                                                }}
                                                containerStyle={{marginBottom: -20, marginTop: -20}}
                                                itemStyle={{paddingLeft: 20}}
                                                onChangeText={days => this.onChangeServiceDays(item, days)}
                                                // itemTextStyle={{backgroundColor:"blue",textColor:"white"}}
                                            /> :
                                            <Dropdown
                                                underlineColor='transparent'
                                                data={DAYS}
                                                label='요일'
                                                // value={item.days}
                                                dropdownOffset={{top: 0, left: 0}}
                                                itemPadding={8}
                                                labelStyle={{color: theme.grey1}}
                                                style={{
                                                    backgroundColor: "transparent",
                                                    paddingVertical: 12,
                                                    fontSize: theme.font14,
                                                    color: theme.red
                                                }}
                                                containerStyle={{marginBottom: -20, marginTop: -20}}
                                                itemStyle={{paddingLeft: 20}}
                                                onChangeText={days => this.onChangeServiceDays(item, days)}
                                                // itemTextStyle={{backgroundColor:"blue",textColor:"white"}}
                                            />
                                        }
                                    </View>
                                    <View style={[CommonStyle.inputWrapper, {marginTop: 0}]}>
                                        <TouchableOpacity style={{paddingTop: 14}}
                                                          onPress={() => this.showDatepicker1(item)}>
                                            {item.time1 != "" ?
                                                <Text style={[CommonStyle.input, {
                                                    textAlign: "center",
                                                    color: theme.black
                                                }]}>{item.time1}</Text>
                                                :
                                                <Text style={[CommonStyle.input, {
                                                    textAlign: "center",
                                                    color: theme.grey1
                                                }]}>{"시간 선택"}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[CommonStyle.inputWrapper, {marginTop: 0}]}>
                                        <View style={{paddingTop: 14}}>
                                            <Text style={[CommonStyle.input, {textAlign: "center"}]}> {"-"}</Text>
                                        </View>
                                    </View>
                                    <View style={[CommonStyle.inputWrapper, {marginTop: 0}]}>
                                        <TouchableOpacity style={{paddingTop: 14}}
                                                          onPress={() => this.showDatepicker2(item)}>
                                            {item.time2 != "" ?
                                                <Text style={[CommonStyle.input, {
                                                    textAlign: "center",
                                                    color: theme.black
                                                }]}>{item.time2}</Text>
                                                :
                                                <Text style={[CommonStyle.input, {
                                                    textAlign: "center",
                                                    color: theme.grey1
                                                }]}>{"시간 선택"}</Text>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{flex: 1}}>
                                    <View style={[CommonStyle.inputWrapper, {marginTop: 0}]}>
                                        <View style={CommonStyle.row_sb}>
                                            <TextInput
                                                style={[CommonStyle.input]}
                                                autoCapitalize="none"
                                                maxLength={30}
                                                value={item.otherwords}
                                                placeholder={"예) 1월 1일에만 휴무 (최대 30자)"}
                                                onChangeText={text => this.onChangeServiceOther(item, text)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.minusButton}
                                                  onPress={() => this.onPressDeleteServiceTime(item)}>
                                    <Icon name={"minus"} size={12} color={theme.white}/>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
                {this.state.errorServiceTimeMsg.length > 0 ?
                    <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorServiceTimeMsg}</Text> : null}
            </View>
        )
    }

    MobileNumberView() {
        const {phone_number} = this.state
        return (
            <View style={{marginTop: 20}}>
                <View style={styles.formLabel}>
                    <Text style={styles.itemTitle}>
                        {language.TEL_NUMBER}
                    </Text>
                </View>
                <View style={[CommonStyle.row, {paddingTop: 10}]}>
                    <View style={{height: 40, width: 180, borderColor: theme.grey1, borderWidth: 0.5}}>
                        <TextInput
                            style={[CommonStyle.input]}
                            autoCapitalize="none"
                            keyboardType={'phone-pad'}
                            maxLength={12}
                            value={phone_number}
                            onChangeText={text => this.onChangeMobileText1(text)}
                        />
                    </View>
                    {/* <View style={{height: 40}}>
            <TextInput
                editable={true}
                style={[CommonStyle.input, {textAlign: "center", paddingHorizontal: 0}]}
                autoCapitalize="none"
                keyboardType={'phone-pad'}
                value={"-"}
            />
          </View>
          <View style={{height: 40, width: 60, borderColor: theme.grey1, borderWidth: 0.5}}>
            <TextInput
                style={[CommonStyle.input, {textAlign: "center"}]}
                autoCapitalize="none"
                keyboardType={'phone-pad'}
                maxLength={4}
                value={mobileText2}
                onChangeText={text=> this.onChangeMobileText2(text)}
            />
          </View>
          <View style={{height: 40}}>
            <TextInput
                editable={true}
                style={[CommonStyle.input, {textAlign: "center", paddingHorizontal: 0}]}
                autoCapitalize="none"
                keyboardType={'phone-pad'}
                value={"-"}
            />
          </View> */}
                    {/* <View style={{height: 40, width: 60, borderColor: theme.grey1, borderWidth: 0.5}}>
            <TextInput
                style={[CommonStyle.input, {textAlign: "center"}]}
                autoCapitalize="none"
                keyboardType={'phone-pad'}
                maxLength={4}
                value={mobileText3}
                onChangeText={text=> this.onChangeMobileText3(text)}
            />
          </View>
          <View style={{height: 40, paddingLeft: 10}}>
            <TextInput
                style={[CommonStyle.input, {textAlign: "center"}]}
                editable={false}
                autoCapitalize="none"
                keyboardType={'phone-pad'}
                value={phone_number}
                onChangeText={text=> this.onChangeMobileText3(text)}
            />
          </View> */}
                </View>
                {this.state.errorPhoneNumberMsg.length > 0 ?
                    <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorPhoneNumberMsg}</Text> : null}
            </View>
        )
    }

    MenuView() {
        const {menu_list} = this.state
        return (
            <View style={{marginTop: 20}}>
                <View style={styles.formLabel}>
                    <Text style={styles.itemTitle}>
                        {language.MENU}
                    </Text>
                    <TouchableOpacity style={styles.addTimeBtn} onPress={() => this.onPressAddMenu()}>
                        <Text style={styles.textGeneral}>
                            {language.ADD_MENU}
                        </Text>
                    </TouchableOpacity>
                </View>

                {
                    menu_list.map((item, idx) => {
                        return (
                            <View key={`${idx}`}>
                                <View style={[CommonStyle.row, {justifyContent: "space-between"}]}>
                                    <View style={[styles.inputWrapper, {flex: 3, marginRight: 5}]}>
                                        <TextInput
                                            style={[CommonStyle.input]}
                                            autoCapitalize="none"
                                            maxLength={30}
                                            value={item.name}
                                            placeholder={language.MENU_NAME}
                                            onChangeText={text => this.onChangeMenuName(item, text)}
                                        />
                                    </View>
                                    <View style={[styles.inputWrapper, {flex: 3, marginLeft: 5,}]}>
                                        <View style={CommonStyle.row_sb}>
                                            <View style={{flex: 1}}>
                                                <TextInput
                                                    style={styles.input}
                                                    autoCapitalize="none"
                                                    maxLength={12}
                                                    value={item.price}
                                                    placeholder={language.PRICE}
                                                    onChangeText={text => this.onChangeMenuPrice(item, text)}
                                                />
                                            </View>
                                            {/*<Text style={styles.unit}>원</Text>*/}
                                        </View>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <TouchableOpacity style={styles.minusButton}
                                                          onPress={() => this.onPressDeleteMenu(item)}>
                                            <Icon name={"minus"} size={12} color={theme.white}/>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
                {this.state.errorMenuMsg.length > 0 ?
                    <Text style={globalStyles.GLOBAL_STYLES.errorText}>{this.state.errorMenuMsg}</Text> : null}
                <View style={{height: 100}}/>
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
                // height={200}
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
                    <TouchableOpacity style={{position: "absolute", top: 40, right: 30}}
                                      onPress={() => this.RBSheet.close()}>
                        <Text style={{fontSize: theme.fontMedium}}>닫기</Text>
                    </TouchableOpacity>
                    <View style={{marginTop: 30, alignItems: "center"}}>
                        <DatePicker
                            mode="time"
                            date={this.state.datetime}
                            onDateChange={this.onChangeDateTime}
                        />
                    </View>
                </View>
            </RBSheet>
        )
    }

    render() {
        const {isModal} = this.state
        const {isUpdateLoading, shop_data} = this.props
        const title = (shop_data == null || shop_data?.id == "") ? language.DETAIL_INFO_REGISTERATION : language.DETAIL_INFO_UPDATING

        return (
            <View style={styles.container}>
                <GeneralStatusBarColor backgroundColor={theme.white}
                                       hidden={true}
                                       barStyle={'light-content'}
                />

                <Header leftIcon="angle-left" title={title} navigation={this.props.navigation}/>

                {isUpdateLoading &&
                <ActivityIndicator style={styles.spinnerStyle} animating={isUpdateLoading} size="large"
                                   color={theme.primary}/>
                }

                <ScrollView style={styles.body}
                            showsVerticalScrollIndicator={false}
                >
                    {this.IntroduceView()}
                    {this.ServiceTimeView()}
                    {this.MobileNumberView()}
                    {this.MenuView()}
                </ScrollView>

                {this.bottomView()}
                {isModal && this.Modal()}
                {this.BottomSheet()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        seller_id: state.session.seller_id,
        token: state.session.token,
        location: state.userstatus.location,
        isLoading: state.shop.isLoading,
        shop_data: state.shop.shop_data,
        isUpdateLoading: state.shop.isUpdateLoading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetShopInfo: (data) => dispatch(GetShopInfoAction(data)),
        UpdateShopInfo: (data) => dispatch(UpdateShopInfoAction(data)),
        RegisterShopInfo: (data) => dispatch(RegisterShopInfoAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterShopInfoDetailScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
    },

    body: {
        flex: 1,
        marginHorizontal: 20,
    },

    formLabel: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    addTimeBtn: {
        borderRadius: 100,
        borderColor: theme.grey1,
        borderWidth: 0.5,
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    itemTitle: {
        fontSize: theme.font14,
        fontWeight: 'bold'
    },
    characterCountCheck: {
        color: theme.grey1,
        fontSize: theme.font14,
    },
    textGeneral: {
        fontSize: theme.font14,
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
        fontSize: theme.font18,
        color: theme.black
    },

    placeholder: {
        fontSize: theme.font14,
        color: theme.grey1
    },
    dropDownPickerStyle: {
        marginTop: 10,
        height: 50,
        width: "50%",
        borderWidth: 0,
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
    detailTerms: {
        color: theme.grey1,
        fontSize: theme.fontSmall
    },
    errText: {
        color: theme.red,
        fontSize: theme.fontSmall
    },
    spinnerStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        justifyContent: "center",
    },
    unit: {
        fontSize: theme.font14
    },
    minusButton: {
        position: "absolute",
        margin: 2,
        alignItems: "center",
        justifyContent: 'center',
        alignSelf: 'flex-end',
        bottom: 2,
        right: 2,
        backgroundColor: theme.grey0,
        borderRadius: 20,
        width: 25,
        height: 15
    }
});
