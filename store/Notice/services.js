import { API_BASE_URL } from "../../utils/config";

export const getNotice = () => {
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
