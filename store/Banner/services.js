import { API_BASE_URL } from "../../utils/config";

export const getBannerText = () => {
  const url = API_BASE_URL + "banners_text";
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
