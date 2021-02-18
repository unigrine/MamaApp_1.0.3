import { API_BASE_URL } from "../../utils/config";

export const getNewsEventCategory = () => {
  const url = API_BASE_URL + "news_event/types";
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

export const updateCeoReport = (data) => {
  const url = API_BASE_URL + "reports/" + data.id;

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

export const deleteCeoReport = (data) => {
  const url = API_BASE_URL + "reports/" + data.id;

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
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

export const getCeoReport = (data) => {
  const url = API_BASE_URL + "reports/shop/" + data.shop_id;
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
    return error.message;
  });
};

export const replyCeoReport = (data) => {
  const url = API_BASE_URL + "reports/reply";

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
    return error.message;
  });
};

export const updateReplyByCeo = (data) => {
  const url = API_BASE_URL + "reports/reply/"+ data.id;

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

export const deleteReplyByCeo = (data) => {
  const url = API_BASE_URL + "reports/reply/" + data.id;

  return fetch(url, {
    method: 'DELETE',
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
    return error.message;
  });
};

export const reportHopeToCeoByCeo = (data) => {
  const url = API_BASE_URL + "reports/sellerDeclaration";

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

export const reportHopeToCeoByCustomer = (data) => {
  const url = API_BASE_URL + "reports/customerDeclaration";

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
