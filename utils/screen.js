import {Dimensions} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";
import { getBottomSpace, isIphoneX } from "react-native-iphone-x-helper";

const WIDTH = Dimensions.get('window').width;   // 화면 width
const HEIGHT = Dimensions.get('window').height   // 화면 height
const height= HEIGHT - getStatusBarHeight();   // Iphone X 이전의 버전 height
const height2 = HEIGHT - getStatusBarHeight() - getBottomSpace();  // Iphone X 이후의 버전 height

export const getHeaderPaddingTop = () => {
    // console.log(`getStatusBarHeight(): ${getStatusBarHeight()}`);
    // console.log(`getBottomSpace(): ${getBottomSpace()}`);
    if (isIphoneX()) {
        return getBottomSpace();
    }
    else {
        return 0;
    }
}
