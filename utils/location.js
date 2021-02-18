import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Linking, PermissionsAndroid, Platform} from "react-native";
import RNGeolocation from "@react-native-community/geolocation";
import RNSettings from "react-native-settings";
import { getAddressByLocationForKakao } from "./global";
import {isEmptyCheck} from "./regex";

export const defaultLocationData = {
    id: 8597536,
    place_name: 'AK플라자 분당점',
    address_name: '경기 성남시 분당구 서현동 263',
    simple_address_name: '서현동',
    road_address_name: '경기 성남시 분당구 황새울로360번길 42',
    region_name: '성남시 분당구',
    x: 127.1209764,
    y: 37.3850076,
    longitude: 127.1209764,
    latitude: 37.3850076,
};

export const getCurrentLocationData = async () => {
    const id = await AsyncStorage.getItem('mama_address_id', '');
    const latitude = await AsyncStorage.getItem('mama_latitude', '');
    const longitude = await AsyncStorage.getItem('mama_longitude', '');
    const place_name = await AsyncStorage.getItem('mama_place_name', '');
    const address_name = await AsyncStorage.getItem('mama_address_name', '');
    const simple_address_name = await AsyncStorage.getItem('mama_simple_address_name', '');
    const road_address_name = await AsyncStorage.getItem('mama_road_address_name', '');
    const region_name = await AsyncStorage.getItem('mama_region_name', '');

    return new Promise(resolve => resolve({
        id,
        place_name,
        address_name,
        simple_address_name,
        road_address_name,
        longitude,
        latitude,
        region_name
    }));
}

export const setCurrentLocationData = async (data) => {
    // console.log(`setCurrentLocationData: ${JSON.stringify(data)}`);
    let latitude = '';
    let longitude = '';
    if (data.hasOwnProperty('x')) {
        latitude = data?.y;
        longitude = data?.x;
    }
    else {
        latitude = data?.latitude;
        longitude = data?.longitude;
    }

    let simple_address_name = data.address_name.split(' ', 5);
    switch (simple_address_name[0]) {
        case '서울':
        case '인천':
            simple_address_name = `${simple_address_name[2]}`;
            break;
        case '경기':
            simple_address_name = `${simple_address_name[3]}`;
            break;
        default:
            simple_address_name = `${simple_address_name[2]}`;
            break;
    }


    await AsyncStorage.setItem('mama_address_id', data.id.toString());
    await AsyncStorage.setItem('mama_latitude', latitude.toString() );
    await AsyncStorage.setItem('mama_longitude', longitude.toString());
    await AsyncStorage.setItem('mama_place_name', data.place_name.toString());
    await AsyncStorage.setItem('mama_address_name', data.address_name.toString());
    await AsyncStorage.setItem('mama_simple_address_name', simple_address_name.toString());
    await AsyncStorage.setItem('mama_road_address_name', data.road_address_name.toString());
    await AsyncStorage.setItem('mama_region_name', data.region_name.toString());

    return new Promise(resolve => resolve({
        id: data.id,
        place_name: data.place_name,
        address_name: data.address_name,
        region_name: data.region_name,
        simple_address_name,
        road_address_name: data.road_address_name,
        longitude,
        latitude
    }));
}

export const processLocationData = async (latitude, longitude) => {
    const addressResult = await convertCoordsToAddress(latitude, longitude);
    console.log(`addressResult: ${JSON.stringify(addressResult)}`);

    return await setCurrentLocationData(addressResult);
}

export const processAddressData = async (addressData) => {
    console.log(`addressData: ${JSON.stringify(addressData)}`);

    addressData = addressData?.documents[0];
    let address_name = '';
    let road_address_name = '';
    let latitude = addressData?.y;
    let longitude = addressData?.x;
    let region_name = addressData?.address?.region_2depth_name;

    if (region_name === '') {
        region_name = addressData?.address?.region_3depth_name;
    }

    if (addressData?.road_address !== null) {
        road_address_name = addressData?.road_address?.address_name;
        region_name = addressData?.road_address?.region_2depth_name;
    }

    if (addressData?.address !== null) {
        address_name = addressData?.address?.address_name;
        region_name = addressData?.address?.region_2depth_name;
    }

    if (address_name !== '' || road_address_name !== '') {
        return await setCurrentLocationData({
            id: 0,
            place_name: '',
            address_name,
            road_address_name,
            longitude,
            latitude,
            region_name
        })
    }
    else {
        return defaultLocationData;
    }
}

const requestLocationForAndroid = async (callback) => {
    // 최근 위치 setting, Onboard 이동
    const locationResult = await getCurrentLocation();
    // console.log(`locationResult: ${JSON.stringify(locationResult)}`);
    const {errorCode} = locationResult;
    let tempData = await getCurrentLocationData();

    if (!errorCode) {
        let location = await processLocationData(locationResult.coords.latitude, locationResult.coords.longitude);

        callback(location);
    } else {
        callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
    }
}

