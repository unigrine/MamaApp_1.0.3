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

export const registerNewsEvent = (data) => {
  const url = API_BASE_URL + "news_event";

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
    return error?.message;
  });
};

export const updateNewsEvent = (data) => {
  const url = API_BASE_URL + "news_event/" + data.id;

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
    return error?.message;
  });
};

export const deleteNewsEvent = (data) => {
  const url = API_BASE_URL + "news_event/" + data.id;

  return fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data; ',
      Authorization: `Bearer ${data.token}`,
    },
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return error?.message;
  });
};

export const getNewsEvent = (data) => {
  const url = API_BASE_URL + "news_event/seller/" + data.shop_id;
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
    return error?.message;
  });
};


export const reportToNewsEventComment = (data) => {
  const url = API_BASE_URL + "news_event/comment/declaration";

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

export const reportToNewsEvent = (data) => {
  const url = API_BASE_URL + "news_event/declaration";

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
        return error?.message;
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
        return error?.message;
      });
};
