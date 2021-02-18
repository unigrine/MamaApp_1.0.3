import AsyncStorage from "@react-native-async-storage/async-storage";
import {isEmptyCheck} from "./regex";

export const getCustomerAuthData = async () => {
    const token = await AsyncStorage.getItem('mama_customer_token', '');
    const social_id = await AsyncStorage.getItem('mama_customer_social_id', '');
    const social_type = await AsyncStorage.getItem('mama_customer_social_type', '');
    // const status = await AsyncStorage.getItem('mama_customer_status', '');
    const customer_id = await AsyncStorage.getItem('mama_customer_id', '');

    return new Promise(resolve => resolve({
        token,
        social_id,
        social_type,
        // status,
        customer_id
    }));
}

export const setCustomerAuthData = async (data) => {
    // console.log(`setCustomerAuthData: ${JSON.stringify(data)}`);

    await AsyncStorage.setItem("mama_customer_token", data.token);
    await AsyncStorage.setItem("mama_customer_social_id", data.social_id);
    await AsyncStorage.setItem("mama_customer_social_type", data.social_type);
    // await AsyncStorage.setItem("mama_customer_status", data.status);
    if (!isEmptyCheck(data?.customer_id)) {
        await AsyncStorage.setItem("mama_customer_id", data.customer_id?.toString());
    }
    await AsyncStorage.setItem("mama_user_type", "customer");

    return new Promise(resolve => resolve({
        token: data.token,
        social_id: data.social_id,
        social_type: data.social_type,
        // status: data.status,
        customer_id: data.customer_id,
        user_type: "customer",
    }));
}

export const getSellerAuthData = async () => {
    const token = await AsyncStorage.getItem('mama_seller_token', '');
    const seller_id = await AsyncStorage.getItem('mama_seller_id', '');
    const password = await AsyncStorage.getItem('mama_seller_pw', '');
    const user_type = await AsyncStorage.getItem('mama_user_type', '');


    return new Promise(resolve => resolve({
        token,
        seller_id,
        password,
        // status,
        user_type
    }));
}

export const setSellerAuthData = async (data) => {
    // console.log(`setCustomerAuthData: ${JSON.stringify(data)}`);

    await AsyncStorage.setItem("mama_seller_token", data.token);
    await AsyncStorage.setItem("mama_seller_id", data.seller_id);
    await AsyncStorage.setItem("mama_seller_pw", data.password?.toString());
    await AsyncStorage.setItem("mama_user_type", "ceo");

    return new Promise(resolve => resolve({
        token: data.token,
        seller_id: data.seller_id,
        password: data.password,
        user_type: "ceo",
    }));
}
