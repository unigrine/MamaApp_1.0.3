// Powered By mama team
// www.mamateam.co
// Terms: https://mamateam.co/terms-and-conditions
// Started in (2020-11-15)

import React, {Fragment}   from "react";
import {
    View
} from "react-native";
import GeneralStatusBarColor from "../../constants/themes/GeneralStatusBarColor";
import theme from "../../constants/themes/theme";
import language from "../../constants/language"
import Header from "../../component/Header"
import {
    SetMyLocationAction,
    AddAddressHistoryAction
} from "../../store/Config/action";
import {connect} from 'react-redux';
import {
    getAddressByKeywordForKakao
} from "../../utils/global";
import Toast from "react-native-simple-toast";
import Postcode from 'react-native-daum-postcode';
import {processAddressData, processLocationData} from "../../utils/location";
import {isEmptyCheck} from "../../utils/regex";
import {ActivityIndicator} from "react-native-paper";
import {CommonStyle} from "../../constants/style";
import {SetSelectedAddressAction} from "../../store/Shop/action";

class AddressFindScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    onSelectedItem = async (item) => {
        // console.log(`item: ${JSON.stringify(item)}`);

        let address = item?.jibunAddress;
        if (isEmptyCheck(address)) {
            address = item?.roadAddress;
        }
        await getAddressByKeywordForKakao(address).then(async result => {
            let addressResult = await processAddressData(result);

            this.props.SetSelectedAddress(addressResult);
            this.props.navigation.goBack();
        }).catch(err => {
            this.props.navigation.goBack();
        })
    }

    render() {
        return (
            <Fragment>
                <View style={{ flex: 1, backgroundColor: theme.white, width: "100%", height: "100%" }}>
                    <GeneralStatusBarColor backgroundColor={theme.white}
                                           hidden={true}
                                           barStyle={'light-content'}
                    />

                    <Header leftIcon="angle-left" title={language.DETAIL_LOCATION_SET} navigation={this.props.navigation}/>

                    <Postcode
                        // style={{ flex: 1 }}
                        jsOptions={{ animation: false }}
                        onSelected={(data) => this.onSelectedItem(data)}
                    />
                </View>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        SetSelectedAddress: (data) => dispatch(SetSelectedAddressAction(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressFindScreen);
