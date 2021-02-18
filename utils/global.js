import { LoginButton, AccessToken, ShareDialog, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import { connect, useDispatch, useSelector } from "react-redux";

export const FacebookSignin = async () => {
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    // throw 'User cancelled the login process';
    // console.log(result)
    return null;
  }

  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    // throw 'Something went wrong obtaining access token';
    return null;
  }

  return data
}

export const getPublicProfile = async () => {
  const infoRequest = new GraphRequest(
    '/me?fields=id,name,email,picture.type(large)',
    null,
    (error, result) => {
      if (error) {
        // console.log('Error fetching data: ' + error.toString());
        return null
      } else {
        return result
      }
    }
  );
  new GraphRequestManager().addRequest(infoRequest).start();
}

export const getAddressByKeywordForKakao = (keyword, page = 1) => {
  let url = `https://dapi.kakao.com/v2/local/search/address.json?query=${keyword}`;

  return fetch(url, {
    type: 'GET',
    headers: {
      "Authorization": "KakaoAK 6cb92ab77795e9827e93dd8cd7bce5c4",
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return "error";
  });
};

export const getAddressByLocationForKakao = (latitude, longitude) => {
  let url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;

  return fetch(url, {
    type: 'GET',
    headers: {
      "Authorization": "KakaoAK 6cb92ab77795e9827e93dd8cd7bce5c4",
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return "error";
  });
};

// 네이버 api 이용한 주소검색(Geocoding)
export const getAddressByKeywordForNaver = (keyword) => {
  url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query="+keyword

  return fetch(url, {
    type: 'GET',
    headers: {
      "X-NCP-APIGW-API-KEY-ID": "tkwwkwa5ko",
      "X-NCP-APIGW-API-KEY": "ysHQoRYdvWjYFiLDZfClTaHdaNIRQj6zAM3ghNTT"
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return "error";
  });
};

// 네이버 api 이용한 주소검색(reverse-geocoding)
export const getAddressByLocationForNaver = (latitude, longitude) => {
  url = "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=" +
        longitude + "," + latitude + "&sourcecrs=epsg:4326&output=json&orders=addr,roadaddr"

  return fetch(url, {
    type: 'GET',
    headers: {
      "X-NCP-APIGW-API-KEY-ID": "tkwwkwa5ko",
      "X-NCP-APIGW-API-KEY": "ysHQoRYdvWjYFiLDZfClTaHdaNIRQj6zAM3ghNTT"
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return "error";
  });
};

export const getAddressByGoogle = (latitude, longitude) => {
  let api_key = "AIzaSyBHlEBeRKJvItmHK7HK6zCUa475I4UDyHQ"
  url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&language=ko&key="+api_key

  return fetch(url, {
    type: 'GET',
    headers: {

    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    return responseJson
  })
  .catch((error) => {
    return "error";
  });
};

export const validatePhoneNumber = (phone) => {
  var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
  return regexp.test(`+82${phone}`)
}
