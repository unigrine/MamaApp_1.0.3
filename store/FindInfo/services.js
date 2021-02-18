import { API_BASE_URL } from "../../utils/config";

export const findIdByAddress = (data) => {
  const url = API_BASE_URL + "sellers/find_id/address";

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
    return error.message;
  });
};

export const findIdByEmail = (data) => {
  const url = API_BASE_URL + "sellers/find_id/email";

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
    return error.message;
  });
};

export const findIdByPhone = (data) => {
  const url = API_BASE_URL + "sellers/find_id/phone";

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
    return error.message;
  });
};

export const findPasswordByEmail = (data) => {
  const url = API_BASE_URL + "sellers/find_pw/email";

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
    return error.message;
  });
};

export const findPasswordByPhone = (data) => {
  const url = API_BASE_URL + "sellers/find_pw/phone";

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
    return error.message;
  });
};


export const changeSellerId = (data) => {
  const url = API_BASE_URL + "sellers/change_id";

  return fetch(url, {
    method: 'PUT',
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
    return error.message;
  });
};

export const changePassword = (data) => {
  const url = API_BASE_URL + "sellers/change_pw";

  return fetch(url, {
    method: 'PUT',
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
    return error.message;
  });
}

export const changeShopAddress = (data) => {
  const url = API_BASE_URL + "sellers/change_address";

  return fetch(url, {
    method: 'PUT',
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
    return error.message;
  });
}

export const updateBusinessInfo = (data) => {
  const url = API_BASE_URL + "sellers/change_address";

  return fetch(url, {
    method: 'PUT',
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
    return error.message;
  });
}
