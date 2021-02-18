import { API_BASE_URL } from "../../utils/config";

export const getNewsEvents = (data) => {
  const url = API_BASE_URL + "shops"
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

export const getFavoriteNewsEvents = (data) => {
  const url = API_BASE_URL + "shops/favorite"
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
