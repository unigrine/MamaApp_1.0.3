import AsyncStorage from "@react-native-async-storage/async-storage";
import {isEmptyCheck} from "./regex";
import {getJsonToString, parseJson} from "./data_handler";

export const getNotificationData = async (type = 'MY') => {
    let notification = '';

    try {
        switch (type) {
            case 'MY':
                notification = await AsyncStorage.getItem('mama_my_notification', '');
                break;
            case 'CEO':
                notification = await AsyncStorage.getItem('mama_ceo_notification', '');
                break;
        }

        if (isEmptyCheck(notification)) {
            notification = [];
        }
        else {
            notification = parseJson(notification);
        }
    }
    catch (e) {
        notification = [];
    }

    return new Promise(resolve => resolve(notification));
}

export const setNotificationData = async (type = 'MY', data) => {
    // console.log(`addNotificationData: ${JSON.stringify(data)}`);

    switch (type) {
        case 'MY':
            await AsyncStorage.setItem('mama_my_notification', getJsonToString(data));
            break;
        case 'CEO':
            await AsyncStorage.setItem('mama_ceo_notification', getJsonToString(data));
            break;
    }

    return new Promise(resolve => resolve(data));
}

export const addNotificationData = async (type = 'MY', data) => {
    // console.log(`addNotificationData: ${JSON.stringify(data)}`);

    let prevNotification = '';
    let notification = [];

    prevNotification = await getNotificationData(type);
    notification = [{...data}, ...prevNotification];

    switch (type) {
        case 'MY':
            await AsyncStorage.setItem('mama_my_notification', getJsonToString(notification));
            break;
        case 'CEO':
            await AsyncStorage.setItem('mama_ceo_notification', getJsonToString(notification));
            break;
    }

    return new Promise(resolve => resolve(notification));
}

export const inspectReadNotificationData = async (type = 'MY') => {
    // console.log(`inspectReadNotificationData: ${JSON.stringify(data)}`);

    let notification = await getNotificationData(type);
    let isRead = true;

    if (!isEmptyCheck(notification)) {
        notification = parseJson(notification);
        notification = notification.filter(item => !item.check);

        if (notification.length > 0) {
            isRead = false;
        }
    }

    return new Promise(resolve => resolve(isRead));
}

export const setReadNotificationData = async (type = 'MY') => {
    // console.log(`addNotificationData: ${JSON.stringify(data)}`);

    let notification = await getNotificationData(type);
    let newNotification = [];

    if (!isEmptyCheck(notification)) {
        notification = parseJson(notification);
        await notification.map(async item => {
            await newNotification.push({
                ...item,
                check: true
            });
        });
    }

    switch (type) {
        case 'MY':
            await AsyncStorage.setItem('mama_my_notification', getJsonToString(newNotification));
            break;
        case 'CEO':
            await AsyncStorage.setItem('mama_ceo_notification', getJsonToString(newNotification));
            break;
    }

    return new Promise(resolve => resolve(newNotification));
}
