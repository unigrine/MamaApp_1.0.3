import { StyleSheet, Platform } from 'react-native';
import theme from '../themes/theme';
import { ThemeProvider } from '@react-navigation/native';
import {getHeaderPaddingTop} from "../../utils/screen";

const CommonStyle  =  StyleSheet.create({
    container: {
        flex: 1,
    },
    headr_container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: getHeaderPaddingTop(),
        paddingBottom: 20,
        alignItems: 'center',
    },
    headr_detail_container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: getHeaderPaddingTop(),
        paddingBottom: 20,
        alignItems: 'center',
    },
    row: {
        flexDirection: "row",
        alignContent: 'center',
    },
    row_sb: {
        flexDirection: "row",
        alignContent: 'center',
        justifyContent: "space-between",
        alignItems: "center"
    },
    row_v_center: {
        flexDirection: "row",
        alignItems: 'center',
    },
    inputWrapper: {
        marginTop: 30,
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5
    },
    bottomLine: {
        borderBottomColor: theme.grey1,
        borderBottomWidth: 0.5
    },
    textTitle: {
        fontSize: theme.font13,
        fontWeight: 'bold'
    },
    textSmall: {
        fontSize: theme.fontSmall,
        color: theme.grey1
    },
    submitbutton: {
        borderRadius: 2,
        backgroundColor: theme.grey1,
        justifyContent:'center',
        paddingVertical: 14,
    },
    spinnerStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 100,
        justifyContent: "center",
    },
    lazySpinnerStyle: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    applybtn: {
        backgroundColor: theme.primary,
        height: 30,
        width: 140,
        borderRadius: 100,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btntext: {
        color: '#fff',
        fontSize: theme.font14
    },
    box: {
        width: '100%',
        backgroundColor: '#e5e5e570',
        borderRadius: 5,
        height: 45,
        marginTop: 5
    },
    boxbig: {
        width: '100%',
        backgroundColor: '#e5e5e570',
        borderRadius: 5,
        height: 85,
        marginTop: 5
    },
    eventView: {
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical: 2,
      },
    event: {
        color: theme.white,
        fontSize: theme.font14,
        fontWeight: "bold"
    },
    discountLayout: {
        paddingLeft: 0,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: "center"
    },
    taghint: {
        color: theme.hintColor,
        fontSize: theme.fontSmall,
        paddingRight: 5,
    },
    shopHeaderText: {
        color: theme.gray1,
        fontSize: theme.font17,
        fontWeight: 'bold',
    },
    newseventHeaderText: {
        color: theme.gray1,
        fontSize: theme.fontMedium,
        fontWeight: 'bold',
        paddingTop: 5,
    },
    mh_16: {
        marginHorizontal: 16
    },
    mt_16: {
        marginTop: 16
    },
    mt_8: {
        marginTop: 8
    },
    input: {
        width: '100%',
        fontSize: theme.font14,
        paddingHorizontal: 10,
        ...(Platform.OS !== 'android' && {
            paddingVertical: 15
        })
    },
    mt_10_ios: {
        ...(Platform.OS !== 'android' && {
          marginTop: 10
        })
    },
    mt_30_ios: {
        ...(Platform.OS !== 'android' && {
            marginTop: 30
        })
    },
    checkbox: {
        // flexGrow: 1,
        height: 18,
        width: 28,
        ...(Platform.OS !== 'android' && {
            // paddingRight: 20
        })
    }
});


export {CommonStyle}
