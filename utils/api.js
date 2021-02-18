import {API_BASE_URL, ONESIGNAL_KEY} from "./config";

export const checkDuplicatedId = (seller_id) => {
    const url = API_BASE_URL + "sellers/validate/seller_id/" + seller_id;
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return "error";
        });
};

export const checkDuplicatedShopName = (shopname) => {
    const url = API_BASE_URL + "sellers/validate/shop/" + shopname

    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return "error";
        });
};

export const getOtpCodebyEmail = (email) => {
    const url = API_BASE_URL + "sellers/verification_email/" + email

    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return "error";
        });
};

export const getOtpCodebyEmail2 = (email) => {
    const url = API_BASE_URL + "sellers/find_id/verification_email/" + email

    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return "error";
        });
};

export const getCommentToNewsEvent = (data) => {
    const url = API_BASE_URL + "news_event/comment/" + data.newsId;
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return error;
        });
};

export const sendCommentToNewsEvent = (data) => {
    const url = API_BASE_URL + "news_event/comment";

    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data.data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return error;
        });
};

export const requestVerificationCode = (data) => {
    const url = API_BASE_URL + "sellers/verificationCode";

    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson
        })
        .catch((error) => {
            return error;
        });
};
