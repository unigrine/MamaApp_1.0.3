import { StyleSheet, Platform, StatusBar } from 'react-native';
// const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 10;
export default StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT
    }
});