import { API_BASE_URL } from "../../utils/config";

export const getShopInfoByShopId = (action) => {
  const { shop_id, latitude, longitude } = action.sendData
  const url = API_BASE_URL + "shops/" + shop_id + "/" + latitude + "/" + longitude;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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

export const getShopInfo = (action) => {
  const { seller_id, latitude, longitude, token } = action.sendData
  const url = API_BASE_URL + "shops/seller/" + seller_id + "/" + latitude + "/" + longitude;

  return fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
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

export const getBusinessCategory = () => {
  const url = API_BASE_URL + "business_category";
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

export const updateShopInfo = (data) => {
  const url = API_BASE_URL + "shops/" + data.id;

  return fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      Authorization: `Bearer ${data.token}`,
    },
    body: data.data
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return error.message;
  });
};

export const registerShopInfo = (data) => {
  const url = API_BASE_URL + "shops";

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      Authorization: `Bearer ${data.token}`,
    },
    body: data.data
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return error.message;
  });
};

export const updateMarkImage = (data) => {
  const url = API_BASE_URL + "shops/upload/mark/" + data.id;

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      Authorization: `Bearer ${data.token}`,
    },
    body: data.data
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return "error";
  });
};

export const reportToCeo = (data) => {
  const url = API_BASE_URL + "reports";

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
    return error?.message;
  });
};

export const updateBusinessInfo = (data) => {
  const url = API_BASE_URL + "shops/business";

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      Authorization: `Bearer ${data.token}`,
    },
    body: data.data
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return error.message;
  });
};

export const updatePhoneVerification = (data) => {
  const url = API_BASE_URL + "sellers/savePhone";

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
        return error?.message;
      });
};

export const updateEmailVerification = (data) => {
  const url = API_BASE_URL + "sellers/saveEmail";

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
        return error?.message;
      });
};