const requestLocationForIOS = async (callback) => {
    // 최근 위치 setting, Onboard 이동
    const locationResult = await getCurrentLocation();
    const {errorCode} = locationResult;
    // console.log(`locationResult: ${JSON.stringify(locationResult)}`);
    let tempData = await getCurrentLocationData();

    if (!errorCode) {
        let location = await processLocationData(locationResult.coords.latitude, locationResult.coords.longitude);

        callback(location);
    } else {
        // 아이폰
        if (locationResult.PERMISSION_DENIED === 1) {
            if (await showLocationServiceRequestAlert(
                '마마',
                '가게 검색을 위해 위치 정보 및 정확한 위치를 허용해주세요.\n(허용 클릭 > 위치 정보 허용 > 정확한 위치: 켬)',
                '허용',
                '허용 안함'
            )) {
                // 위치 서비스 설정 화면으로 이동
                // react-native-settings not supported
                await Linking.openURL('app-settings:');
                callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
            }
            else {
                // default value setting, Onboard 이동
                callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
            }
        }
        else {
            // default value setting, Onboard 이동
            callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
        }
    }
}

const getLocationPermissionForAndroid = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            // {
            //     title: "마마 위치 권한 허용",
            //     message: "마마는 가게 검색을 위해 위치접근권한이 필요합니다.",
            //     // buttonNeutral: "Ask Me Later",
            //     buttonNegative: "아니요",
            //     buttonPositive: "예"
            // }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        return false;
    }
};

const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
        RNGeolocation.getCurrentPosition(
            position => resolve({errorCode: 0, ...position}),
            error => resolve({errorCode: 1, ...error}),
            {enableHighAccuracy: false, timeout: 50000, maximumAge: 3000}
        );
    });
}

export const getLocationServiceSettings = async () => {
    return await RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => result === RNSettings.ENABLED);
}

export const openLocationServiceSettings = async () => {
    return await RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).then(result => result === RNSettings.ENABLED);
}

export const showLocationServiceRequestAlert = (
    title,
    message,
    textOK,
    textCancel
) =>
    new Promise(resolve => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: textCancel,
                    onPress: () => {
                        resolve(false);
                    },
                    style: "cancel"
                },
                {
                    text: textOK,
                    onPress: async () => {
                        resolve(true);
                    }
                }
            ],
            {cancelable: true}
        );
    });

export const convertCoordsToAddress = async (latitude, longitude) => {
    // console.log(latitude, longitude);
    return await getAddressByLocationForKakao(latitude, longitude).then(async result => {
        // console.log(JSON.stringify(result));

        let address_name = '';
        let road_address_name = '';
        let addressData = result?.documents[0];
        let region_name = addressData?.address?.region_2depth_name;

        if (addressData?.road_address !== null) {
            road_address_name = addressData?.road_address?.address_name;
            region_name = addressData?.road_address?.region_2depth_name;
        }

        if (addressData?.address !== null) {
            address_name = addressData?.address?.address_name;
            region_name = addressData?.address?.region_2depth_name;
        }

        if (address_name !== '' || road_address_name !== '') {
            return {
                id: 0,
                place_name: '',
                address_name,
                road_address_name,
                longitude,
                latitude,
                region_name
            }
        }
        else {
            return defaultLocationData;
        }
    }).catch(err => {
        console.log(err);
        return defaultLocationData
    });
}

export const requestLocation = async (callback) => {
    let tempData = await getCurrentLocationData();

    if (Platform.OS === 'android') {
        // 안드로이드
        // 위치 권한 허용 여부 확인
        const isLocationPermission = await getLocationPermissionForAndroid();

        if (isLocationPermission) {
            // 위치 권한 허용
            // 위치 서비스 on 여부 확인
            const isLocationServiceSettings = await getLocationServiceSettings();

            if (isLocationServiceSettings) {
                await requestLocationForAndroid(callback);
            }
            else {
                if (await showLocationServiceRequestAlert(
                    '',
                    "더 나은 사용 환경을 위해 Google 위치 서비스를 사용하는 기기 위치 기능을 사용 설정하세요.",
                    '예',
                    '아니요'
                )) {
                    // 위치 서비스 설정 화면으로 이동
                    const isLocationServiceSettings = await openLocationServiceSettings();
                    if (isLocationServiceSettings) {
                        await requestLocationForAndroid(callback);
                    }
                    else {
                        // default value setting, Onboard 이동
                        callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
                    }
                }
                else {
                    // default value setting, Onboard 이동
                    callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
                }
            }
        } else {
            // 위치 권한 거부
            // default value setting, Onboard 이동
            callback(isEmptyCheck(tempData.id) ? defaultLocationData : tempData);
        }
    } else {
        await requestLocationForIOS(callback);
    }
}
