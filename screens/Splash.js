// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    ImageBackground
} from 'react-native';
import theme from '../constants/themes/theme';
import {
    SetMyLocationAction,
} from '../store/Config/action';
import {connect} from 'react-redux';
import {getCurrentLocationData, defaultLocationData, requestLocation} from '../utils/location';
import {isEmptyCheck} from "../utils/regex";
import {getCustomerAuthData} from "../utils/auth";
import {SetCustomerAuthAction} from "../store/CustomerAuth/action";

class Splash extends React.Component {

    async componentDidMount() {
        const { longitude, latitude } = await getCurrentLocationData();
        await StatusBar.setHidden(true);

        // 위치 서비스 설정
        if (isEmptyCheck(longitude) || isEmptyCheck(latitude)) {
            this.props.SetMyLocation(defaultLocationData);
        }
        else {
            this.props.SetMyLocation(await getCurrentLocationData());
        }

        requestLocation(async (data) => {
            this.props.SetMyLocation(data);
        });

        // 소비자/사장님 auth 설정
        const customerAuth = await getCustomerAuthData();
        if (!isEmptyCheck(customerAuth?.token)) {
            this.props.SetCustomerAuth(customerAuth);
        }

        setTimeout(() => {
            this.props.navigation.replace('Onboard');
        }, 1100);
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageBackground source={require("../assets/images/image/img_splash.png")}
                                 style={{width: '100%', height: '100%'}}>
                    <View style={styles.layout}>
                        <Image source={theme.consumer_ceo} style={styles.logoconsumer}/>
                        <Image source={theme.logo_mama_w} style={styles.logomama}/>
                    </View>
                    <View style={styles.layout}>
                        <View style={styles.layout}>
                            <Image source={theme.logo_heart} style={styles.logoheart}/>
                        </View>
                        <View style={styles.layout}>
                            <Image source={theme.marketplace} style={styles.logomarketplace}/>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bannerlist: state.banner.bannerlist,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        SetMyLocation: (data) => dispatch(SetMyLocationAction(data)),
        SetCustomerAuth: (data) => dispatch(SetCustomerAuthAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: theme.primary,
    },
    layout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoheart: {
        height: '55%',
        resizeMode: 'contain',
    },
    logoconsumer: {
        height: '6%',
        resizeMode: 'contain',
    },
    logomama: {
        marginTop: 30,
        height: '10%',
        resizeMode: 'contain',
    },
    logomarketplace: {
        height: '15%',
        resizeMode: 'contain',
    },
});
