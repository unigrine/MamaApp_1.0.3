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

class DetailArea extends React.Component {

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
            // console.log(`result: ${JSON.stringify(result)}`);
            let addressResult = await processAddressData(result);

            this.props.SetMyLocation(addressResult);
            this.props.AddCurrentAddressHistory(addressResult);
            this.props.navigation.replace('MainScreen');
        }).catch(err => {
            this.props.navigation.replace('MainScreen');
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
        address_history_list: state.userstatus.address_history_list
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        AddCurrentAddressHistory: (data) => dispatch(AddAddressHistoryAction(data)),
        SetMyLocation: (data) => dispatch(SetMyLocationAction(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailArea);
